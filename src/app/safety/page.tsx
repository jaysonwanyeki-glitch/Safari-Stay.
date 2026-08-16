import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Safety information · SafariStay",
  description:
    "Practical safety guidance for travelling in Kenya — getting around, staying healthy, wildlife etiquette and emergency contacts.",
};

const EMERGENCY = [
  { label: "Police / ambulance / fire", value: "999 or 112 (toll-free)" },
  { label: "Tourist police (Nairobi)", value: "+254 20 272 4000" },
  { label: "Kenya Tourism Board", value: "+254 20 271 1262" },
  { label: "Kenyatta National Hospital", value: "+254 20 272 6300" },
];

export default function SafetyPage() {
  return (
    <InfoPage
      crumb="Safety information"
      title="Travel safe in Kenya"
      sub="Honest, practical guidance from hosts and travellers — from booking with confidence to staying safe at your stay and in the wild."
      photo={31055413}
      photoAlt="Wildlife on the Kenyan savannah"
    >
      <PhotoStrip
        photos={[
          { id: 35717988, alt: "Lions on the savannah", caption: "Wildlife viewing is incredible — but always from a safe distance." },
          { id: 20335122, alt: "Elephants in Samburu", caption: "Never feed, chase or approach wild animals, even at camp." },
          { id: 33473218, alt: "Nairobi cityscape", caption: "City or bush, a little planning goes a long way." },
        ]}
      />

      <Section title="Before you go">
        <p>
          Check the latest Kenya travel advice from your own government, and make sure your passport is valid for at least six
          months with space for the visa-on-arrival or eTA stamp. Carry a printed copy of your booking confirmation and the{" "}
          <span className="font-mono">SS</span> reference — most guesthouses will ask for it at check-in.
        </p>
        <p>
          Travel insurance covering medical evacuation is strongly recommended for safari regions. If you&apos;re climbing or
          trekking (Mount Kenya, the Aberdares), acclimatise properly and always use a licensed guide.
        </p>
      </Section>

      <Section title="Getting around safely">
        <p>
          <strong>Matatus and buses:</strong> use registered SACCO routes (Easy Coach, Modern Coast, Mash Poa for long distance) and
          avoid travelling after dark on rural roads. Your host can usually recommend the safest departure.
        </p>
        <p>
          <strong>Madaraka Express (SGR):</strong> the Nairobi–Mombasa train is reliable, safe and a highlight in itself — book early
          in peak season. <strong>Boda bodas:</strong> only with a helmet and a sober rider; agree the fare before you go.
        </p>
        <p>
          <strong>Airport transfers:</strong> several listings offer a host-arranged pickup — the safest way to arrive after a long
          flight, and it&apos;s priced transparently at checkout.
        </p>
      </Section>

      <Section title="At your stay">
        <p>
          Look at the <strong>Stima &amp; Maji honesty card</strong> on every listing — it tells you the real power backup, water
          source and Wi-Fi situation, so a blackout or dry tap never comes as a surprise. Most town stays have{" "}
          <strong>24/7 security</strong>; lock your room door and keep valuables in the room safe when available.
        </p>
        <p>
          Trust your instincts. If a listing, host or situation feels wrong, contact the host on WhatsApp first, then{" "}
          <Link href="/report" className="font-semibold text-brand hover:underline">report a concern</Link> — we act on reports
          within 24 hours.
        </p>
      </Section>

      <Section title="Wildlife & nature">
        <p>
          Kenya&apos;s wildlife is the reason most of us come, and it deserves respect: stay inside vehicles during game drives, keep
          a safe distance at all times, and never feed animals — even monkeys at your banda are wild. At lakeside camps, hippos graze
          the shoreline after dark; keep to lit paths and never walk between camp and the water at night.
        </p>
        <p>
          In forests like Kakamega, walk with a guide or in a group, and carry water and a phone. Sun protection, insect repellent
          and a headlamp belong in every safari bag.
        </p>
      </Section>

      <Section title="Staying healthy">
        <p>
          Consult a travel clinic about <strong>malaria prophylaxis</strong> before you go — it&apos;s recommended for most of the
          country outside central Nairobi. Drink bottled or treated water (borehole and treated sources are noted on listings), and
          eat well-cooked food from busy kitchens — the best local restaurants are always the busiest.
        </p>
        <p>
          Altitude affects some travellers above 2,000&nbsp;m (Nanyuki, Nyeri, the Rift escarpment) — take it easy on day one. For
          emergencies, the numbers below work from any phone.
        </p>
      </Section>

      <Section title="Emergency contacts">
        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          {EMERGENCY.map((e, i) => (
            <div
              key={e.label}
              className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between ${
                i > 0 ? "border-t border-sand-100" : ""
              }`}
            >
              <span className="text-sm font-semibold text-ink">{e.label}</span>
              <span className="font-mono text-sm text-sand-700">{e.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-sand-600">
          Numbers are standard public Kenyan contacts for reference; always confirm locally and with your embassy.
        </p>
      </Section>

      <Section title="Respecting communities">
        <p>
          Kenya&apos;s warmth is legendary — a greeting goes a long way. Ask before photographing people, dress modestly in towns and
          on the coast, and buy from local vendors and community projects like the ones listed on our{" "}
          <Link href="/hosting" className="font-semibold text-brand hover:underline">hosting page</Link>. Travel money stays in the
          community when you stay with local hosts.
        </p>
      </Section>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Answers for booking, paying and travelling." },
          { href: "/report", label: "Report a concern", blurb: "Tell us about a safety issue or problem stay." },
          { href: "/cancellations", label: "Cancellation options", blurb: "Free cancellation up to 48 hours before check-in." },
        ]}
      />
    </InfoPage>
  );
}
