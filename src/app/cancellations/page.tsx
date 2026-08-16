import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Cancellation options · SafariStay",
  description:
    "Our cancellation policy — free cancellation up to 48 hours before check-in, how to cancel, and how refunds work with M-Pesa.",
};

export default function CancellationsPage() {
  return (
    <InfoPage
      crumb="Cancellation options"
      title="Flexible, fair, Kenyan"
      sub="Plans change — that's life. Cancel free of charge up to 48 hours before check-in and your dates open up for another traveller."
      photo={7734639}
      photoAlt="Lake Naivasha shoreline at sunset"
    >
      <PhotoStrip
        photos={[
          { id: 20653797, alt: "Western Kenya highlands", caption: "Plans change — cancellation is easy from the My Bookings page." },
          { id: 14025911, alt: "Guesthouse room", caption: "Pay-at-property bookings cancel with zero fuss." },
          { id: 28148281, alt: "Room with warm light", caption: "M-Pesa refunds go straight back to the number you paid from." },
        ]}
      />

      <Section title="The 48-hour window">
        <p>
          Every booking can be cancelled <strong>free of charge up to 48 hours before check-in</strong> (Kenya time). Inside that
          window — or once the stay has started — cancellation is no longer possible through the site; contact the host on WhatsApp
          to work something out.
        </p>
        <p>
          The countdown is automatic: the booking page shows whether your stay still qualifies, and the server enforces it on every
          cancellation request.
        </p>
      </Section>

      <Section title="How to cancel">
        <ol className="ml-5 list-decimal space-y-2">
          <li>Go to <Link href="/bookings" className="font-semibold text-brand hover:underline">My Bookings</Link> and enter your <span className="font-mono">SS</span> reference or email.</li>
          <li>Find the stay and tap <strong>Cancel</strong> — if you&apos;re inside the 48-hour window it cancels immediately.</li>
          <li>Your dates free up on the calendar, and any M-Pesa payment is refunded (simulated in this demo).</li>
        </ol>
      </Section>

      <Section title="Refunds">
        <p>
          <strong>M-Pesa bookings:</strong> the full amount returns to the phone number that paid — no forms, no waiting weeks. In
          this demo the refund is simulated; in production it would be a Lipa na M-Pesa reversal.
        </p>
        <p>
          <strong>Pay-at-property bookings:</strong> nothing has been charged, so there&apos;s nothing to refund — the cancellation
          simply closes the booking.
        </p>
        <p>
          <strong>Non-refundable extras:</strong> airport transfers are arranged with the host and are subject to their own
          cancellation terms — check with the host if your travel plans shift.
        </p>
      </Section>

      <Section title="Force majeure & the long rains">
        <p>
          Kenya&apos;s weather can be dramatic — flooded roads, washed-out tracks and the long rains (March–May) do disrupt travel.
          If you can&apos;t reach your stay because of severe weather or a national emergency, contact us through{" "}
          <Link href="/report" className="font-semibold text-brand hover:underline">Report a concern</Link> and we&apos;ll work with
          the host on a full or partial refund, date change or credit.
        </p>
      </Section>

      <Section title="Group & monthly stays">
        <p>
          Long stays (28+ nights) and big groups get published discounts at checkout. The same 48-hour rule applies, but for
          longer stays hosts often offer more flexibility — message them on WhatsApp before you book to agree the terms.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/safety", label: "Safety information", blurb: "Emergency contacts and safe-travel guidance." },
          { href: "/report", label: "Report a concern", blurb: "Tell us about a problem with a stay or host." },
        ]}
      />
    </InfoPage>
  );
}
