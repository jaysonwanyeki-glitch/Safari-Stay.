import type { BookedRange } from "@/lib/data";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function localIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * "Booked dates this month" strip — a compact calendar for the current month
 * with days already taken (from real bookings) marked as booked.
 */
export default function AvailabilityStrip({ ranges }: { ranges: BookedRange[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const todayIso = localIso(now);

  const bookedSet = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.checkIn + "T00:00:00");
    const end = new Date(r.checkOut + "T00:00:00");
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) bookedSet.add(localIso(d));
    }
  }

  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  // Only future (or today's) unbooked nights are actually bookable.
  let availableNights = 0;
  for (let d = new Date(year, month, now.getDate()); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
    if (!bookedSet.has(localIso(d))) availableNights++;
  }

  return (
    <div className="rounded-2xl border border-sand-200 bg-white/90 p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold">Booked dates this month</h3>
        <span className="text-xs font-semibold text-sand-600">{monthLabel}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-[10px] font-bold uppercase tracking-wide text-sand-600">
            {w}
          </div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const booked = bookedSet.has(iso);
          const past = iso < todayIso;
          const isToday = iso === todayIso;
          const cell = booked
            ? "bg-brand text-white"
            : past
              ? "bg-sand-100/60 text-sand-400"
              : "bg-sand-50 text-ink hover:bg-sand-200";
          return (
            <div
              key={day}
              title={booked ? "Booked" : past ? "Past" : "Available"}
              className={`grid h-8 place-items-center rounded-lg text-xs font-semibold ${cell} ${
                isToday ? "ring-2 ring-brand ring-offset-1" : ""
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sand-700">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sand-50 ring-1 ring-sand-200" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sand-100/60" /> Past
        </span>
        <span className="ml-auto font-bold text-ink">{availableNights} nights free from today</span>
      </div>
    </div>
  );
}
