import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { Faq, PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Help Centre · SafariStay",
  description:
    "Guides and answers for booking, paying with M-Pesa, cancelling, travelling in Kenya and more.",
};

export default function HelpPage() {
  return (
    <InfoPage
      crumb="Help Centre"
      title="How can we help?"
      sub="Step-by-step guides for searching, booking, paying and travelling — written for Kenya, from the matatu stage to the Maasai Mara."
      photo={20653797}
      photoAlt="Lakeside scenery in Western Kenya"
    >
      <PhotoStrip
        photos={[
          { id: 14025910, alt: "A clean guesthouse room", caption: "Find a stay that fits your budget, region and dates with our filters." },
          { id: 28157088, alt: "Tented camp at sunset", caption: "Seasonal rates mean prices shift with green, shoulder and peak seasons." },
          { id: 20653421, alt: "Lake view at dusk", caption: "Check the weather and Stima & Maji honesty cards before you book." },
        ]}
      />

      <Section title="Searching & booking">
        <p>
          Browse by <Link href="/listings" className="font-semibold text-brand hover:underline">region, category, price band or price tier</Link>{" "}
          — from budget town guesthouses to full safari lodges. Tap the search bar in the header to filter by region, dates and guest
          count, or use the quick links on the home page.
        </p>
        <p>
          Every listing shows its <strong>green-season (low) rate</strong> and <strong>peak-season rate</strong> in Kenyan shillings,
          plus the cleaning fee, max guests and check-in/out times. Availability is real: dates already booked by other guests are
          blocked on the calendar, so you never double-book.
        </p>
        <p>
          To book, pick your dates on the stay page, choose <strong>M-Pesa (Lipa na M-Pesa)</strong> or{" "}
          <strong>Pay at property</strong>, verify your Kenyan phone number with the demo OTP, and confirm. You&apos;ll get an{" "}
          <span className="font-mono">SS-00001</span> reference to look your booking up anytime.
        </p>
      </Section>

      <Section title="Payment — M-Pesa vs pay at property">
        <p>
          <strong>M-Pesa (Lipa na M-Pesa):</strong> the booking starts as <em>pending</em> and you confirm it with the STK push PIN
          (in this demo the code is shown on screen). Confirmed M-Pesa bookings can be found under My Bookings.
        </p>
        <p>
          <strong>Pay at property:</strong> your booking is confirmed instantly and you settle in cash or M-Pesa at the stay — the
          way most Kenyan town guesthouses actually work. No card required.
        </p>
        <p>
          All totals are shown in KES and converted to USD for reference. The platform fee (7%) is included transparently in the
          price breakdown. This is a demo — no real money moves.
        </p>
      </Section>

      <Section title="Cancellations & refunds">
        <p>
          You can cancel <strong>free of charge up to 48 hours before check-in</strong>. Cancelled bookings free the dates for
          other guests, and any M-Pesa payment is refunded to the same number (simulated in the demo). See the{" "}
          <Link href="/cancellations" className="font-semibold text-brand hover:underline">cancellation options</Link> page for
          details.
        </p>
      </Section>

      <Section title="Travelling in Kenya">
        <p>
          The site&apos;s <Link href="/safety" className="font-semibold text-brand hover:underline">safety information</Link> covers
          getting around, staying safe and staying healthy. Weather is live per listing via Open-Meteo, and season dates follow the
          real Kenyan tourism calendar — the long rains (March–May) are the cheapest time to travel, while July–October is the
          Great Migration peak.
        </p>
        <PhotoStrip
          photos={[
            { id: 5306140, alt: "Safari landscape at golden hour", caption: "July–October is peak season in the Mara — book early." },
            { id: 7734639, alt: "Lake Naivasha shoreline", caption: "Green season (Mar–May) means lush views and big discounts." },
            { id: 33473215, alt: "Rift Valley lake", caption: "Shoulder months (Feb, Jun, Nov) balance price and game viewing." },
          ]}
        />
      </Section>

      <Section title="Frequently asked questions">
        <Faq
          items={[
            {
              q: "Do I need to pay a deposit?",
              a: "No deposit is charged. Pay-at-property bookings confirm instantly and you pay at the stay; M-Pesa bookings are confirmed with the STK push PIN.",
            },
            {
              q: "What does the SS reference do?",
              a: "Your SS reference (e.g. SS-00012) is your booking ID. Enter it on the My Bookings page — or your email — to view, confirm or cancel your stay.",
            },
            {
              q: "Can I change my dates?",
              a: "Yes — cancel within the 48-hour window and rebook for your new dates, provided they're still available on the calendar.",
            },
            {
              q: "Are group or monthly discounts automatic?",
              a: "Yes. Stays of 28+ nights and groups of 5+ guests get the host's published discount, applied automatically in the price breakdown.",
            },
            {
              q: "What is the Stima & Maji card?",
              a: "Every listing honestly states its power backup, water source and Wi-Fi type — generator, borehole, fibre and so on — so you know exactly what to expect, blackouts and all.",
            },
            {
              q: "Is the booking flow real?",
              a: "This is a working demo: bookings are stored and enforceable, but M-Pesa, OTP and refunds are simulated. No real money moves.",
            },
          ]}
        />
      </Section>

      <Section title="Still stuck?">
        <p>
          Message any host directly on WhatsApp from their listing page, or{" "}
          <Link href="/report" className="font-semibold text-brand hover:underline">report a concern</Link> and our team will pick
          it up within 24 hours.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/safety", label: "Safety information", blurb: "Travel, wildlife and health guidance for Kenya." },
          { href: "/cancellations", label: "Cancellation options", blurb: "The 48-hour window and how refunds work." },
          { href: "/report", label: "Report a concern", blurb: "Tell us about a problem with a stay or a host." },
        ]}
      />
    </InfoPage>
  );
}
