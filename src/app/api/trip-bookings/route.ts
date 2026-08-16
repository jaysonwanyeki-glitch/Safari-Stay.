import { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { bookings, listings } from "@/db/schema";
import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import { stayPricing } from "@/lib/seasons";
import { SERVICE_FEE_RATE } from "@/lib/constants";
import { bookingRef } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Unambiguous alphabet for itinerary codes (no 0/O/1/I). */
const CODE_ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newItineraryRef(): string {
  const buf = randomBytes(6);
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE_ALPHA[buf[i] % CODE_ALPHA.length];
  return `SS-ITN-${s}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function validKenyanPhone(phone: string): boolean {
  return /^(\+254|0)7\d{8}$/.test(phone.replace(/[\s-]/g, ""));
}

type TripItem = { listingId: number; day: number; nights: number };

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const startDate = String(body.startDate ?? "");
  const guests = Number(body.guests);
  const guestName = String(body.guestName ?? "").trim();
  const guestEmail = String(body.guestEmail ?? "").trim();
  const guestPhone = String(body.guestPhone ?? "").trim();
  const guestVerified = Boolean(body.guestVerified);
  const paymentMethod = String(body.paymentMethod ?? "property");
  const tripName = String(body.tripName ?? "").trim().slice(0, 80);
  const rawItems = Array.isArray(body.items) ? (body.items as unknown[]) : [];

  const items: TripItem[] = rawItems
    .map((it) => {
      const o = it as Record<string, unknown>;
      return {
        listingId: Number(o.listingId),
        day: Number(o.day),
        nights: Number(o.nights),
      };
    })
    .filter(
      (it) =>
        Number.isInteger(it.listingId) &&
        it.listingId > 0 &&
        Number.isInteger(it.day) &&
        it.day >= 1 &&
        Number.isInteger(it.nights) &&
        it.nights >= 1 &&
        it.nights <= 30,
    )
    .sort((a, b) => a.day - b.day);

  const today = new Date().toISOString().slice(0, 10);
  if (
    items.length === 0 ||
    items.length > 20 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    startDate < today ||
    !Number.isInteger(guests) ||
    guests <= 0 ||
    guestName.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(guestEmail)
  ) {
    return Response.json({ error: "Missing or invalid trip details" }, { status: 422 });
  }
  if (paymentMethod !== "mpesa" && paymentMethod !== "property") {
    return Response.json({ error: "Invalid payment method" }, { status: 422 });
  }
  if (!validKenyanPhone(guestPhone)) {
    return Response.json(
      { error: "Enter a valid Kenyan phone number (e.g. 07XXXXXXXX)" },
      { status: 422 },
    );
  }

  // Load the stays once — pricing + availability run server-side so the total
  // the guest is charged is the total we computed.
  const ids = [...new Set(items.map((i) => i.listingId))];
  const listingRows = await db
    .select()
    .from(listings)
    .where(inArray(listings.id, ids));
  const listingMap = new Map(listingRows.map((l) => [l.id, l]));
  for (const it of items) {
    if (!listingMap.has(it.listingId)) {
      return Response.json({ error: "A stay in this trip no longer exists" }, { status: 404 });
    }
  }

  // Per-stay dates + availability check (cancelled bookings free their dates).
  const legs: {
    item: TripItem;
    checkIn: string;
    checkOut: string;
    nights: number;
    subtotal: number;
    discount: number;
    serviceFee: number;
    totalKes: number;
    listing: (typeof listingRows)[number];
  }[] = [];

  for (const it of items) {
    const listing = listingMap.get(it.listingId)!;
    const checkIn = addDays(startDate, it.day - 1);
    const checkOut = addDays(checkIn, it.nights);
    const clash = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.listingId, it.listingId),
          ne(bookings.status, "cancelled"),
          lt(bookings.checkIn, checkOut),
          gt(bookings.checkOut, checkIn),
        ),
      )
      .limit(1);
    if (clash.length > 0) {
      return Response.json(
        { error: `${listing.title} is already booked on those dates`, listingId: it.listingId },
        { status: 409 },
      );
    }

    const pricing = stayPricing(
      {
        pricePerNight: listing.pricePerNight,
        peakPricePerNight: listing.peakPricePerNight,
        monthlyDiscountPct: listing.monthlyDiscountPct,
        groupDiscountPct: listing.groupDiscountPct,
      },
      checkIn,
      checkOut,
      guests,
    );
    const discounted = pricing.subtotal - pricing.discount;
    const serviceFee = Math.round(discounted * SERVICE_FEE_RATE);
    legs.push({
      item: it,
      checkIn,
      checkOut,
      nights: pricing.nights,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      serviceFee,
      totalKes: discounted + listing.cleaningFee + serviceFee,
      listing,
    });
  }

  const itineraryRef = newItineraryRef();
  const status = paymentMethod === "mpesa" ? "pending" : "confirmed";

  const inserted = await db
    .insert(bookings)
    .values(
      legs.map((leg) => ({
        listingId: leg.item.listingId,
        guestName,
        guestEmail,
        guestPhone,
        guestVerified,
        checkIn: leg.checkIn,
        checkOut: leg.checkOut,
        guests,
        nights: leg.nights,
        totalKes: leg.totalKes,
        paymentMethod,
        status,
        itineraryRef,
        tripName: tripName || null,
      })),
    )
    .returning({ id: bookings.id });

  const totalKes = legs.reduce((s, l) => s + l.totalKes, 0);

  return Response.json(
    {
      ok: true,
      itineraryRef,
      tripName: tripName || null,
      totalKes,
      count: inserted.length,
      status,
      bookings: inserted.map((r, i) => ({
        id: r.id,
        ref: bookingRef(r.id),
        status,
        listingTitle: legs[i].listing.title,
        day: legs[i].item.day,
      })),
    },
    { status: 201 },
  );
}
