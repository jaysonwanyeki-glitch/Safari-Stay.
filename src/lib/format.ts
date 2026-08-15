/** Format a number as Kenyan Shillings, e.g. 18500 -> "KES 18,500" */
export function formatKes(value: number): string {
  return `KES ${Math.round(value).toLocaleString("en-KE")}`;
}

/** Booking reference code, e.g. 12 -> "SS-00012". */
export function bookingRef(id: number): string {
  return `SS-${String(id).padStart(5, "0")}`;
}

/** Compact money for map badges, e.g. 18500 -> "KES 18k" */
export function formatKesShort(value: number): string {
  if (value >= 1000) {
    return `KES ${Math.round(value / 1000)}k`;
  }
  return `KES ${value}`;
}

/** Convert a snake_case or kebab type into a friendly label */
export function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a date string (yyyy-mm-dd) to "Mar 2025" */
export function formatMonthYear(value: string): string {
  const d = new Date(value + "T00:00:00");
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
