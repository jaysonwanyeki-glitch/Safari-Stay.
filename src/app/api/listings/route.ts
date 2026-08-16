import { NextRequest } from "next/server";
import { getListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const items = await getListings({
    region: sp.get("region") || undefined,
    type: sp.get("type") || undefined,
    tier: sp.get("tier") || undefined,
    guests: Number(sp.get("guests") || 0) || undefined,
    minPrice: Number(sp.get("minPrice") || 0) || undefined,
    maxPrice: Number(sp.get("maxPrice") || 0) || undefined,
    q: sp.get("q") || undefined,
    near: sp.get("near") || undefined,
    sort: (sp.get("sort") as
      | "recommended"
      | "price_asc"
      | "price_desc"
      | "rating"
      | "reviews"
      | undefined),
  });
  return Response.json(items);
}
