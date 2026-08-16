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

/** A site with every listing that is near it — powers the /sites directory. */
export type DirectorySite = NearbySite & { slugs: string[] };

/**
 * Reverse index: every distinct site name → the listing slugs near it.
 * Same-named sites shared across a destination (e.g. the Mara group) collapse
 * into one directory entry; duplicate slugs within a listing are dropped.
 */
export function siteDirectory(): DirectorySite[] {
  const byName = new Map<string, DirectorySite>();
  for (const [slug, sites] of Object.entries(NEARBY_SITES)) {
    for (const s of sites) {
      const key = s.name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        if (!existing.slugs.includes(slug)) existing.slugs.push(slug);
      } else {
        byName.set(key, { ...s, slugs: [slug] });
      }
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Emoji used for directory section headers, keyed by site type. */
export const SITE_TYPE_EMOJI: Record<SiteType, string> = {
  conservancy: "🦁",
  national_park: "🦒",
  marine: "🐢",
  forest: "🌳",
  beach: "🏖️",
  lake: "💧",
  waterfall: "💦",
  cultural: "🛕",
  historical: "🏛️",
  viewpoint: "⛰️",
  town: "🛒",
};

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

// ---------------------------------------------------------------- Coordinates
// Approximate real-world coordinates (lat, lng) for every distinct site, keyed
// by exact site name. These power the radius search ("stays within ~10 km of …")
// and the distance badges on search results. Values are honest to within a few
// km — good enough for a 10 km radius, not for survey work.

export const SITE_COORDS: Record<string, { lat: number; lng: number }> = {
  // Mara & south
  "Mara River & migration crossings": { lat: -1.44, lng: 35.06 },
  "Mara Triangle": { lat: -1.37, lng: 34.95 },
  "Naboisho Conservancy": { lat: -1.37, lng: 35.05 },
  "Sekenani Gate & Maasai villages": { lat: -1.41, lng: 35.12 },
  "Oloololo Escarpment": { lat: -1.27, lng: 34.99 },
  "Musiara Marsh": { lat: -1.35, lng: 35.09 },
  "Talek River": { lat: -1.39, lng: 35.12 },
  "Amboseli National Park": { lat: -2.65, lng: 37.25 },
  "Observation Hill": { lat: -2.65, lng: 37.26 },
  "Enkongo Narok Swamp": { lat: -2.63, lng: 37.22 },
  "Kimana Gate & Maasai community lands": { lat: -2.78, lng: 37.55 },
  "Mzima Springs": { lat: -3.0, lng: 38.0 },
  "Chaimu Crater & Shetani Lava Flow": { lat: -2.98, lng: 38.0 },
  "Ngulia Rhino Sanctuary": { lat: -3.03, lng: 38.05 },
  "Tsavo East — Galana River": { lat: -2.9, lng: 38.6 },
  // North & Rift
  "Samburu National Reserve": { lat: -0.65, lng: 37.5 },
  "Ewaso Ng'iro River": { lat: -0.6, lng: 37.6 },
  "Buffalo Springs National Reserve": { lat: -0.62, lng: 37.55 },
  "Shaba National Reserve": { lat: -0.68, lng: 37.75 },
  "Kalama Conservancy": { lat: -0.5, lng: 37.4 },
  "Ol Pejeta Conservancy": { lat: 0.05, lng: 36.95 },
  "Sweetwaters Chimpanzee Sanctuary": { lat: 0.06, lng: 36.96 },
  "Ngare Ndare Forest": { lat: 0.2, lng: 37.05 },
  "Lewa Wildlife Conservancy": { lat: 0.15, lng: 37.45 },
  "Mount Kenya National Park": { lat: -0.15, lng: 37.3 },
  "Mau Mau Caves": { lat: -0.2, lng: 37.2 },
  "Nanyuki town & equator line": { lat: 0.01, lng: 37.07 },
  "Equator line": { lat: 0.01, lng: 37.07 },
  "Hells Gate National Park": { lat: -0.9, lng: 36.3 },
  "Crescent Island": { lat: -0.77, lng: 36.38 },
  "Elsamere Conservation Centre": { lat: -0.78, lng: 36.4 },
  "Mount Longonot": { lat: -0.91, lng: 36.45 },
  // Coast
  "Diani Beach": { lat: -4.32, lng: 39.58 },
  "Kaya Kinondo Sacred Forest": { lat: -4.39, lng: 39.53 },
  "Shimba Hills National Reserve": { lat: -4.25, lng: 39.42 },
  "Colobus Conservation Centre": { lat: -4.32, lng: 39.59 },
  "Watamu Marine National Park": { lat: -3.35, lng: 40.03 },
  "Mida Creek": { lat: -3.35, lng: 39.98 },
  "Gede Ruins": { lat: -3.3, lng: 40.02 },
  "Turtle nesting beaches": { lat: -3.36, lng: 40.04 },
  "Lamu Old Town (UNESCO)": { lat: -2.27, lng: 40.9 },
  "Shela Beach": { lat: -2.3, lng: 40.91 },
  "Lamu Museum & Fort": { lat: -2.27, lng: 40.9 },
  "Takwa Ruins, Manda Island": { lat: -2.32, lng: 40.93 },
  "Fort Jesus": { lat: -4.06, lng: 39.68 },
  "Mombasa Old Town": { lat: -4.06, lng: 39.68 },
  "Haller Park": { lat: -3.99, lng: 39.72 },
  "Bamburi Beach": { lat: -3.98, lng: 39.73 },
  "Malindi Marine National Park": { lat: -3.2, lng: 40.15 },
  "Vasco da Gama Pillar": { lat: -3.22, lng: 40.12 },
  "Mnarani Ruins": { lat: -3.63, lng: 39.85 },
  "Kilifi Creek": { lat: -3.63, lng: 39.85 },
  "Bofa Beach": { lat: -3.61, lng: 39.86 },
  // Nairobi & Eastern
  "Nairobi National Park": { lat: -1.37, lng: 36.86 },
  "Giraffe Centre": { lat: -1.33, lng: 36.77 },
  "David Sheldrick Wildlife Trust": { lat: -1.34, lng: 36.8 },
  "Karen Blixen Museum": { lat: -1.34, lng: 36.73 },
  "Ol Donyo Sabuk National Park": { lat: -1.14, lng: 37.25 },
  "Fourteen Falls": { lat: -1.23, lng: 37.15 },
  "Machakos People's Park": { lat: -1.52, lng: 37.27 },
  "Iveti Hills viewpoint": { lat: -1.58, lng: 37.3 },
  "Kituluni Hill": { lat: -1.48, lng: 37.28 },
  "Chania Falls": { lat: -1.04, lng: 37.1 },
  "Aberdare National Park": { lat: -0.4, lng: 36.6 },
  "Aberdare National Park (Shamata gate)": { lat: -0.15, lng: 36.55 },
  "Baden-Powell grave & museum": { lat: -0.42, lng: 36.95 },
  "Chinga Dam": { lat: -0.4, lng: 37.0 },
  "Thomson's Falls": { lat: -0.03, lng: 36.37 },
  "Lake Ol'Bolossat": { lat: -0.15, lng: 36.4 },
  "Meru National Park": { lat: 0.15, lng: 38.15 },
  "Nyambene Hills": { lat: 0.2, lng: 37.95 },
  "Meru Museum & Njuri Ncheke": { lat: 0.05, lng: 37.65 },
  "Seven Forks (Kindaruma Dam)": { lat: -0.8, lng: 37.7 },
  "Mwea Rice Fields": { lat: -0.75, lng: 37.35 },
  "Mount Kenya eastern gates": { lat: -0.4, lng: 37.55 },
  "Samburu National Reserve gateway": { lat: 0.35, lng: 37.58 },
  "Isiolo town market": { lat: 0.35, lng: 37.58 },
  // Rift lakes
  "Lake Nakuru National Park": { lat: -0.37, lng: 36.08 },
  "Menengai Crater viewpoint": { lat: -0.22, lng: 36.07 },
  "Hyrax Hill Prehistoric Site": { lat: -0.3, lng: 36.12 },
  "Lord Egerton Castle": { lat: -0.33, lng: 36.15 },
  // Western
  "Kakamega Forest National Reserve": { lat: 0.28, lng: 34.85 },
  "Isiukhu Falls": { lat: 0.31, lng: 34.88 },
  "Crying Stone of Ilesi": { lat: -0.23, lng: 34.9 },
  "Saiwa Swamp National Park": { lat: 1.08, lng: 35.12 },
  "Mount Elgon National Park": { lat: 1.1, lng: 34.6 },
  "Kitale Museum": { lat: 1.02, lng: 35.0 },
  "Lake Victoria & Dunga Hill Pier": { lat: -0.1, lng: 34.75 },
  "Kisumu Impala Sanctuary": { lat: -0.12, lng: 34.73 },
  "Kit Mikayi": { lat: -0.05, lng: 34.68 },
  "Ndere Island National Park": { lat: -0.2, lng: 34.5 },
  "Iten viewpoint": { lat: 0.67, lng: 35.5 },
  "Kaptagat Forest": { lat: 0.45, lng: 35.48 },
  "Eldoret town markets": { lat: 0.52, lng: 35.27 },
  "Tea estates": { lat: -0.37, lng: 35.28 },
  "Mau Forest": { lat: -0.5, lng: 35.5 },
  "Chagaik Arboretum": { lat: -0.3, lng: 35.2 },
  "Tabaka soapstone carvers": { lat: -0.8, lng: 34.7 },
  "Kisii town market": { lat: -0.68, lng: 34.77 },
  "Kiabonyoru Hill viewpoint": { lat: -0.6, lng: 34.8 },
  "Nandi Hills viewpoint": { lat: 0.1, lng: 35.05 },
  "Koitalel Samoei Museum": { lat: 0.07, lng: 35.05 },
  "Kingwal Swamp": { lat: 0.1, lng: 35.1 },
  // The new frontier
  "Bour-Algi Giraffe Sanctuary": { lat: -0.45, lng: 39.65 },
  "Tana River": { lat: -0.5, lng: 39.6 },
  "Lake Turkana — the Jade Sea": { lat: 3.5, lng: 36.0 },
  "Eliye Springs": { lat: 3.15, lng: 35.95 },
  "Kalokol & the Turkana basin": { lat: 3.37, lng: 35.8 },
  "Wajir town market & camel trade": { lat: 1.75, lng: 40.06 },
  "Wajir oasis date gardens": { lat: 1.75, lng: 40.06 },
  "The old fort": { lat: 1.75, lng: 40.06 },
};

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Look up coordinates for a site by name — accepts a partial match, so
 * "Naboisho" finds "Naboisho Conservancy". Returns undefined when unknown.
 */
export function siteCoordsFor(query: string): { lat: number; lng: number } | undefined {
  const term = query.trim().toLowerCase();
  if (!term) return undefined;
  const exact = SITE_COORDS[query.trim()];
  if (exact) return exact;
  for (const [name, coords] of Object.entries(SITE_COORDS)) {
    if (name.toLowerCase().includes(term)) return coords;
  }
  return undefined;
}

/**
 * Resolve a search term to a canonical site name (used for headings and URL
 * params). Returns the matching directory entry when one exists.
 */
export function resolveSite(query: string): DirectorySite | undefined {
  const term = query.trim().toLowerCase();
  if (!term) return undefined;
  const exact = siteDirectory().find((s) => s.name.toLowerCase() === term);
  if (exact) return exact;
  return siteDirectory().find((s) => s.name.toLowerCase().includes(term));
}
