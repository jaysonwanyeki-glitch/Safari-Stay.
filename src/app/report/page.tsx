import type { Metadata } from "next";
import InfoPage, { PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";
import ReportForm from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Report a concern · SafariStay",
  description:
    "Tell us about a problem with a stay, host or payment — what you can report, how the process works, and the demo report form.",
};

export default function ReportPage() {
  return (
    <InfoPage
      crumb="Report a concern"
      title="We take every concern seriously"
      sub="A problem with a stay, host or payment? Tell us what happened — our team reviews every report within 24 hours, confidentially."
      photo={2736384}
      photoAlt="A quiet guesthouse room in Kenya"
    >
      <PhotoStrip
        photos={[
          { id: 30125343, alt: "Savannah landscape", caption: "From safety issues to quiet nights — everything gets reviewed." },
          { id: 28148280, alt: "Hotel bedroom", caption: "Property not as described is the most common report we see." },
          { id: 6394651, alt: "Tidy room interior", caption: "You'll always get a follow-up and a clear outcome." },
        ]}
      />

      <Section title="What you can report">
        <ul className="ml-5 list-disc space-y-2">
          <li><strong>Safety or security concerns</strong> — anything that made you or others feel unsafe at a stay.</li>
          <li><strong>Property not as described</strong> — different room, missing amenities, misleading photos or rates.</li>
          <li><strong>Cleanliness or maintenance</strong> — hygiene issues, broken essentials, pests.</li>
          <li><strong>Payment or refund issues</strong> — overcharging, double payments, missing refunds.</li>
          <li><strong>Harassment or discrimination</strong> — by a host, staff or another guest.</li>
          <li><strong>Anything else</strong> — if it matters to you, it matters to us.</li>
        </ul>
      </Section>

      <Section title="How the process works">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "You report", body: "Fill in the form below with what happened and how to reach you." },
            { step: "2", title: "We review", body: "Our team investigates within 24 hours — host, booking and messages." },
            { step: "3", title: "You get answers", body: "We follow up with the outcome and any refund or action taken." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
              <span className="brand-bg grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white">
                {s.step}
              </span>
              <p className="mt-3 font-bold text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-sand-700">{s.body}</p>
            </div>
          ))}
        </div>
        <p>
          Reports are treated <strong>confidentially</strong> — hosts never see your contact details. If you&apos;re reporting an
          emergency or a crime, contact the police first on <span className="font-mono">999</span> or{" "}
          <span className="font-mono">112</span>, then report to us once you&apos;re safe.
        </p>
      </Section>

      <Section title="Report now">
        <ReportForm />
      </Section>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Guides for booking, paying and travelling." },
          { href: "/safety", label: "Safety information", blurb: "Emergency contacts and safe-travel guidance." },
          { href: "/cancellations", label: "Cancellation options", blurb: "Free cancellation up to 48 hours before check-in." },
        ]}
      />
    </InfoPage>
  );
}
