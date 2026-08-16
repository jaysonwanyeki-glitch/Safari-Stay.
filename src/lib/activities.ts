// ---------------------------------------------------------------- Fun things to do
// Real activity spots across Kenya — the places guests actually fill a day with:
// adventure tours, skating rinks, riding schools, hiking trails, water parks,
// cooking classes and volunteering (Red Cross, St John Ambulance and the coast
// conservation projects). Every entry is a real, named place with honest 2025–26
// info; prices are indicative. Coordinates power the radius search and maps.

export type ActivityCategory =
  | "water_fun"
  | "skating"
  | "horse_riding"
  | "hiking"
  | "swimming"
  | "cooking"
  | "volunteering"
  | "dining"
  | "adventure";

export type Activity = {
  /** Unique id (also the anchor slug on /activities). */
  id: string;
  name: string;
  category: ActivityCategory;
  /** Where it is — town + county. */
  location: string;
  region: string;
  emoji: string;
  /** One line on what you actually do there. */
  blurb: string;
  /** Indicative cost, or undefined when free/by-donation. */
  cost?: string;
  coords: { lat: number; lng: number };
  /** Listing slugs of stays beside this activity (links on the directory page). */
  staysNear: string[];
};

const a = (x: Activity) => x;

export const ACTIVITIES: Activity[] = [
  // ---------------------------------------------------------------- Diani & coast
  a({
    id: "safari-sands-tours-diani",
    name: "Safari Sands Tours — Diani",
    category: "adventure",
    location: "Diani Beach, Kwale",
    region: "Coast",
    emoji: "🏎️",
    blurb:
      "Diani's action hub: quad biking along the beach from about KES 4,500, plus ziplining, archery, crossbow, kayaking, segway tours and nature trails.",
    cost: "Quad biking from ≈ KES 4,500",
    coords: { lat: -4.33, lng: 39.58 },
    staysNear: ["kinondo-kwetu", "diani-sea-lodge", "the-sands-at-nomad"],
  }),
  a({
    id: "ali-barbours-cave",
    name: "Ali Barbour's Cave Restaurant",
    category: "dining",
    location: "Diani Beach Road, Kwale",
    region: "Coast",
    emoji: "🕯️",
    blurb:
      "The famous cave restaurant — dinner inside a natural coral cave with an open ceiling, lit by candles and the night sky. Book ahead; it's a Diani institution.",
    cost: "Fine dining — book ahead",
    coords: { lat: -4.31, lng: 39.58 },
    staysNear: ["kinondo-kwetu", "diani-sea-lodge", "the-sands-at-nomad"],
  }),
  a({
    id: "swahili-cooking-diani",
    name: "Swahili cooking class — Diani",
    category: "cooking",
    location: "Diani Beach, Kwale",
    region: "Coast",
    emoji: "🍛",
    blurb:
      "Learn pilau, coconut rice and chapati with a coastal family — most classes start with a market tour and end with the lunch you cooked. From about KES 2,000 per person.",
    cost: "From ≈ KES 2,000 pp",
    coords: { lat: -4.32, lng: 39.58 },
    staysNear: ["kinondo-kwetu", "diani-sea-lodge", "the-sands-at-nomad"],
  }),
  a({
    id: "local-ocean-trust-watamu",
    name: "Local Ocean Trust — turtle patrols",
    category: "volunteering",
    location: "Watamu, Kilifi",
    region: "Coast",
    emoji: "🐢",
    blurb:
      "Join night patrols protecting nesting green & hawksbill turtles, or visit the rehabilitation tanks. Volunteers are always welcome at the beach bar afterwards.",
    cost: "Donation-based",
    coords: { lat: -3.36, lng: 40.04 },
    staysNear: ["watamu-backpackers", "medina-palms-watamu"],
  }),
  a({
    id: "colobus-conservation-diani",
    name: "Colobus Conservation — volunteer day",
    category: "volunteering",
    location: "Diani Beach, Kwale",
    region: "Coast",
    emoji: "🐒",
    blurb:
      "Help with forest walks, rope-bridge monitoring and rescued angola colobus at Diani's own conservation centre — a half-day volunteer shift is easy to join.",
    cost: "Donation-based",
    coords: { lat: -4.32, lng: 39.59 },
    staysNear: ["kinondo-kwetu", "diani-sea-lodge", "the-sands-at-nomad"],
  }),
  // ---------------------------------------------------------------- Nairobi & around
  a({
    id: "sk8city-nairobi",
    name: "Sk8City — roller skating",
    category: "skating",
    location: "Diamond Plaza II, Parklands, Nairobi",
    region: "Nairobi",
    emoji: "🛼",
    blurb:
      "Kenya's first and Africa's largest indoor roller-skating rink, on top of Diamond Plaza II. Open daily 10 am–3 am — skating, food, themed nights and private parties.",
    cost: "Sessions from ≈ KES 500",
    coords: { lat: -1.25, lng: 36.82 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "panari-ice-rink",
    name: "Panari Ice Rink",
    category: "skating",
    location: "Panari Hotel, Mombasa Rd, Nairobi",
    region: "Nairobi",
    emoji: "⛸️",
    blurb:
      "Nairobi's ice-skating rink — boots included, from about KES 1,200 for kids and KES 1,500 for adults per session. A favourite weekend outing.",
    cost: "KES 1,200–1,500 per session",
    coords: { lat: -1.34, lng: 36.86 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "hub-karen-skating",
    name: "Roller skating at The Hub Karen",
    category: "skating",
    location: "The Hub, Karen, Nairobi",
    region: "Nairobi",
    emoji: "🛼",
    blurb:
      "Weekend roller rink at The Hub Karen — KES 500 for 30 minutes, KES 700 for an hour. Beginners welcome, trainers on hand.",
    cost: "KES 500–700 per session",
    coords: { lat: -1.32, lng: 36.72 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "gallopgo-stables",
    name: "GallopGo Stables — horse riding",
    category: "horse_riding",
    location: "Kitisuru, Nairobi",
    region: "Nairobi",
    emoji: "🐎",
    blurb:
      "Riding lessons and guided trail rides for every age and level in Kitisuru — grooming, picnics with the horses, archery and darts on the full-day programme.",
    cost: "Lessons from ≈ KES 2,500",
    coords: { lat: -1.23, lng: 36.77 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "forward-equestrian",
    name: "Forward Equestrian Centre",
    category: "horse_riding",
    location: "Kitisuru, Nairobi",
    region: "Nairobi",
    emoji: "🐎",
    blurb:
      "Schooling, hacking and competition riding in Kitisuru — lessons for all ages and levels, recognised by the Horse Association of Kenya.",
    cost: "Lessons — book via WhatsApp",
    coords: { lat: -1.24, lng: 36.76 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "northlands-riding",
    name: "Northlands Riding School",
    category: "horse_riding",
    location: "Ruiru, Kiambu",
    region: "Nairobi",
    emoji: "🐎",
    blurb:
      "One of Kenya's longest-running riding schools on the Nairobi–Thika road — lessons, hacks and a friendly weekend yard for families.",
    cost: "Lessons from ≈ KES 2,000",
    coords: { lat: -1.15, lng: 36.95 },
    staysNear: ["milimani-backpackers-nairobi", "blue-post-hotel-thika"],
  }),
  a({
    id: "ngong-hills-hike",
    name: "Ngong Hills hike",
    category: "hiking",
    location: "Ngong, Kajiado",
    region: "Nairobi",
    emoji: "🥾",
    blurb:
      "The classic Nairobi half-day hike — seven ridges with views over the Rift Valley escarpment. Take water and a guide at the gate.",
    cost: "Entry ≈ KES 100–500",
    coords: { lat: -1.4, lng: 36.62 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "karura-forest",
    name: "Karura Forest trails",
    category: "hiking",
    location: "Limuru Rd, Nairobi",
    region: "Nairobi",
    emoji: "🌳",
    blurb:
      "Nairobi's green lung — cycling and walking trails, waterfalls, a treehouse and picnic sites. Entry is a few hundred shillings.",
    cost: "Entry ≈ KES 100–500",
    coords: { lat: -1.24, lng: 36.82 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "wild-waters-juja",
    name: "Wild Waters Waterpark",
    category: "water_fun",
    location: "Juja, Kiambu",
    region: "Nairobi",
    emoji: "🎢",
    blurb:
      "Kenya's classic water park on the Thika road — slides, lazy river and wave pool. A full-day family favourite in the hot season.",
    cost: "Day pass from ≈ KES 1,500",
    coords: { lat: -1.1, lng: 37.0 },
    staysNear: ["blue-post-hotel-thika", "milimani-backpackers-nairobi"],
  }),
  a({
    id: "jikoni-studio-nairobi",
    name: "Jikoni Studio — meal-prep classes",
    category: "cooking",
    location: "Nairobi",
    region: "Nairobi",
    emoji: "👨‍🍳",
    blurb:
      "Hands-on cooking classes in Nairobi — learn Kenyan dishes and meal-prep skills, then eat what you make. Great for date nights and groups.",
    cost: "Classes from ≈ KES 3,000",
    coords: { lat: -1.28, lng: 36.82 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  a({
    id: "kenya-red-cross",
    name: "Kenya Red Cross — volunteer",
    category: "volunteering",
    location: "Branches in every county",
    region: "Nairobi",
    emoji: "❤️",
    blurb:
      "Join a county branch as a volunteer — first aid, blood drives, disaster response and community health. Visit your nearest branch or the Nairobi headquarters in South C.",
    cost: "Free — volunteer programme",
    coords: { lat: -1.31, lng: 36.83 },
    staysNear: ["milimani-backpackers-nairobi"],
  }),
  a({
    id: "st-john-ambulance-kenya",
    name: "St John Ambulance Kenya — first aid & volunteering",
    category: "volunteering",
    location: "Nairobi HQ + county units",
    region: "Nairobi",
    emoji: "🚑",
    blurb:
      "Train in first aid or join the volunteer corps that covers events and emergencies nationwide. HQ on University Way, Nairobi — first-aid courses run most weeks.",
    cost: "First-aid courses from ≈ KES 3,500",
    coords: { lat: -1.28, lng: 36.82 },
    staysNear: ["milimani-backpackers-nairobi"],
  }),
  a({
    id: "sheldrick-nursery",
    name: "David Sheldrick Wildlife Trust — volunteer visit",
    category: "volunteering",
    location: "Nairobi National Park edge",
    region: "Nairobi",
    emoji: "🐘",
    blurb:
      "Morning public visits to the orphaned elephant nursery — you can also foster an elephant and join the keeper volunteer experience.",
    cost: "Entry by donation (KES 500+)",
    coords: { lat: -1.34, lng: 36.8 },
    staysNear: ["milimani-backpackers-nairobi", "giraffe-manor"],
  }),
  // ---------------------------------------------------------------- The rest of Kenya
  a({
    id: "mount-longonot-hike",
    name: "Mount Longonot climb",
    category: "hiking",
    location: "Naivasha, Nakuru",
    region: "Rift Valley Lakes",
    emoji: "🌋",
    blurb:
      "Hike the crater-rim volcano near Naivasha — about 3–4 hours round trip for the rim circuit with huge views over the Rift Valley floor.",
    cost: "Park entry ≈ KES 1,000–2,000",
    coords: { lat: -0.91, lng: 36.45 },
    staysNear: ["lake-naivasha-sopa-resort", "fishermans-camp-naivasha", "crayfish-camp-naivasha"],
  }),
  a({
    id: "hells-gate-cycle",
    name: "Hells Gate — cycle & hike",
    category: "hiking",
    location: "Naivasha, Nakuru",
    region: "Rift Valley Lakes",
    emoji: "🚴",
    blurb:
      "Cycle or walk the gorge among zebra and giraffe — the 'Lion King' scenery. Bikes rent at the gate.",
    cost: "Park entry ≈ KES 1,000–2,000 + bike hire",
    coords: { lat: -0.9, lng: 36.3 },
    staysNear: ["lake-naivasha-sopa-resort", "fishermans-camp-naivasha", "crayfish-camp-naivasha"],
  }),
  a({
    id: "elephant-hill-nakuru",
    name: "Elephant Hill hike",
    category: "hiking",
    location: "Nakuru, Nakuru",
    region: "Rift Valley Lakes",
    emoji: "🥾",
    blurb:
      "The weekend hiker's favourite above Nakuru — a steady 2–3 hour climb with views over the lake and Menengai Crater.",
    cost: "Free (guided hikes available)",
    coords: { lat: -0.32, lng: 36.15 },
    staysNear: ["lanet-matfam-nakuru"],
  }),
  a({
    id: "kisumu-lake-swim",
    name: "Lake Victoria — Dunga Hill & sunset dhow",
    category: "swimming",
    location: "Kisumu, Kisumu",
    region: "Western Kenya",
    emoji: "⛵",
    blurb:
      "Sunset dhow rides and the lakeside fish market at Dunga Hill Pier — swim only where locals do, and taste the famous fresh tilapia.",
    cost: "Dhow rides from ≈ KES 500",
    coords: { lat: -0.1, lng: 34.75 },
    staysNear: ["mountainview-backpackers-kisumu"],
  }),
  a({
    id: "ngare-ndare-swim",
    name: "Ngare Ndare Forest — waterfalls & pools",
    category: "swimming",
    location: "Nanyuki, Laikipia",
    region: "Mount Kenya",
    emoji: "🏊",
    blurb:
      "Ancient cedar forest with a canopy walkway and natural waterfall pools you can actually swim in — a cool half-day from Nanyuki.",
    cost: "Entry ≈ KES 1,000–2,000",
    coords: { lat: 0.2, lng: 37.05 },
    staysNear: ["rafiki-house-nanyuki", "ol-pejeta-bush-camp"],
  }),
  a({
    id: "seven-forks-dams",
    name: "Seven Forks dams — water sports",
    category: "water_fun",
    location: "Embu / Machakos, Eastern Kenya",
    region: "Eastern Kenya",
    emoji: "🛶",
    blurb:
      "Kindaruma and the Tana cascade reservoirs — boat trips, kayaking and hippo-watching on the dams below Embu.",
    cost: "Boat trips from ≈ KES 1,000",
    coords: { lat: -0.8, lng: 37.7 },
    staysNear: ["esstana-guest-house-embu", "gerish-hotel-embu", "panesic-hotel-embu"],
  }),
  a({
    id: "tabaka-soapstone",
    name: "Tabaka soapstone carvers",
    category: "cooking",
    location: "Kisii, Kisii",
    region: "Western Kenya",
    emoji: "🗿",
    blurb:
      "Watch master carvers shape Kisii's famous soapstone and buy direct from the workshops — a craft lesson as much as a souvenir stop.",
    cost: "Free to watch; carvings from KES 200",
    coords: { lat: -0.8, lng: 34.7 },
    staysNear: ["knight-motel-kisii"],
  }),
  a({
    id: "kakamega-forest-walk",
    name: "Kakamega Forest walks",
    category: "hiking",
    location: "Kakamega, Kakamega",
    region: "Western Kenya",
    emoji: "🌳",
    blurb:
      "Guided walks in the last remnant of the great Guineo-Congolian rainforest — colobus monkeys, snakes and hundreds of birds.",
    cost: "Entry ≈ KES 500–1,500",
    coords: { lat: 0.28, lng: 34.85 },
    staysNear: ["golf-hotel-kakamega"],
  }),
  a({
    id: "saiwa-swamp-walk",
    name: "Saiwa Swamp — boardwalk",
    category: "hiking",
    location: "Kitale, Trans Nzoia",
    region: "Western Kenya",
    emoji: "🦌",
    blurb:
      "Kenya's smallest park on a raised boardwalk — the easiest place in the country to see the rare semi-aquatic sitatunga.",
    cost: "Entry ≈ KES 500–1,000",
    coords: { lat: 1.08, lng: 35.12 },
    staysNear: ["pazuri-hotel-kitale"],
  }),
  a({
    id: "eliye-springs",
    name: "Eliye Springs — swim in Lake Turkana",
    category: "swimming",
    location: "Turkana, Turkana",
    region: "North Rift",
    emoji: "🌊",
    blurb:
      "Palm-fringed springs where the desert meets the Jade Sea — camp, swim and watch the lake turn turquoise at sunset.",
    cost: "Camping from ≈ KES 1,000",
    coords: { lat: 3.15, lng: 35.95 },
    staysNear: ["lolac-hotel-lodwar"],
  }),
  a({
    id: "mombasa-old-town-walk",
    name: "Mombasa Old Town & Fort Jesus",
    category: "hiking",
    location: "Mombasa, Mombasa",
    region: "Coast",
    emoji: "🏰",
    blurb:
      "A walking tour through carved doors and spice-scented lanes to the 16th-century Portuguese fort — East Africa's best urban history walk.",
    cost: "Fort entry ≈ KES 500–1,000",
    coords: { lat: -4.06, lng: 39.68 },
    staysNear: ["new-palm-tree-hotel-mombasa"],
  }),
  a({
    id: "watamu-snorkel",
    name: "Watamu Marine — snorkel & glass boat",
    category: "swimming",
    location: "Watamu, Kilifi",
    region: "Coast",
    emoji: "🐠",
    blurb:
      "Snorkel coral gardens with green turtles on glass-bottom boats from the beach — the coast's best-value marine day.",
    cost: "Boat + snorkel from ≈ KES 1,500",
    coords: { lat: -3.35, lng: 40.03 },
    staysNear: ["watamu-backpackers", "medina-palms-watamu"],
  }),
  a({
    id: "diani-swim",
    name: "Diani Beach swimming",
    category: "swimming",
    location: "Diani, Kwale",
    region: "Coast",
    emoji: "🏖️",
    blurb:
      "The coast's best swimming stretch — white sand and warm coral-reef water. Most Diani hotels open their pools to day guests too.",
    cost: "Free (hotel pools from ≈ KES 1,000 day pass)",
    coords: { lat: -4.32, lng: 39.58 },
    staysNear: ["kinondo-kwetu", "diani-sea-lodge", "the-sands-at-nomad"],
  }),
];

export const ACTIVITY_EMOJI: Record<ActivityCategory, string> = {
  adventure: "🏎️",
  dining: "🕯️",
  cooking: "🍛",
  volunteering: "❤️",
  skating: "🛼",
  horse_riding: "🐎",
  hiking: "🥾",
  swimming: "🏊",
  water_fun: "🎢",
};

export const ACTIVITY_ORDER: ActivityCategory[] = [
  "adventure",
  "dining",
  "water_fun",
  "skating",
  "horse_riding",
  "hiking",
  "swimming",
  "cooking",
  "volunteering",
];

/** Activities grouped by category in display order. */
export function activityDirectory(): { category: ActivityCategory; items: Activity[] }[] {
  return ACTIVITY_ORDER.map((category) => ({
    category,
    items: ACTIVITIES.filter((x) => x.category === category),
  })).filter((g) => g.items.length > 0);
}

/** Find activities whose name, location or blurb mentions the query. */
export function findActivityMatches(query: string): Activity[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return ACTIVITIES.filter((x) =>
    [x.name, x.location, x.region, x.blurb, x.category].some((f) => f.toLowerCase().includes(term)),
  );
}

/** Look up one activity by id (anchor slug). */
export function activityById(id: string): Activity | undefined {
  return ACTIVITIES.find((x) => x.id === id);
}
