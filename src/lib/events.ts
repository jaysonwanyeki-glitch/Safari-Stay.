/**
 * Custom DOM event connecting the availability strip to the booking widget.
 * The strip dispatches it when a guest taps an available day; the widget
 * listens and sets that day as the check-in date.
 */
export const PICK_CHECKIN_EVENT = "safaristay:pick-checkin";

export type PickCheckinDetail = {
  /** ISO date (yyyy-mm-dd) of the day tapped in the strip. */
  date: string;
  /** Listing the day was picked on — listeners ignore events for other listings. */
  listingId: number;
};
