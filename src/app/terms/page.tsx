import type { Metadata } from "next";
import InfoPage, { RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of service · SafariStay",
  description: "The terms that govern booking, hosting and using SafariStay.",
};

export default function TermsPage() {
  return (
    <InfoPage
      crumb="Terms of service"
      title="Terms of service"
      sub="The short version: book with confidence, host with honesty, and treat every stay like it's your own home."
      photo={20653421}
      photoAlt="Kenyan lake at sunset"
    >
      <Section title="1. The platform">
        <p>
          SafariStay connects travellers with hosts across Kenya — guesthouses, camps, bandas, cottages and lodges. We are a
          marketplace, not a hotel: each stay is hosted and operated by the property listed. This is a demonstration platform; the
          booking flow works end-to-end but no real money moves.
        </p>
      </Section>

      <Section title="2. Bookings">
        <p>
          A booking is confirmed when you complete checkout and receive an <span className="font-mono">SS</span> reference. M-Pesa
          bookings start as <em>pending</em> until the STK push PIN is confirmed; pay-at-property bookings confirm instantly. Prices
          are in Kenyan shillings and include any cleaning fee and the platform fee. Seasonal rates apply: the nightly rate follows
          green, shoulder and peak seasons on your selected dates.
        </p>
      </Section>

      <Section title="3. Cancellations">
        <p>
          Bookings cancel free of charge up to 48 hours before check-in. Inside the window, cancellation is only possible by
          agreement with the host. See the <a href="/cancellations" className="font-semibold text-brand hover:underline">cancellation options</a>{" "}
          page for the full policy.
        </p>
      </Section>

      <Section title="4. Host responsibilities">
        <p>
          Hosts agree to describe their property accurately, honour published rates and discounts, provide the power, water and
          Wi-Fi stated on their Stima &amp; Maji card, and treat guests with respect. We may remove listings that misrepresent
          themselves or break our responsible-travel commitments.
        </p>
      </Section>

      <Section title="5. Liability">
        <p>
          To the extent permitted by law, SafariStay is not liable for losses arising from stays, travel disruptions, or the acts of
          hosts or third parties. We provide accurate information in good faith — rates are published seasonal rates and weather and
          FX data come from third-party providers. Guests should take reasonable safety precautions and carry travel insurance.
        </p>
      </Section>

      <Section title="6. General">
        <p>
          These terms are governed by the laws of Kenya. If any provision is unenforceable, the rest remain in force. We may update
          these terms — significant changes will be noted on this page. Questions? Visit the{" "}
          <a href="/help" className="font-semibold text-brand hover:underline">Help Centre</a>.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/privacy", label: "Privacy policy", blurb: "What we collect, why, and your rights." },
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/report", label: "Report a concern", blurb: "Tell us about a problem with a stay or host." },
        ]}
      />
    </InfoPage>
  );
}
