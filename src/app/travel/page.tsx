import Link from "next/link";
import InfoPage, { PhotoStrip, RelatedLinks, Section } from "@/components/InfoPage";
import StageMap from "@/components/StageMap";
import { MAJOR_STAGES, stageAnchor } from "@/lib/travel";
import { T } from "@/components/Localized";

export const metadata = {
  title: "Getting around Kenya — major stages & bus routes · SafariStay",
  description:
    "Every SafariStay town and its main stage: the bus and matatu terminals that connect Kenya — from Nairobi's CBD terminals to Mokowe jetty for Lamu.",
};

export default function TravelPage() {
  return (
    <InfoPage
      crumb="Getting around"
      title="Major stages & bus routes"
      sub="How every SafariStay town connects to the rest of Kenya — the stendi (stages) to alight at, the operators that run the routes, and rough fares. Fares move with fuel prices, so treat them as a guide."
      photo={33473218}
      photoAlt="Nairobi cityscape at dusk"
    >
      <Section title="How Kenyan public transport works">
        <p>
          Nearly every town in this catalogue is reachable by <strong>matatu or bus from Nairobi</strong> — and
          the coast towns from Mombasa. Long-distance buses (Easy Coach, Modern Coast, Mash Poa, Crown Bus,
          Tawakal Express and the rest) run from the main bus parks; matatus run the same corridors at similar
          or lower fares. Book long-distance buses a day ahead for weekend departures, and buy at the official
          booking office or app — never from roadside touts.
        </p>
        <PhotoStrip
          photos={[
            { id: 20653797, alt: "Western Kenya highlands", caption: "Western routes run from Nairobi through Nakuru and Kericho to Kisumu, Kakamega and Kitale." },
            { id: 31055413, alt: "Northern frontier", caption: "Northern routes leave from Nairobi's Eastleigh terminals for Garissa and the frontier." },
            { id: 27742235, alt: "Coast", caption: "Coast routes run the Mombasa–Malindi corridor — and buses to Lamu stop at Mokowe, where the boat takes over." },
          ]}
        />
        <p>
          <strong>Rail is a great shortcut:</strong> the SGR Madaraka Express links Nairobi and Mombasa from
          about KES 700 economy, and commuter services reach Nanyuki and Kisumu. For everything else, the
          stage is the answer — the table below lists the main terminal for every town we cover.
        </p>
      </Section>

      <Section title="Stages on the map">
        <p className="mb-4">
          <T k="travel.mapSub" />
        </p>
        <StageMap stages={MAJOR_STAGES} />
      </Section>

      <Section title="Stages by town">
        <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50 text-xs uppercase tracking-wide text-sand-600">
                <th className="px-4 py-3 font-bold">Town</th>
                <th className="px-4 py-3 font-bold">Stage / terminal</th>
                <th className="px-4 py-3 font-bold">Routes from here</th>
                <th className="px-4 py-3 font-bold">Operators</th>
                <th className="px-4 py-3 font-bold">Approx. fare</th>
              </tr>
            </thead>
            <tbody>
              {MAJOR_STAGES.map((s) => (
                <tr key={s.town} id={stageAnchor(s.town)} className="scroll-mt-24 border-b border-sand-100 align-top last:border-0 hover:bg-sand-50/60">
                  <td className="px-4 py-3">
                    <p className="font-bold text-ink">{s.town}</p>
                    <p className="text-xs text-sand-600">{s.county}</p>
                  </td>
                  <td className="px-4 py-3 text-sand-800">{s.stage}</td>
                  <td className="px-4 py-3 text-sand-800">{s.routes}</td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {s.operators.map((o) => (
                        <span key={o} className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-semibold text-ink">
                          {o}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sand-800">{s.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-sand-600">
          Fares are indicative 2025–26 public-transport figures in KES and change with fuel prices — confirm at
          the stage before you travel. Park entry fees (e.g. Masai Mara, Amboseli, Tsavo) are separate and paid
          at the gate.
        </p>
      </Section>

      <Section title="Every stay tells you its stage">
        <p>
          Each property page now shows a <strong>“Getting there”</strong> block with the exact stage to alight
          at, the route, the operators, an approximate fare and the last-mile transfer (boda, taxi, ferry or
          camp pickup). Browse the catalogue and pick the stay whose route suits your weekend or long haul.
        </p>
        <Link
          href="/listings"
          className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          Browse all stays →
        </Link>
      </Section>

      <RelatedLinks
        links={[
          { href: "/help", label: "Help Centre", blurb: "Booking, M-Pesa and travelling tips." },
          { href: "/safety", label: "Safety information", blurb: "Getting around safely, matatu to Mara." },
          { href: "/cancellations", label: "Cancellation options", blurb: "The 48-hour window and refunds." },
        ]}
      />
    </InfoPage>
  );
}
