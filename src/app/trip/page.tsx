import type { Metadata } from "next";
import Link from "next/link";
import TripPlanner from "@/components/TripPlanner";
import { T } from "@/components/Localized";
import { getListings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trip planner · SafariStay Kenya",
  description:
    "Plan your Kenyan route day by day from the stays you've saved — then share the trip with travel companions.",
};

export const dynamic = "force-dynamic";

export default async function TripPage() {
  const listings = await getListings();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-sand-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        <span className="truncate text-sand-800">
          <T k="trip.title" />
        </span>
      </nav>

      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          <T k="trip.title" />
        </h1>
        <p className="mt-2 text-sand-700">
          <T k="trip.sub" />
        </p>
      </div>

      <TripPlanner listings={listings} />
    </div>
  );
}
