import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Host with SafariStay · Kenya",
  description:
    "List your guesthouse, camp or home on SafariStay — free to start, Kenyan-friendly pricing, and a platform built for local hosts.",
};

export default function HostingPage() {
  return (
    <InfoPage
      crumb="Hosting"
      title="Host with SafariStay"
      sub="From a town guesthouse to a safari camp — list your stay, set your own seasonal rates, and earn from travellers who want the real Kenya."
      photo={17831034}
      photoAlt="Tented camp under the African sky"
    >
      <PhotoStrip
        photos={[
          { id: 20693413, alt: "Coastal beach", caption: "List a beach banda, town room or lakeside cottage." },
          { id: 28157088, alt: "Camp at golden hour", caption: "Camps and bandas are travellers' favourites." },
          { id: 33473218, alt: "Nairobi at dusk", caption: "City stays fill fast with business and weekend travellers." },
        ]}
      />

      <Section title="List your home or camp" id="list">
        <p>
          Listing is <strong>free</strong> — you only pay a small platform fee when a booking happens. Create your listing with
          photos, amenities and honest details, set your <strong>green-season</strong> and <strong>peak-season</strong> rates in
          Kenyan shillings, and you&apos;re live. Most hosts get their first booking within a few weeks.
        </p>
        <p>
          We&apos;re built for Kenyan realities: your <strong>Stima &amp; Maji honesty card</strong> tells guests the truth about
          power, water and Wi-Fi — so a generator or borehole becomes a feature, not a complaint. Published{" "}
          <strong>monthly (28+ nights)</strong> and <strong>group (5+ guests)</strong> discounts reflect how Kenyans actually book.
        </p>
      </Section>

      <Section title="Host resources" id="resources">
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Your own availability calendar</strong> — booked dates block automatically, and cancelling guests free the dates back.</li>
          <li><strong>WhatsApp host line</strong> — guests message you directly; you keep the relationship.</li>
          <li><strong>Pay-at-property option</strong> — many hosts prefer cash or M-Pesa on arrival; it&apos;s built in.</li>
          <li><strong>Airport transfers</strong> — offer a pickup add-on and earn on the first and last mile.</li>
          <li><strong>Live weather &amp; FX on your page</strong> — guests see current conditions and USD estimates.</li>
        </ul>
        <p>
          Need help? Message us via <Link href="/report" className="font-semibold text-brand hover:underline">Report a concern</Link>{" "}
          (choose &quot;Something else&quot;) or reach out on WhatsApp — we answer every host enquiry within a day.
        </p>
      </Section>

      <Section title="Community tourism" id="community">
        <p>
          Every SafariStay booking puts money straight into Kenyan pockets — guesthouse owners in Kakamega, banda builders in Meru,
          camp teams in the Mara. We actively feature community-run stays like Thiiri Cultural Centre, where your night funds local
          crafts and education, and hosts who run conservation experiences like Ol Pejeta.
        </p>
        <p>
          Travellers come for the wildlife and stay for the welcome. When you host, you&apos;re not just renting a room — you&apos;re
          the reason a traveller tells their friends about Kenya.
        </p>
      </Section>

      <Section title="Responsible travel" id="responsible">
        <p>
          We ask every host to commit to the basics: <strong>safe water and power</strong> (or honest alternatives),{" "}
          <strong>waste and plastic discipline</strong>, fair treatment of staff, and <strong>wildlife-friendly</strong> practices —
          no feeding, no baiting, no closer-than-safe encounters.
        </p>
        <p>
          Guests see your commitments on your listing, and travellers who care choose hosts who care. It&apos;s good for Kenya, good
          for your reviews, and good for business.
        </p>
        <PhotoStrip
          photos={[
            { id: 5306140, alt: "Golden savannah", caption: "Responsible hosting keeps Kenya wild for the next generation." },
            { id: 18717287, alt: "Lodge tent", caption: "Solar power and boreholes are features guests love." },
            { id: 20653421, alt: "Lake at sunset", caption: "Clean water, honest power, zero surprises." },
          ]}
        />
      </Section>

      <Section title="Ready to list?">
        <p>
          This demo doesn&apos;t have a host sign-up flow yet — but the pieces are all here. If you&apos;d like to list a property,
          contact us and we&apos;ll add you to the seed data and point you at the tools.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/safety", label: "Safety information", blurb: "How we keep guests safe at every stay." },
          { href: "/report", label: "Report a concern", blurb: "Host or guest — tell us about a problem." },
        ]}
      />
    </InfoPage>
  );
}
