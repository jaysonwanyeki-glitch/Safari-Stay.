// ---------------------------------------------------------------- Getting there
// Real stage & bus info for every listing: the stage/terminal to alight at, the
// main route, the operators that run it, an approximate fare, and the last-mile
// transfer to the property. Fares are rough 2025–26 public-transport figures in
// KES and move with fuel prices — treat as a guide, not a quote.
//
// "Stage" = the Kenyan bus/matatu terminal for that town (stendi kubwa).

export type TravelInfo = {
  /** The stage / terminal to alight at. */
  stage: string;
  /** Main route from Nairobi (or the coast gateway where noted). */
  route: string;
  /** Bus / matatu / flight operators that run the route. */
  operators: string[];
  /** Approximate fare from Nairobi (or the named gateway), KES. */
  fare: string;
  /** Last mile from the stage to the property. */
  transfer: string;
};

export const GETTING_THERE: Record<string, TravelInfo> = {
  // ---------------------------------------------------------------- Mara & south
  "angama-mara": {
    stage: "Oloololo Airstrip (Mara) — or road via Narok town",
    route: "Scheduled flight Nairobi (Wilson) → Oloololo, or 6h road via Narok–Sekenani",
    operators: ["Safarilink", "AirKenya Express", "private road transfer"],
    fare: "Flight from ≈ KES 41,000 one-way (often included in the rate)",
    transfer: "Airstrip transfers included — 20 min to the lodge on the escarpment rim.",
  },
  "governors-camp": {
    stage: "Musiara Airstrip (Mara) — or road via Narok town",
    route: "Scheduled flight Nairobi (Wilson) → Musiara, or 5–6h road via Narok",
    operators: ["Safarilink", "AirKenya Express", "Governors' road transfers"],
    fare: "Flight from ≈ KES 38,000 one-way (often included in the rate)",
    transfer: "Airstrip transfers included — 15 min on the reserve track to camp.",
  },
  "entim-camp": {
    stage: "Ol Kiombo Airstrip (Mara) — or road via Sekenani Gate",
    route: "Scheduled flight Nairobi (Wilson) → Ol Kiombo, or 5–6h road via Narok–Sekenani",
    operators: ["Safarilink", "AirKenya Express", "matatu + camp pickup"],
    fare: "Flight from ≈ KES 38,000 one-way; road from ≈ KES 1,500 matatu to Sekenani + park fees",
    transfer: "Camp pickup from Sekenani Gate or Ol Kiombo — about 30 min on the Talek River.",
  },
  "amboseli-serena-safari-lodge": {
    stage: "Amboseli Airstrip — or road via Emali town",
    route: "Scheduled flight Nairobi (Wilson) → Amboseli, or 4h road via Emali–Kimana gate",
    operators: ["Safarilink", "AirKenya Express", "matatu Nairobi–Emali + transfer"],
    fare: "Flight from ≈ KES 30,000 one-way; road from ≈ KES 1,000 to Emali + ≈ KES 3,000 taxi",
    transfer: "Airstrip transfers included; from Kimana Gate it's a 20 min game-drive-style transfer.",
  },
  "finch-hattons": {
    stage: "Finch Hattons Airstrip (Tsavo West) — or road via Mtito Andei",
    route: "Scheduled flight Nairobi (Wilson) → Finch Hattons, or 5h road via Mtito Andei gate",
    operators: ["Safarilink", "AirKenya Express", "private road transfer"],
    fare: "Flight from ≈ KES 33,000 one-way (often included in the rate)",
    transfer: "Airstrip transfers included; from Mtito Andei gate it's ~40 min to the spring.",
  },
  // ---------------------------------------------------------------- North & Rift
  "elephant-bedroom-camp": {
    stage: "Samburu Airstrip — or road via Isiolo town",
    route: "Scheduled flight Nairobi (Wilson) → Samburu, or 6h road via Thika–Nanyuki–Isiolo",
    operators: ["Safarilink", "AirKenya Express", "matatu to Isiolo + camp pickup"],
    fare: "Flight from ≈ KES 34,000 one-way; road from ≈ KES 1,500 to Isiolo + camp transfer",
    transfer: "Airstrip transfers included; from Isiolo the camp runs a 40 min pickup into the reserve.",
  },
  "ol-pejeta-bush-camp": {
    stage: "Nanyuki — road via Nanyuki town",
    route: "3.5–4h road from Nairobi via Thika–Nanyuki; or flight to Nanyuki airstrip",
    operators: ["Nanyuki Express", "Nairobi–Nanyuki matatus", "Safarilink (to Nanyuki)"],
    fare: "Road from ≈ KES 800–1,200; flight from ≈ KES 20,000 one-way",
    transfer: "Camp pickup from Nanyuki — 20 min to the Ol Pejeta gate.",
  },
  "serena-mountain-lodge": {
    stage: "Naro Moru town — 3 km from the park gate",
    route: "3.5h road from Nairobi via Nyeri–Naro Moru; or via Nanyuki",
    operators: ["Nairobi–Nyeri matatus", "Nairobi–Nanyuki matatus", "car hire"],
    fare: "From ≈ KES 800–1,200 matatu",
    transfer: "Park gate at Naro Moru is 3 km from the lodge — the lodge arranges pickup.",
  },
  "lake-naivasha-sopa-resort": {
    stage: "Naivasha town (Naivasha stage)",
    route: "2h road from Nairobi via Naivasha Rd; or SGR to Suswa + matatu",
    operators: ["Naivasha matatus", "Easy Coach (Nairobi–Naivasha)", "SGR + matatu"],
    fare: "Matatu ≈ KES 600–800; bus ≈ KES 800–1,000",
    transfer: "≈ 15 min boda/taxi from Naivasha town to Moi South Lake Rd.",
  },
  "giraffe-manor": {
    stage: "Nairobi CBD — Karen / Lang'ata",
    route: "25–30 min from the CBD via Ngong Rd; matatu to Karen or taxi/Uber",
    operators: ["CBD–Karen matatus", "taxi / Uber"],
    fare: "Matatu ≈ KES 100–150; taxi ≈ KES 800–1,500",
    transfer: "The manor sits inside the Giraffe Centre grounds in Karen — the taxi drops you at the gate.",
  },
  // ---------------------------------------------------------------- Coast resorts
  "kinondo-kwetu": {
    stage: "Ukunda (Diani) — via Mombasa or Ukunda Airstrip",
    route: "SGR/bus to Mombasa → Likoni ferry → Diani, or flight Nairobi → Ukunda",
    operators: ["Modern Coast", "Mash Poa", "SGR (Mombasa)", "Safarilink/AirKenya to Ukunda"],
    fare: "Bus from Nairobi ≈ KES 2,000–3,000; SGR from ≈ KES 700; flight from ≈ KES 18,000",
    transfer: "≈ 30 min from Ukunda town down to Galu Beach — the lodge arranges pickup.",
  },
  "diani-sea-lodge": {
    stage: "Ukunda (Diani) — via Mombasa or Ukunda Airstrip",
    route: "SGR/bus to Mombasa → Likoni ferry → Diani, or flight Nairobi → Ukunda",
    operators: ["Modern Coast", "Mash Poa", "SGR (Mombasa)", "Safarilink/AirKenya to Ukunda"],
    fare: "Bus from Nairobi ≈ KES 2,000–3,000; SGR from ≈ KES 700; flight from ≈ KES 18,000",
    transfer: "≈ 10 min from Ukunda town to the lodge on Diani Beach Rd.",
  },
  "the-sands-at-nomad": {
    stage: "Ukunda (Diani) — via Mombasa or Ukunda Airstrip",
    route: "SGR/bus to Mombasa → Likoni ferry → Diani, or flight Nairobi → Ukunda",
    operators: ["Modern Coast", "Mash Poa", "SGR (Mombasa)", "Safarilink/AirKenya to Ukunda"],
    fare: "Bus from Nairobi ≈ KES 2,000–3,000; SGR from ≈ KES 700; flight from ≈ KES 18,000",
    transfer: "≈ 15 min from Ukunda town to Nomad on the beach road.",
  },
  "medina-palms-watamu": {
    stage: "Watamu junction (Mombasa–Malindi Rd) — or Malindi Airstrip",
    route: "Bus/flight to Malindi then 20 min to Watamu, or matatu up the coast road from Mombasa",
    operators: ["Modern Coast", "Mash Poa", "Tahmeed", "Safarilink/AirKenya to Malindi"],
    fare: "Mombasa–Watamu matatu ≈ KES 400–600; Nairobi–Malindi bus ≈ KES 2,200–3,200; flight from ≈ KES 17,000",
    transfer: "≈ 10 min from the Watamu junction to the resort by the beach.",
  },
  "peponi-hotel-lamu": {
    stage: "Mokowe jetty — or Manda Airstrip",
    route: "Bus from Nairobi → Mokowe (buses stop at Mokowe, not Lamu town), then boat; or flight Nairobi → Manda",
    operators: ["Modern Coast", "Mash Poa", "Tahmeed", "Safarilink/AirKenya to Manda"],
    fare: "Bus ≈ KES 2,500–3,500 + boat ≈ KES 500–1,000; flight from ≈ KES 22,000 one-way",
    transfer: "Speedboat/ferry Mokowe → Lamu town (~40 min), then a 15 min dhow or walk to Shela.",
  },
  // ---------------------------------------------------------------- Nairobi & Eastern
  "milimani-backpackers-nairobi": {
    stage: "Nairobi CBD — Milimani is 10 min away",
    route: "Arrive at any Nairobi terminus (Railways, Accra Rd, MCS); matatu/boda to Milimani",
    operators: ["CBD–Milimani matatus", "boda boda"],
    fare: "Matatu ≈ KES 50–100 from town",
    transfer: "10 min matatu or walk from the CBD edge.",
  },
  "brooklyn-hotel-machakos": {
    stage: "Machakos Country Bus Station (MCS), Nairobi — then Machakos town",
    route: "Matatu from the new MCS on Mombasa Rd → Machakos town (MCS also serves the town)",
    operators: ["MCS–Machakos matatus"],
    fare: "≈ KES 300–400 one-way",
    transfer: "5 min walk or boda from the town stage to People's Park / the hotel.",
  },
  "blue-post-hotel-thika": {
    stage: "Thika Bus Terminal (CBD)",
    route: "Matatu from Nairobi CBD (Ruaraka/Thika Rd) → Thika, ~45 min",
    operators: ["Thika Rd matatus (Ruiru–Thika)"],
    fare: "≈ KES 150–250 one-way",
    transfer: "10 min walk or boda from the terminal to Chania Falls.",
  },
  "green-hills-hotel-nyeri": {
    stage: "Nyeri Bus Park (town centre)",
    route: "Matatu from Nairobi via Karatina → Nyeri, ~2.5h",
    operators: ["Nairobi–Nyeri matatus (via Karatina)"],
    fare: "≈ KES 700–1,000 one-way",
    transfer: "5 min walk or boda from the bus park.",
  },
  "thiiri-cultural-centre-meru": {
    stage: "Meru Bus Park (town)",
    route: "Matatu from Nairobi via Embu or via Nanyuki → Meru, ~3.5–4h",
    operators: ["Nairobi–Meru matatus", "Meru Express"],
    fare: "≈ KES 1,000–1,400 one-way",
    transfer: "10 min boda from the bus park to the cultural centre.",
  },
  "rafiki-house-nanyuki": {
    stage: "Nanyuki town stage",
    route: "Matatu from Nairobi via Thika–Nanyuki, ~3.5h; or SGR commuter to Nanyuki + matatu",
    operators: ["Nairobi–Nanyuki matatus", "Nanyuki Express", "SGR (Mt Kenya Safari Club stop)"],
    fare: "≈ KES 800–1,200 one-way",
    transfer: "5–10 min boda or walk from the town stage.",
  },
  "esstana-guest-house-embu": {
    stage: "Embu Bus Park (town centre)",
    route: "Matatu/bus from Nairobi via Thika–Embu, ~2.5–3h",
    operators: ["Nairobi–Embu matatus", "Embu shuttle"],
    fare: "≈ KES 800–1,200 one-way",
    transfer: "5 min walk or boda from the bus park.",
  },
  "gerish-hotel-embu": {
    stage: "Embu Bus Park (near the market)",
    route: "Matatu/bus from Nairobi via Thika–Embu, ~2.5–3h",
    operators: ["Nairobi–Embu matatus", "Embu shuttle"],
    fare: "≈ KES 800–1,200 one-way",
    transfer: "5 min walk from the bus park to the market-side hotel.",
  },
  "panesic-hotel-embu": {
    stage: "Embu Bus Park (town centre)",
    route: "Matatu/bus from Nairobi via Thika–Embu, ~2.5–3h",
    operators: ["Nairobi–Embu matatus", "Embu shuttle"],
    fare: "≈ KES 800–1,200 one-way",
    transfer: "10 min walk or boda from the bus park.",
  },
  "thomsons-falls-lodge": {
    stage: "Nyahururu town stage",
    route: "Matatu from Nairobi via Naivasha–Gilgil–Nyahururu, ~3h; or via Nyeri–Kieni",
    operators: ["Nairobi–Nyahururu matatus", "Nyandarua shuttles"],
    fare: "≈ KES 700–1,000 one-way",
    transfer: "5 min boda from the stage to the lodge at the falls.",
  },
  "rangeland-hotel-isiolo": {
    stage: "Isiolo town stage",
    route: "Matatu/bus from Nairobi via Thika–Nanyuki–Isiolo, ~4h; gateway north to Marsabit & Moyale",
    operators: ["Nairobi–Isiolo matatus", "Isiolo north-bound shuttles"],
    fare: "≈ KES 1,000–1,500 one-way",
    transfer: "5 min walk or boda from the stage to the hotel.",
  },
  // ---------------------------------------------------------------- Rift Valley Lakes
  "fishermans-camp-naivasha": {
    stage: "Naivasha town stage",
    route: "2h road from Nairobi via Naivasha Rd",
    operators: ["Naivasha matatus", "Easy Coach (Nairobi–Naivasha)"],
    fare: "≈ KES 600–800 one-way",
    transfer: "≈ 15 min boda from Naivasha town down Moi South Lake Rd.",
  },
  "crayfish-camp-naivasha": {
    stage: "Naivasha town stage",
    route: "2h road from Nairobi via Naivasha Rd",
    operators: ["Naivasha matatus", "Easy Coach (Nairobi–Naivasha)"],
    fare: "≈ KES 600–800 one-way",
    transfer: "≈ 15 min boda from Naivasha town down Moi South Lake Rd.",
  },
  "lanet-matfam-nakuru": {
    stage: "Nakuru Bus Park",
    route: "Matatu/bus from Nairobi via the Nakuru–Nairobi Hwy, ~2.5–3h",
    operators: ["Nairobi–Nakuru matatus", "Easy Coach", "KAVS"],
    fare: "≈ KES 800–1,200 one-way",
    transfer: "≈ 10 min boda from Nakuru town to Lanet, off the highway.",
  },
  // ---------------------------------------------------------------- Western
  "mountainview-backpackers-kisumu": {
    stage: "Kisumu Bus Park",
    route: "Bus from Nairobi via Naivasha–Kericho–Kisumu, ~6–7h; or SGR to Kisumu",
    operators: ["Easy Coach", "Modern Coast", "Trinity Express", "SGR (Nairobi–Kisumu)"],
    fare: "Bus ≈ KES 1,500–2,500; SGR from ≈ KES 1,200",
    transfer: "≈ 15 min boda from the bus park to Mamboleo.",
  },
  "mahindi-comfy-eldoret": {
    stage: "Eldoret Bus Park (Uganda Rd)",
    route: "Bus from Nairobi via Nakuru–Eldoret, ~5–6h",
    operators: ["Easy Coach", "Crown Bus", "North Rift Shuttle"],
    fare: "≈ KES 1,500–2,500 one-way",
    transfer: "10 min walk or boda from the bus park, just off Uganda Rd.",
  },
  "golf-hotel-kakamega": {
    stage: "Kakamega Bus Park (town)",
    route: "Bus from Nairobi via Kisumu–Kakamega, ~7h; or matatu from Kisumu, ~1h",
    operators: ["Easy Coach", "Modern Coast", "Kisumu–Kakamega matatus"],
    fare: "Nairobi bus ≈ KES 1,500–2,500; Kisumu matatu ≈ KES 300–400",
    transfer: "10 min boda from town to the forest entrance gate.",
  },
  "pazuri-hotel-kitale": {
    stage: "Kitale Bus Park (town centre)",
    route: "Bus from Nairobi via Eldoret–Kitale, ~6–7h; or matatu from Eldoret, ~1.5h",
    operators: ["Easy Coach", "Crown Bus", "North Rift Shuttle", "Eldoret–Kitale matatus"],
    fare: "Nairobi bus ≈ KES 1,800–2,800; Eldoret matatu ≈ KES 400–600",
    transfer: "5 min walk or boda from the bus park to the hotel.",
  },
  "tea-hotel-kericho": {
    stage: "Kericho Bus Park (town)",
    route: "Bus from Nairobi via Nakuru–Kericho, ~4.5–5h; or via Kisumu road",
    operators: ["Easy Coach", "Kericho Line", "Nairobi–Kericho shuttles"],
    fare: "≈ KES 1,200–1,800 one-way",
    transfer: "10 min boda from the bus park to the hotel gardens.",
  },
  "knight-motel-kisii": {
    stage: "Kisii Bus Park (town centre)",
    route: "Bus from Nairobi via Narok–Bomet or via Kericho–Sotik, ~5–6h",
    operators: ["Easy Coach", "Kisii Express", "Nairobi–Kisii matatus"],
    fare: "≈ KES 1,500–2,500 one-way",
    transfer: "5 min walk or boda from the bus park to the motel.",
  },
  "kapsabet-comfy-hotel": {
    stage: "Kapsabet town stage",
    route: "Matatu/bus from Nairobi via Nakuru–Eldoret–Kapsabet, ~6h; or matatu from Eldoret, ~1h",
    operators: ["Easy Coach", "North Rift Shuttle", "Eldoret–Kapsabet matatus"],
    fare: "Nairobi ≈ KES 1,500–2,500; Eldoret matatu ≈ KES 200–300",
    transfer: "5 min walk or boda from the stage to the hotel.",
  },
  "lolac-hotel-lodwar": {
    stage: "Lodwar town stage",
    route: "Bus from Nairobi via Nakuru–Eldoret–Kitale–Lodwar, ~12–14h; or via the Kitale–Lodwar road",
    operators: ["North Rift Shuttle", "Eldoret–Kitale–Lodwar buses"],
    fare: "≈ KES 2,500–3,500 one-way",
    transfer: "5 min walk or boda from the stage to the hotel on the Kitale road.",
  },
  "wajir-county-guest-house": {
    stage: "Wajir town stage",
    route: "Bus from Nairobi (Eastleigh) via the Thika–Garissa–Wajir road, ~10–12h",
    operators: ["Tawakal Express", "Rhamu Express", "Garissa–Wajir shuttles"],
    fare: "≈ KES 3,000–4,000 one-way",
    transfer: "5 min walk or boda from the stage to the guesthouse.",
  },
  // ---------------------------------------------------------------- Coast towns
  "new-palm-tree-hotel-mombasa": {
    stage: "Mombasa CBD (Kwa Shibu / station area)",
    route: "Bus from Nairobi via Mombasa Rd ~8h, or SGR ~5h; matatus from the CBD",
    operators: ["Modern Coast", "Mash Poa", "Tahmeed", "SGR (Mombasa)"],
    fare: "Bus ≈ KES 2,000–3,000; SGR from ≈ KES 700",
    transfer: "5 min walk from the CBD stage to the hotel.",
  },
  "backpackers-club-malindi": {
    stage: "Malindi town bus stop",
    route: "Matatu from Mombasa via the Mombasa–Malindi Rd, ~2.5h; or bus from Nairobi via Mombasa",
    operators: ["Mombasa–Malindi matatus", "Modern Coast", "Mash Poa"],
    fare: "Mombasa matatu ≈ KES 400–600; Nairobi bus ≈ KES 2,200–3,200",
    transfer: "10 min walk or boda from the town stop to the beach-side hostel.",
  },
  "distant-relatives-kilifi": {
    stage: "Kilifi town (Mombasa–Malindi Rd)",
    route: "Matatu from Mombasa up the coast road, ~1h; buses pass Kilifi on the Malindi route",
    operators: ["Mombasa–Kilifi matatus", "Mombasa–Malindi matatus (alight at Kilifi)"],
    fare: "≈ KES 150–250 from Mombasa",
    transfer: "5 min boda/tuk-tuk from Kilifi town across the bridge to Bofa.",
  },
  "watamu-backpackers": {
    stage: "Watamu junction (Mombasa–Malindi Rd)",
    route: "Matatu from Mombasa via the coast road, ~2h; or bus to Malindi then matatu back to Watamu",
    operators: ["Mombasa–Watamu matatus", "Mombasa–Malindi matatus (alight at Watamu)"],
    fare: "≈ KES 400–600 from Mombasa",
    transfer: "10 min boda from the junction to the hostel by the lagoon.",
  },
  "jambohouse-lamu": {
    stage: "Mokowe jetty — then Lamu town jetty",
    route: "Bus from Nairobi → Mokowe (buses don't cross to Lamu town), then boat to Lamu; or flight to Manda",
    operators: ["Modern Coast", "Mash Poa", "Tahmeed", "Safarilink/AirKenya to Manda"],
    fare: "Bus ≈ KES 2,500–3,500 + boat ≈ KES 500–1,000; flight from ≈ KES 22,000 one-way",
    transfer: "Speedboat Mokowe → Lamu town (~40 min), then 10 min walk into the Old Town.",
  },
  "palm-oasis-resort-garissa": {
    stage: "Garissa town stage",
    route: "Bus from Nairobi (Eastleigh) via the Thika–Garissa Hwy, ~5–6h",
    operators: ["Tawakal Express", "Rhamu Express", "Garissa shuttles"],
    fare: "≈ KES 2,000–3,000 one-way",
    transfer: "10 min boda from the stage to the riverfront compound.",
  },
};

// ---------------------------------------------------------------- Major stages
// Town-level reference: the main stage/terminal and the routes that leave from
// it — the "buses to different parts of the country" map.

export type MajorStage = {
  town: string;
  county: string;
  stage: string;
  /** Where the routes from this stage can take you. */
  routes: string;
  operators: string[];
  /** Approximate fare from Nairobi (or the named gateway). */
  fare: string;
};

export const MAJOR_STAGES: MajorStage[] = [
  { town: "Nairobi", county: "Nairobi", stage: "Accra Rd / Railways Bus Station / Machakos Country Bus (MCS)", routes: "Every county: Western, Rift, Eastern, Coast and Northern routes all leave from the CBD terminals", operators: ["Easy Coach", "Modern Coast", "Mash Poa", "Crown Bus", "Tawakal", "all SACCO matatus"], fare: "—" },
  { town: "Mombasa", county: "Mombasa", stage: "Mombasa CBD (Kwa Shibu / station area)", routes: "Malindi & the north coast, Nairobi, Diani (via Likoni ferry), Ukunda", operators: ["Modern Coast", "Mash Poa", "Tahmeed", "SGR"], fare: "Bus from Nairobi ≈ KES 2,000–3,000 · SGR from ≈ KES 700" },
  { town: "Kisumu", county: "Kisumu", stage: "Kisumu Bus Park", routes: "Kakamega, Kericho, Eldoret, Nairobi, Busia & the Uganda border, Lake Victoria towns", operators: ["Easy Coach", "Modern Coast", "Trinity Express", "SGR"], fare: "Bus from Nairobi ≈ KES 1,500–2,500" },
  { town: "Eldoret", county: "Uasin Gishu", stage: "Eldoret Bus Park (Uganda Rd)", routes: "Kitale, Kisumu, Nairobi, Bungoma, Busia, Uganda", operators: ["Easy Coach", "Crown Bus", "North Rift Shuttle"], fare: "Bus from Nairobi ≈ KES 1,500–2,500" },
  { town: "Kitale", county: "Trans Nzoia", stage: "Kitale Bus Park", routes: "Eldoret, Nairobi, Mt Elgon & Saiwa Swamp (matatus to the parks), Uganda border", operators: ["Easy Coach", "Crown Bus", "North Rift Shuttle", "Eldoret–Kitale matatus"], fare: "Bus from Nairobi ≈ KES 1,800–2,800" },
  { town: "Kakamega", county: "Kakamega", stage: "Kakamega Bus Park", routes: "Kisumu, Nairobi, Mumias, the forest gate (boda)", operators: ["Easy Coach", "Modern Coast", "Kisumu–Kakamega matatus"], fare: "Bus from Nairobi ≈ KES 1,500–2,500" },
  { town: "Kericho", county: "Kericho", stage: "Kericho Bus Park", routes: "Nairobi, Kisumu, Nakuru, the tea estates, Mau Forest & Lake Victoria", operators: ["Easy Coach", "Kericho Line"], fare: "Bus from Nairobi ≈ KES 1,200–1,800" },
  { town: "Nakuru", county: "Nakuru", stage: "Nakuru Bus Park", routes: "Nairobi, Naivasha, Kericho, Kisumu, Eldoret, Nyahururu, Baringo & the north", operators: ["Easy Coach", "KAVS", "Nairobi–Nakuru matatus"], fare: "≈ KES 800–1,200 from Nairobi" },
  { town: "Naivasha", county: "Nakuru", stage: "Naivasha town stage", routes: "Nairobi, Nakuru, Hells Gate & Crescent Island (boda), Mai Mahiu", operators: ["Naivasha matatus", "Easy Coach"], fare: "≈ KES 600–800 from Nairobi" },
  { town: "Nyahururu", county: "Nyandarua", stage: "Nyahururu town stage", routes: "Nairobi (via Naivasha–Gilgil or Nyeri), Nyeri, Nakuru, Thomson's Falls (walk/boda)", operators: ["Nairobi–Nyahururu matatus", "Nyandarua shuttles"], fare: "≈ KES 700–1,000 from Nairobi" },
  { town: "Nyeri", county: "Nyeri", stage: "Nyeri Bus Park", routes: "Nairobi, Nanyuki, Karatina, Embu, Naro Moru & Mt Kenya gates", operators: ["Nairobi–Nyeri matatus"], fare: "≈ KES 700–1,000 from Nairobi" },
  { town: "Nanyuki", county: "Laikipia", stage: "Nanyuki town stage", routes: "Nairobi, Isiolo, Meru, Naro Moru & Mt Kenya gates, Samburu", operators: ["Nairobi–Nanyuki matatus", "Nanyuki Express", "SGR commuter"], fare: "≈ KES 800–1,200 from Nairobi" },
  { town: "Isiolo", county: "Isiolo", stage: "Isiolo town stage", routes: "THE northern gateway: Nanyuki, Meru, Samburu, Marsabit, Moyale & the Ethiopia border", operators: ["Nairobi–Isiolo matatus", "north-bound shuttles"], fare: "≈ KES 1,000–1,500 from Nairobi" },
  { town: "Meru", county: "Meru", stage: "Meru Bus Park", routes: "Nairobi, Embu, Nanyuki, Isiolo, Mt Kenya eastern gates", operators: ["Nairobi–Meru matatus", "Meru Express"], fare: "≈ KES 1,000–1,400 from Nairobi" },
  { town: "Embu", county: "Embu", stage: "Embu Bus Park", routes: "Nairobi, Meru, Nyeri, Seven Forks dams (boda), Mt Kenya eastern routes", operators: ["Nairobi–Embu matatus", "Embu shuttle"], fare: "≈ KES 800–1,200 from Nairobi" },
  { town: "Machakos", county: "Machakos", stage: "Machakos Country Bus Station (MCS), Nairobi + Machakos town stage", routes: "Nairobi (MCS is the main terminal), Kangundo, Kitui, Wote, Kajiado", operators: ["MCS–Machakos matatus"], fare: "≈ KES 300–400 from Nairobi" },
  { town: "Thika", county: "Kiambu", stage: "Thika Bus Terminal", routes: "Nairobi (45 min), Garissa & the eastern highway, Nyeri, Embu, Meru", operators: ["Thika Rd matatus"], fare: "≈ KES 150–250 from Nairobi" },
  { town: "Garissa", county: "Garissa", stage: "Garissa town stage", routes: "Nairobi (via Thika–Garissa Hwy), Dadaab, Wajir, the north-eastern frontier", operators: ["Tawakal Express", "Rhamu Express", "Garissa shuttles"], fare: "≈ KES 2,000–3,000 from Nairobi" },
  { town: "Wajir", county: "Wajir", stage: "Wajir town stage", routes: "Nairobi (via Garissa), Mandera, the Kenya–Somalia frontier", operators: ["Tawakal Express", "Rhamu Express", "Garissa–Wajir shuttles"], fare: "≈ KES 3,000–4,000 from Nairobi" },
  { town: "Kisii", county: "Kisii", stage: "Kisii Bus Park", routes: "Nairobi, Kericho, Kisumu, Migori, the Lake Victoria towns, Tabaka soapstone country", operators: ["Easy Coach", "Kisii Express", "Nairobi–Kisii matatus"], fare: "≈ KES 1,500–2,500 from Nairobi" },
  { town: "Kapsabet", county: "Nandi", stage: "Kapsabet town stage", routes: "Eldoret, Nairobi, Kisumu, Kabartonjo, the Nandi Hills forest", operators: ["North Rift Shuttle", "Eldoret–Kapsabet matatus"], fare: "≈ KES 1,500–2,500 from Nairobi" },
  { town: "Lodwar", county: "Turkana", stage: "Lodwar town stage", routes: "THE north-western gateway: Kitale, Eldoret, Nairobi, Kalokol, Eliye Springs, Kakuma & the South Sudan border", operators: ["North Rift Shuttle", "Eldoret–Kitale–Lodwar buses"], fare: "≈ KES 2,500–3,500 from Nairobi" },
  { town: "Kilifi", county: "Kilifi", stage: "Kilifi town (Mombasa–Malindi Rd)", routes: "Mombasa, Malindi, Watamu, Kilifi creek & Mnarani ruins (boda)", operators: ["Mombasa–Kilifi matatus", "coast buses alight at Kilifi"], fare: "≈ KES 150–250 from Mombasa" },
  { town: "Watamu", county: "Kilifi", stage: "Watamu junction (Mombasa–Malindi Rd)", routes: "Mombasa, Malindi, the marine park & turtle beaches (boda)", operators: ["Mombasa–Watamu matatus"], fare: "≈ KES 400–600 from Mombasa" },
  { town: "Malindi", county: "Kilifi", stage: "Malindi town bus stop", routes: "Mombasa, Nairobi, Watamu, Gede ruins, Lamu (via Mokowe)", operators: ["Modern Coast", "Mash Poa", "Mombasa–Malindi matatus"], fare: "≈ KES 400–600 from Mombasa · ≈ KES 2,200–3,200 from Nairobi" },
  { town: "Lamu", county: "Lamu", stage: "Mokowe jetty → Lamu town jetty", routes: "Buses run to Mokowe only — the speedboat/ferry crosses to Lamu town; flights land at Manda", operators: ["Modern Coast", "Mash Poa", "Tahmeed", "Safarilink/AirKenya"], fare: "Bus ≈ KES 2,500–3,500 + boat ≈ KES 500–1,000 · flight from ≈ KES 22,000" },
  { town: "Diani / Ukunda", county: "Kwale", stage: "Ukunda (Diani) — via Likoni ferry or Ukunda Airstrip", routes: "Mombasa (ferry + matatu), Nairobi (bus/SGR), the south coast beaches", operators: ["Modern Coast", "Mash Poa", "SGR", "Safarilink/AirKenya"], fare: "Bus from Nairobi ≈ KES 2,000–3,000 · SGR from ≈ KES 700 · flight from ≈ KES 18,000" },
];

/** Look up a listing's travel info by slug. */
export function travelFor(slug: string): TravelInfo | undefined {
  return GETTING_THERE[slug];
}
