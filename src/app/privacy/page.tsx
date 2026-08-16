import type { Metadata } from "next";
import InfoPage, { RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy policy · SafariStay",
  description: "What SafariStay collects, why, and the rights you have over your data.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      crumb="Privacy policy"
      title="Privacy policy"
      sub="Clear and simple: we collect what we need to run bookings, we keep it safe, and we never sell it."
      photo={33473215}
      photoAlt="Rift Valley lake from above"
    >
      <Section title="What we collect">
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Booking details</strong> — your name, email, Kenyan phone number, dates and stay choices, so we can confirm and manage your booking.</li>
          <li><strong>Preferences</strong> — your language choice (EN/SW) and wishlist, stored in your browser&apos;s local storage.</li>
          <li><strong>Technical data</strong> — basic, anonymous usage data that helps us keep the site fast and reliable.</li>
        </ul>
      </Section>

      <Section title="Why we use it">
        <p>
          Your phone number verifies bookings (the demo OTP) and powers M-Pesa refunds. Your email receives booking confirmations
          and lets you look up bookings on the My Bookings page. Language and wishlist preferences live on your own device and are
          never transmitted.
        </p>
      </Section>

      <Section title="What we never do">
        <p>
          We never sell your data, never share it with advertisers, and never show your contact details to hosts — hosts see your
          booking, not your private information. This demo stores everything locally or in the demo database; no real payments or
          SMS are processed.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can view your bookings any time with your <span className="font-mono">SS</span> reference or email, cancel them within
          the 48-hour window, and clear your local preferences from your browser. To request deletion of demo data, contact us via
          the <a href="/report" className="font-semibold text-brand hover:underline">report a concern</a> page and we&apos;ll action
          it promptly.
        </p>
      </Section>

      <Section title="Third-party data">
        <p>
          Live weather comes from Open-Meteo, currency conversion from ExchangeRate-API, and map tiles from OpenStreetMap — each
          provider handles its own data per its own policies. Listing photography is licensed via Pexels.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/terms", label: "Terms of service", blurb: "The rules of the platform, in plain language." },
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/report", label: "Report a concern", blurb: "Ask us anything — we answer within 24 hours." },
        ]}
      />
    </InfoPage>
  );
}
