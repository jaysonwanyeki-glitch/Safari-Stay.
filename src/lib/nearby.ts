// ---------------------------------------------------------------- What's nearby
// Conservancies, parks, beaches and local sites each stay can reach — the places
// guests actually visit while they're there. Distances are honest 2025–26 figures
// (drive times from the property); entry fees are paid at the gate, not included
// in the stay. Grouped by destination so nearby listings share the same facts.

export type SiteType =
  | "conservancy"
  | "national_park"
  | "forest"
  | "beach"
  | "lake"
  | "waterfall"
  | "cultural"
  | "historical"
  | "viewpoint"
  | "marine"
  | "town";

export type NearbySite = {
  name: string;
  type: SiteType;
  /** Honest distance/drive time from the property. */
  distance: string;
  /** One line on what to do there / what it's known for. */
  blurb: string;
  emoji: string;
};

const site = (s: NearbySite) => s;

// ---------------------------------------------------------------- Mara & south
const MARA = [
  site({ name: "Mara River & migration crossings", type: "conservancy", distance: "in the reserve", blurb: "Where the Great Migration wildebeest cross — the Mara's defining sight from July to October.", emoji: "🦁" }),
  site({ name: "Mara Triangle", type: "conservancy", distance: "10–20 min game drive", blurb: "The wild western wedge of the reserve — big cats and fewer vehicles.", emoji: "🐆" }),
  site({ name: "Naboisho Conservancy", type: "conservancy", distance: "~40 min from the reserve", blurb: "Community conservancy with walking safaris and night drives — book via your camp.", emoji: "🦒" }),
  site({ name: "Sekenani Gate & Maasai villages", type: "cultural", distance: "main gate, ~30 min", blurb: "The reserve's busiest gate; nearby Maasai villages welcome visitors for a cultural visit.", emoji: "🛕" }),
];

const AMBOSELI = [
  site({ name: "Amboseli National Park", type: "national_park", distance: "inside the park", blurb: "Elephant herds and Kilimanjaro views — Amboseli's swamps draw wildlife year-round.", emoji: "🐘" }),
  site({ name: "Observation Hill", type: "viewpoint", distance: "~15 min game drive", blurb: "The park's classic lookout over the elephant-filled swamps with Kili behind.", emoji: "⛰️" }),
  site({ name: "Enkongo Narok Swamp", type: "lake", distance: "~20 min game drive", blurb: "Permanent swamp where elephants, buffalo and birds concentrate in the dry season.", emoji: "🦩" }),
  site({ name: "Kimana Gate & Maasai community lands", type: "cultural", distance: "park gate, ~25 min", blurb: "Entry gate on the south side; guided village visits and community projects nearby.", emoji: "🛕" }),
];

const TSAVO = [
  site({ name: "Mzima Springs", type: "national_park", distance: "~25 min game drive", blurb: "Clear spring pools with an underwater hippo viewing hide — Tsavo West's must-see.", emoji: "🦛" }),
  site({ name: "Chaimu Crater & Shetani Lava Flow", type: "viewpoint", distance: "~20 min game drive", blurb: "Climb the black volcanic cone for views over the lava fields below.", emoji: "🌋" }),
  site({ name: "Ngulia Rhino Sanctuary", type: "conservancy", distance: "~40 min game drive", blurb: "Fenced sanctuary protecting black rhino — guided tracking with park rangers.", emoji: "🦏" }),
  site({ name: "Tsavo East — Galana River", type: "national_park", distance: "~1.5h via the Voi road", blurb: "The red-dust sister park across the way, known for the Galana River herds.", emoji: "🦁" }),
];

// ---------------------------------------------------------------- North & Rift
const SAMBURU = [
  site({ name: "Samburu National Reserve", type: "conservancy", distance: "the camp sits inside it", blurb: "Elephant, lion and the rare Grevy's zebra on the Ewaso Ng'iro — the reserve itself.", emoji: "🦁" }),
  site({ name: "Ewaso Ng'iro River", type: "lake", distance: "alongside the camp", blurb: "The permanent river that anchors Samburu's wildlife — elephant and crocodile daily.", emoji: "🐊" }),
  site({ name: "Buffalo Springs National Reserve", type: "conservancy", distance: "adjoining, ~15 min", blurb: "Samburu's twin reserve across the river — Grevy's zebra and reticulated giraffe.", emoji: "🦓" }),
  site({ name: "Shaba National Reserve", type: "conservancy", distance: "~40 min", blurb: "Joy Adamson's 'Born Free' country — scenic hills and the rare Beisa oryx.", emoji: "🦌" }),
  site({ name: "Kalama Conservancy", type: "conservancy", distance: "~50 min", blurb: "Community conservancy on the reserve's flank with its own lion prides.", emoji: "🦁" }),
];

const LAIKIPIA = [
  site({ name: "Ol Pejeta Conservancy", type: "conservancy", distance: "you're staying on it", blurb: "Black rhino, chimps at Sweetwaters Sanctuary and the last two northern white rhinos.", emoji: "🦏" }),
  site({ name: "Sweetwaters Chimpanzee Sanctuary", type: "conservancy", distance: "on the conservancy", blurb: "Rescued chimps in a riverside enclosure — a 1-hour guided visit from camp.", emoji: "🐒" }),
  site({ name: "Ngare Ndare Forest", type: "forest", distance: "~30 min", blurb: "Ancient cedar forest with canopy walkway, waterfalls and swimming pools.", emoji: "🌳" }),
  site({ name: "Lewa Wildlife Conservancy", type: "conservancy", distance: "~1h", blurb: "UNESCO-listed rhino & elephant conservancy, home of the Lewa Marathon.", emoji: "🦒" }),
];

const MT_KENYA = [
  site({ name: "Mount Kenya National Park", type: "national_park", distance: "at the gate (Naro Moru)", blurb: "The park gate is 3 km away — hikes from half-day forest walks to summit routes.", emoji: "🏔️" }),
  site({ name: "Mau Mau Caves", type: "historical", distance: "~15 min drive", blurb: "Forest caves used during the independence struggle — a sobering local history lesson.", emoji: "🏛️" }),
  site({ name: "Nanyuki town & equator line", type: "town", distance: "~20 min", blurb: "Equator crossing point, army town markets and the jumping-off point for the north.", emoji: "🗺️" }),
];

const NAIVASHA = [
  site({ name: "Hells Gate National Park", type: "national_park", distance: "~20 min drive", blurb: "Cycle or walk among zebra and giraffe between red cliffs — the 'Lion King' gorge.", emoji: "🚴" }),
  site({ name: "Crescent Island", type: "conservancy", distance: "~20 min + boat", blurb: "Walking safari islet with game and lake views — the safest walk in Kenya.", emoji: "🦌" }),
  site({ name: "Elsamere Conservation Centre", type: "cultural", distance: "~15 min", blurb: "Joy Adamson's lakeside home — tea gardens, bird hides and a small museum.", emoji: "🏡" }),
  site({ name: "Mount Longonot", type: "viewpoint", distance: "~40 min", blurb: "Climb the crater rim volcano for huge views over the Rift Valley floor.", emoji: "🌋" }),
];

// ---------------------------------------------------------------- Coast resorts
const DIANI = [
  site({ name: "Diani Beach", type: "beach", distance: "on the beachfront", blurb: "White-sand and coral-reef beach — the coast's best swimming stretch.", emoji: "🏖️" }),
  site({ name: "Kaya Kinondo Sacred Forest", type: "forest", distance: "~15 min", blurb: "Ancient Mijikenda sacred grove with guided forest walks and colobus monkeys.", emoji: "🌳" }),
  site({ name: "Shimba Hills National Reserve", type: "national_park", distance: "~40 min", blurb: "Coastal forest reserve with sable antelope, the rare Sheldrick's Falls and elephant.", emoji: "🦌" }),
  site({ name: "Colobus Conservation Centre", type: "cultural", distance: "~15 min", blurb: "Rescue centre for Diani's angola colobus — short tours and a forest canopy walk.", emoji: "🐒" }),
];

const WATAMU = [
  site({ name: "Watamu Marine National Park", type: "marine", distance: "boat from the beach", blurb: "Snorkelling & glass-bottom boats over coral gardens and green turtles.", emoji: "🐢" }),
  site({ name: "Mida Creek", type: "lake", distance: "~10 min", blurb: "Mangrove-lined tidal creek — boardwalk, birdlife and a famous swing bridge.", emoji: "🦩" }),
  site({ name: "Gede Ruins", type: "historical", distance: "~15 min", blurb: "Swahili city ruins in a forest of giant baobabs — Kenya's best medieval site.", emoji: "🏛️" }),
  site({ name: "Turtle nesting beaches", type: "beach", distance: "~10 min", blurb: "Night patrols with Local Ocean Trust protect nesting green & hawksbill turtles.", emoji: "🐢" }),
];

const LAMU = [
  site({ name: "Lamu Old Town (UNESCO)", type: "historical", distance: "in town", blurb: "East Africa's oldest living Swahili town — carved doors, narrow lanes, no cars.", emoji: "🏛️" }),
  site({ name: "Shela Beach", type: "beach", distance: "5–15 min dhow/walk", blurb: "The long beach below Peponi — sand, dhows and the famous Peponi Hotel bar.", emoji: "🏖️" }),
  site({ name: "Lamu Museum & Fort", type: "historical", distance: "10 min walk", blurb: "Swahili culture, the fort's courtyards and the seafront dhow harbour.", emoji: "🕌" }),
  site({ name: "Takwa Ruins, Manda Island", type: "historical", distance: "boat crossing", blurb: "16th-century Swahili ruins on Manda — a short dhow trip across the channel.", emoji: "⛵" }),
];

// ---------------------------------------------------------------- Nairobi & Eastern
const NAIROBI = [
  site({ name: "Nairobi National Park", type: "national_park", distance: "~25 min from the city", blurb: "The world's only capital-city national park — lions and rhino against the skyline.", emoji: "🦁" }),
  site({ name: "Giraffe Centre", type: "cultural", distance: "~15 min (Karen)", blurb: "Feed the endangered Rothschild's giraffe from a raised platform.", emoji: "🦒" }),
  site({ name: "David Sheldrick Wildlife Trust", type: "cultural", distance: "~25 min", blurb: "Morning visits to orphaned elephant and rhino babies at their nursery.", emoji: "🐘" }),
  site({ name: "Karen Blixen Museum", type: "historical", distance: "~15 min", blurb: "The 'Out of Africa' farmhouse, kept as the author left it.", emoji: "🏡" }),
];

const EASTERN = [
  site({ name: "Ol Donyo Sabuk National Park", type: "national_park", distance: "~40 min from Thika", blurb: "Climb to Lord Macmillan's grave for views over the plains and Fourteen Falls.", emoji: "⛰️" }),
  site({ name: "Fourteen Falls", type: "waterfall", distance: "~30 min", blurb: "A wide staircase of falls on the Athi River — boat rides at the base.", emoji: "💦" }),
];

const MERU = [
  site({ name: "Meru National Park", type: "national_park", distance: "~1h drive", blurb: "Elsa the lioness's country — rivers, doum palms and Kenya's rhino success story.", emoji: "🦁" }),
  site({ name: "Nyambene Hills", type: "viewpoint", distance: "~1h", blurb: "Miraa-growing highlands with dramatic ridges and forest viewpoints.", emoji: "⛰️" }),
  site({ name: "Meru Museum & Njuri Ncheke", type: "cultural", distance: "in town", blurb: "Regional museum and the sacred council grove of the Ameru elders.", emoji: "🛕" }),
];

const EMBU = [
  site({ name: "Seven Forks (Kindaruma Dam)", type: "waterfall", distance: "~40 min", blurb: "Kenya's hydropower cascade on the Tana — dams, reservoirs and hippo views.", emoji: "💦" }),
  site({ name: "Mwea Rice Fields", type: "viewpoint", distance: "~1h", blurb: "Endless green paddies of Kenya's rice bowl — scenic drives and birdlife.", emoji: "🌾" }),
  site({ name: "Mount Kenya eastern gates", type: "national_park", distance: "~1h", blurb: "Chogoria & Kithinu routes into the mountain's rainforest belt.", emoji: "🏔️" }),
];

// ---------------------------------------------------------------- Western
const WESTERN = [
  site({ name: "Kakamega Forest National Reserve", type: "forest", distance: "10 min to the gate", blurb: "The last remnant of the Guineo-Congolian rainforest — monkeys, birds and snakes.", emoji: "🌳" }),
  site({ name: "Isiukhu Falls", type: "waterfall", distance: "~25 min", blurb: "Forest waterfall reached on a short trail from the Buyangu gate.", emoji: "💦" }),
  site({ name: "Crying Stone of Ilesi", type: "cultural", distance: "~30 min", blurb: "The iconic weeping rock formation near Kakamega town — a beloved local landmark.", emoji: "🪨" }),
];

const KITALE = [
  site({ name: "Saiwa Swamp National Park", type: "national_park", distance: "~40 min", blurb: "Kenya's smallest park, guarding the rare semi-aquatic sitatunga antelope.", emoji: "🦌" }),
  site({ name: "Mount Elgon National Park", type: "national_park", distance: "~1.5h", blurb: "Cave-dwelling elephants and the caldera on the Uganda border.", emoji: "🐘" }),
  site({ name: "Kitale Museum", type: "cultural", distance: "10 min walk", blurb: "Snakes, butterflies and the famous traditional hut collection.", emoji: "🦋" }),
];

// ---------------------------------------------------------------- The new frontier
const NORTH_EAST = [
  site({ name: "Bour-Algi Giraffe Sanctuary", type: "conservancy", distance: "~20 min from town", blurb: "Community sanctuary protecting Garissa's reticulated giraffe.", emoji: "🦒" }),
  site({ name: "Tana River", type: "lake", distance: "at the riverfront", blurb: "Kenya's longest river — hippo, crocodile and riverbank fishing.", emoji: "🐊" }),
];

const TURKANA = [
  site({ name: "Lake Turkana — the Jade Sea", type: "lake", distance: "~1.5h to the shore", blurb: "The world's largest desert lake — jade water, crocs and endless horizons.", emoji: "🌊" }),
  site({ name: "Eliye Springs", type: "lake", distance: "~1.5h", blurb: "Palm-fringed springs where the desert meets the lake — the classic Turkana stop.", emoji: "🌴" }),
  site({ name: "Kalokol & the Turkana basin", type: "cultural", distance: "~2h", blurb: "Fishing villages, the fossil-rich Turkana basin and traditional Turkana homesteads.", emoji: "🎣" }),
];

// ---------------------------------------------------------------- Per-listing map
export const NEARBY_SITES: Record<string, NearbySite[]> = {
  // Mara & south
  "angama-mara": [...MARA, site({ name: "Oloololo Escarpment", type: "viewpoint", distance: "on the lodge ridge", blurb: "Walk the escarpment rim above the Mara Triangle at sunrise.", emoji: "⛰️" })],
  "governors-camp": [...MARA, site({ name: "Musiara Marsh", type: "conservancy", distance: "at the camp", blurb: "The famous lion-and-leopard marsh right at Governors' doorstep.", emoji: "🦁" })],
  "entim-camp": [...MARA, site({ name: "Talek River", type: "lake", distance: "at the camp", blurb: "Camp sits on the Talek — hippo by night, game drives from the gate.", emoji: "🦛" })],
  "amboseli-serena-safari-lodge": AMBOSELI,
  "elephant-bedroom-camp": SAMBURU,
  "ol-pejeta-bush-camp": LAIKIPIA,
  "finch-hattons": TSAVO,
  "serena-mountain-lodge": MT_KENYA,
  "lake-naivasha-sopa-resort": NAIVASHA,
  "giraffe-manor": NAIROBI,

  // Coast resorts
  "kinondo-kwetu": DIANI,
  "diani-sea-lodge": DIANI,
  "the-sands-at-nomad": DIANI,
  "medina-palms-watamu": WATAMU,
  "peponi-hotel-lamu": LAMU,

  // Nairobi & Eastern
  "milimani-backpackers-nairobi": NAIROBI,
  "brooklyn-hotel-machakos": [
    site({ name: "Machakos People's Park", type: "town", distance: "10 min walk", blurb: "The county's green riverside park — jogging, families and weekend buzz.", emoji: "🌳" }),
    site({ name: "Iveti Hills viewpoint", type: "viewpoint", distance: "~30 min", blurb: "Climb the ridge for sweeping views over Machakos and the Yatta plateau.", emoji: "⛰️" }),
    site({ name: "Kituluni Hill", type: "viewpoint", distance: "~25 min", blurb: "The 'magnet' hill where cars roll uphill — a beloved local curiosity.", emoji: "🧲" }),
    site({ name: "Ol Donyo Sabuk National Park", type: "national_park", distance: "~50 min", blurb: "Climb the lone mountain for views over Fourteen Falls and the plains.", emoji: "⛰️" }),
  ],
  "blue-post-hotel-thika": [
    site({ name: "Chania Falls", type: "waterfall", distance: "at the hotel", blurb: "The falls the Blue Post is famous for — right behind the gardens.", emoji: "💦" }),
    ...EASTERN,
  ],
  "green-hills-hotel-nyeri": [
    site({ name: "Aberdare National Park", type: "national_park", distance: "~1h", blurb: "Moorlands, waterfalls and bongo — the mountain park above Nyeri.", emoji: "🦌" }),
    site({ name: "Baden-Powell grave & museum", type: "historical", distance: "in town", blurb: "The Scout founder is buried at St Peter's on Nyeri hill.", emoji: "🏛️" }),
    site({ name: "Chinga Dam", type: "lake", distance: "~25 min", blurb: "Scenic reservoir in the hills with picnic spots and birdlife.", emoji: "💧" }),
  ],
  "thiiri-cultural-centre-meru": MERU,
  "rafiki-house-nanyuki": [
    site({ name: "Equator line", type: "viewpoint", distance: "5 min in town", blurb: "Stand in both hemispheres at Nanyuki's equator monument.", emoji: "🌍" }),
    site({ name: "Ol Pejeta Conservancy", type: "conservancy", distance: "~15 min", blurb: "Black rhino, chimps and the last northern white rhinos — a short drive away.", emoji: "🦏" }),
    site({ name: "Sweetwaters Chimpanzee Sanctuary", type: "conservancy", distance: "~20 min", blurb: "Rescued chimps in a riverside enclosure on Ol Pejeta.", emoji: "🐒" }),
    site({ name: "Ngare Ndare Forest", type: "forest", distance: "~40 min", blurb: "Ancient cedar forest with a canopy walkway and waterfalls.", emoji: "🌳" }),
  ],
  "esstana-guest-house-embu": EMBU,
  "gerish-hotel-embu": EMBU,
  "panesic-hotel-embu": EMBU,
  "thomsons-falls-lodge": [
    site({ name: "Thomson's Falls", type: "waterfall", distance: "at the lodge", blurb: "The 74 m falls plunge right below the lodge terrace.", emoji: "💦" }),
    site({ name: "Aberdare National Park (Shamata gate)", type: "national_park", distance: "~45 min", blurb: "The park's quiet western gate into moorland and forest.", emoji: "🦌" }),
    site({ name: "Lake Ol'Bolossat", type: "lake", distance: "~40 min", blurb: "Nyandarua's highland lake — flamingos, cranes and wetlands.", emoji: "🦩" }),
  ],
  "rangeland-hotel-isiolo": [
    site({ name: "Samburu National Reserve gateway", type: "conservancy", distance: "~40 min", blurb: "Isiolo is the launch town for Samburu, Buffalo Springs and Shaba.", emoji: "🦁" }),
    site({ name: "Buffalo Springs National Reserve", type: "conservancy", distance: "~45 min", blurb: "Grevy's zebra, reticulated giraffe and the Ewaso Ng'iro river.", emoji: "🦓" }),
    site({ name: "Isiolo town market", type: "town", distance: "in town", blurb: "The northern gateway's bustling camel-and-goat market.", emoji: "🐪" }),
  ],

  // Rift Valley Lakes
  "fishermans-camp-naivasha": NAIVASHA,
  "crayfish-camp-naivasha": NAIVASHA,
  "lanet-matfam-nakuru": [
    site({ name: "Lake Nakuru National Park", type: "national_park", distance: "~25 min", blurb: "Flamingos, rhino and Rothschild's giraffe around the soda lake.", emoji: "🦩" }),
    site({ name: "Menengai Crater viewpoint", type: "viewpoint", distance: "~30 min", blurb: "Drive to the rim of Kenya's second-largest crater for valley views.", emoji: "🌋" }),
    site({ name: "Hyrax Hill Prehistoric Site", type: "historical", distance: "~20 min", blurb: "Iron Age settlement site and museum on Nakuru's edge.", emoji: "🏛️" }),
    site({ name: "Lord Egerton Castle", type: "historical", distance: "~25 min", blurb: "A storybook 1930s castle with gardens, 20 minutes from town.", emoji: "🏰" }),
  ],

  // Western
  "mountainview-backpackers-kisumu": [
    site({ name: "Lake Victoria & Dunga Hill Pier", type: "lake", distance: "~15 min", blurb: "Sunset dhow rides and the lakeside fish market.", emoji: "⛵" }),
    site({ name: "Kisumu Impala Sanctuary", type: "conservancy", distance: "~20 min", blurb: "Impala, hippo and views across the lake to the hills.", emoji: "🦌" }),
    site({ name: "Kit Mikayi", type: "cultural", distance: "~30 min", blurb: "The legendary rock that 'wept' — a sacred Luo landmark.", emoji: "🪨" }),
    site({ name: "Ndere Island National Park", type: "national_park", distance: "~45 min", blurb: "A grassy island sanctuary in the lake, reached by boat.", emoji: "🏝️" }),
  ],
  "mahindi-comfy-eldoret": [
    site({ name: "Iten viewpoint", type: "viewpoint", distance: "~40 min", blurb: "The 'home of champions' — watch runners on the famous escarpment track.", emoji: "🏃" }),
    site({ name: "Kaptagat Forest", type: "forest", distance: "~50 min", blurb: "Training forest of Kenya's marathon greats — a scenic drive.", emoji: "🌳" }),
    site({ name: "Eldoret town markets", type: "town", distance: "in town", blurb: "Uganda Road shopping and the cereals & miraa markets.", emoji: "🛒" }),
  ],
  "golf-hotel-kakamega": WESTERN,
  "pazuri-hotel-kitale": KITALE,
  "tea-hotel-kericho": [
    site({ name: "Tea estates", type: "viewpoint", distance: "at the hotel", blurb: "Walk the surrounding tea fields — Kericho's rolling green carpets.", emoji: "🍃" }),
    site({ name: "Mau Forest", type: "forest", distance: "~1h", blurb: "Kenya's largest montane forest — waterfalls, springs and birdlife.", emoji: "🌳" }),
    site({ name: "Chagaik Arboretum", type: "forest", distance: "~25 min", blurb: "A quiet collection of indigenous trees with trails and picnic spots.", emoji: "🌲" }),
  ],
  "knight-motel-kisii": [
    site({ name: "Tabaka soapstone carvers", type: "cultural", distance: "~30 min", blurb: "Watch master carvers shape Kisii's famous soapstone — buy direct.", emoji: "🗿" }),
    site({ name: "Kisii town market", type: "town", distance: "in town", blurb: "One of the region's liveliest produce and fabric markets.", emoji: "🛒" }),
    site({ name: "Kiabonyoru Hill viewpoint", type: "viewpoint", distance: "~40 min", blurb: "The highest point in Kisii — green hills in every direction.", emoji: "⛰️" }),
  ],
  "kapsabet-comfy-hotel": [
    site({ name: "Nandi Hills viewpoint", type: "viewpoint", distance: "~30 min", blurb: "Ridge-top views over the tea-country valleys of Nandi.", emoji: "⛰️" }),
    site({ name: "Koitalel Samoei Museum", type: "cultural", distance: "~20 min", blurb: "The Nandi leader's shrine and the story of the Nandi resistance.", emoji: "🛕" }),
    site({ name: "Kingwal Swamp", type: "lake", distance: "~30 min", blurb: "Papyrus wetlands — one of the best places to see the rare sitatunga.", emoji: "🦌" }),
  ],

  // North-eastern & north-western frontier
  "palm-oasis-resort-garissa": NORTH_EAST,
  "wajir-county-guest-house": [
    site({ name: "Wajir town market & camel trade", type: "town", distance: "in town", blurb: "The county capital's camel and livestock market — a frontier hub.", emoji: "🐪" }),
    site({ name: "Wajir oasis date gardens", type: "cultural", distance: "~10 min", blurb: "Palm-shaded gardens along the seasonal Wajir riverbed.", emoji: "🌴" }),
    site({ name: "The old fort", type: "historical", distance: "in town", blurb: "Colonial-era fort remains overlooking the town.", emoji: "🏛️" }),
  ],
  "lolac-hotel-lodwar": TURKANA,

  // Coast towns
  "new-palm-tree-hotel-mombasa": [
    site({ name: "Fort Jesus", type: "historical", distance: "~15 min", blurb: "The 16th-century Portuguese fort guarding the Old Town — a UNESCO site.", emoji: "🏰" }),
    site({ name: "Mombasa Old Town", type: "historical", distance: "~15 min", blurb: "Carved doors, spice-scented lanes and the seafront market.", emoji: "🕌" }),
    site({ name: "Haller Park", type: "cultural", distance: "~25 min", blurb: "A reclaimed quarry with giraffe, hippo and giant tortoises.", emoji: "🦒" }),
    site({ name: "Bamburi Beach", type: "beach", distance: "~25 min", blurb: "The north coast's classic beach stretch with water sports.", emoji: "🏖️" }),
  ],
  "backpackers-club-malindi": [
    site({ name: "Malindi Marine National Park", type: "marine", distance: "boat from the beach", blurb: "Glass-bottom boats over coral gardens — the coast's oldest marine park.", emoji: "🐠" }),
    site({ name: "Vasco da Gama Pillar", type: "historical", distance: "15 min walk", blurb: "The 1498 stone pillar, East Africa's oldest European monument.", emoji: "🗿" }),
    site({ name: "Gede Ruins", type: "historical", distance: "~20 min", blurb: "Swahili city ruins in a baobab forest, on the road south.", emoji: "🏛️" }),
  ],
  "distant-relatives-kilifi": [
    site({ name: "Mnarani Ruins", type: "historical", distance: "across the creek", blurb: "15th-century Swahili ruins and a secret beach — kayak across.", emoji: "🛶" }),
    site({ name: "Kilifi Creek", type: "lake", distance: "at the lodge", blurb: "Paddle the mangrove creek at high tide or hammock above it.", emoji: "🌊" }),
    site({ name: "Bofa Beach", type: "beach", distance: "10 min", blurb: "Kilifi's wild, empty beach — the coast's most underrated sand.", emoji: "🏖️" }),
  ],
  "watamu-backpackers": WATAMU,
  "jambohouse-lamu": LAMU,
};

/** Look up the nearby sites for a listing slug. */
export function nearbySitesFor(slug: string): NearbySite[] | undefined {
  return NEARBY_SITES[slug];
}

/** The names of the sites a listing is near (for matching/search). */
export function siteNamesFor(slug: string): string[] {
  return (NEARBY_SITES[slug] ?? []).map((s) => s.name);
}

/** Does a listing's nearby set mention the query? Case-insensitive substring. */
export function matchesNear(slug: string, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return false;
  return siteNamesFor(slug).some((n) => n.toLowerCase().includes(term));
}

/**
 * Curated "near …" quick filters for the listings page. Each term is a real
 * site name from the nearby data (short enough to read as a chip).
 */
export const POPULAR_SITES: { name: string; emoji: string }[] = [
  { name: "Naboisho", emoji: "🦁" },
  { name: "Ol Pejeta", emoji: "🦏" },
  { name: "Samburu", emoji: "🦓" },
  { name: "Amboseli", emoji: "🐘" },
  { name: "Lake Nakuru", emoji: "🦩" },
  { name: "Hells Gate", emoji: "🚴" },
  { name: "Watamu Marine", emoji: "🐢" },
  { name: "Diani Beach", emoji: "🏖️" },
  { name: "Kakamega Forest", emoji: "🌳" },
  { name: "Mount Kenya", emoji: "🏔️" },
];
