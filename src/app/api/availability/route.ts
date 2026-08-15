import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { seasonForDate, SEASON_LABEL, SEASON_EMOJI } from "@/lib/seasons";
import { getUsdToKes } from "@/lib/currency";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const listingId = Number(req.nextUrl.searchParams.get("listingId"));
  if (!Number.isInteger(listingId) || listingId <= 0) {
    return Response.json({ error: "Invalid listingId" }, { status: 400 });
  }

  const rows = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(eq(bookings.listingId, listingId))
    .orderBy(desc(bookings.checkIn));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Future stays block the calendar; recent stays power the "booked lately" stats.
  const booked: { checkIn: string; checkOut: string }[] = [];
  let bookedThisWeek = 0;
  let bookedThisMonth = 0;
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 30);

  for (const r of rows) {
    const inDate = new Date(r.checkIn + "T00:00:00");
    const outDate = new Date(r.checkOut + "T00:00:00");
    // Future stays AND stays in progress block the calendar.
    if (outDate > today) booked.push({ checkIn: r.checkIn, checkOut: r.checkOut });
    if (inDate >= monthAgo && inDate <= today) bookedThisMonth++;
    if (inDate >= weekAgo && inDate <= today) bookedThisWeek++;
  }

  const season = seasonForDate(new Date());
  const usdPerKes = await getUsdToKes();

  return Response.json({
    listingId,
    booked,
    season: {
      key: season,
      label: SEASON_LABEL[season],
      emoji: SEASON_EMOJI[season],
    },
    stats: { bookedThisWeek, bookedThisMonth },
    usdPerKes,
  });
}
