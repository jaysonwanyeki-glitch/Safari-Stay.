// Curated taxonomy for the Kenyan Airbnb-style marketplace (individual hosts).

export type Category = {
  key: string; // matches propertyType value, or "all"
  label: string;
  icon: string; // emoji glyph
};

/** Primary filter chips shown in the category bar. */
export const CATEGORIES: Category[] = [
  { key: "all", label: "All stays", icon: "🌍" },
  { key: "guesthouse", label: "Guesthouses", icon: "🏠" },
  { key: "apartment", label: "Apartments", icon: "🏢" },
  { key: "backpacker", label: "Backpackers", icon: "🎒" },
  { key: "campsite", label: "Campsites", icon: "⛺" },
  { key: "safari_lodge", label: "Safari lodges", icon: "🦁" },
  { key: "beach_resort", label: "Beach resorts", icon: "🏖️" },
  { key: "beach_villa", label: "Beach villas", icon: "🏝️" },
  { key: "cottage", label: "Cottages", icon: "🏡" },
  { key: "bush_villa", label: "Bush homes", icon: "🌿" },
  { key: "tented_camp", label: "Tented camps", icon: "🏕️" },
  { key: "eco_camp", label: "Eco stays", icon: "🌱" },
  { key: "farm_stay", label: "Farm stays", icon: "🚜" },
];

/** Property type -> friendly label. */
export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  safari_lodge: "Safari lodge",
  beach_resort: "Beach resort",
  tented_camp: "Tented camp",
  eco_camp: "Eco stay",
  bush_villa: "Bush home",
  beach_villa: "Beach villa",
  apartment: "Apartment",
  guesthouse: "Guesthouse",
  backpacker: "Backpacker stay",
  campsite: "Campsite",
  cottage: "Cottage",
  farm_stay: "Farm stay",
};

/** Airbnb-style place label, e.g. "Entire apartment" / "Safari lodge suite". */
export function placeLabel(roomType: string, propertyType: string): string {
  const t = PROPERTY_TYPE_LABELS[propertyType] ?? propertyType;
  if (roomType === "private") return `Private room in ${t.toLowerCase()}`;
  if (propertyType === "safari_lodge") return "Safari lodge suite";
  if (propertyType === "beach_resort") return "Resort room";
  if (propertyType === "tented_camp" || propertyType === "eco_camp") return `Luxury ${t.toLowerCase()} tent`;
  if (propertyType === "backpacker") return "Backpacker stay";
  if (propertyType === "campsite") return "Campsite pitch or banda";
  return `Entire ${t.toLowerCase()}`;
}

/** Price-tier quick filters (Budget / Mid / Luxury) — tuned for local KES rates. */
export const PRICE_TIERS = [
  { key: "budget", label: "Budget", icon: "💸", blurb: "Under KES 10,000 / night" },
  { key: "mid", label: "Mid-range", icon: "💰", blurb: "KES 10,000 – 50,000" },
  { key: "luxury", label: "Luxury", icon: "👑", blurb: "KES 50,000 and up" },
] as const;

/** Derive a price tier from a nightly KES rate. */
export function tierForPrice(price: number): "budget" | "mid" | "luxury" {
  if (price < 10000) return "budget";
  if (price < 50000) return "mid";
  return "luxury";
}

/** Quick KES price-band chips for local travelers (maxPrice filter). */
export const KES_BANDS = [3000, 5000, 8000] as const;

export const TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
};

export type RegionInfo = {
  name: string; // matches the region field in the DB
  blurb: string;
  parks: string[];
  image: string;
};

/** Destination tiles on the home page. Image IDs are real Kenya photos. */
const px = (id: number, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=900&h=650`;

export const REGIONS: RegionInfo[] = [
  { name: "Maasai Mara", blurb: "Home of the Great Migration and the legendary Big Five.", parks: ["Maasai Mara NR", "Mara Triangle", "Naboisho Conservancy"], image: px(35717988) },
  { name: "Amboseli", blurb: "Towering elephant herds beneath snow-capped Kilimanjaro.", parks: ["Amboseli NP", "Chyulu Hills", "Kimana Sanctuary"], image: px(15994021) },
  { name: "Laikipia", blurb: "Exclusive conservancies protecting endangered rhino.", parks: ["Ol Pejeta", "Lewa", "Borana"], image: px(19294855) },
  { name: "Rift Valley Lakes", blurb: "Flamingo shores, hippos and glittering crater lakes.", parks: ["Lake Nakuru NP", "Lake Naivasha", "Lake Elementaita"], image: px(33473215) },
  { name: "Samburu", blurb: "The rare 'Samburu Special Five' along the Ewaso Ng'iro.", parks: ["Samburu NR", "Buffalo Springs", "Shaba"], image: px(20335122) },
  { name: "Tsavo", blurb: "Endless wilderness and the famous dust-red elephants.", parks: ["Tsavo East", "Tsavo West", "Taita Hills"], image: px(18960157) },
  { name: "Mount Kenya", blurb: "Alpine forest, glacial peaks and thundering waterfalls.", parks: ["Mount Kenya NP", "Aberdares", "Meru NP"], image: px(20975726) },
  { name: "Coast", blurb: "Powder-white beaches from Diani to Watamu and Lamu.", parks: ["Diani Beach", "Watamu", "Malindi", "Lamu"], image: px(27742235) },
  { name: "Nairobi", blurb: "A buzzing capital with a national park on its doorstep.", parks: ["Nairobi NP", "Karen", "Lang'ata"], image: px(33473218) },
  { name: "Western Kenya", blurb: "Lakeside Kisumu and the highland towns of the West.", parks: ["Kisumu", "Eldoret", "Lake Victoria"], image: px(20653797) },
  { name: "Eastern Kenya", blurb: "Ukambani hills, Thika falls and the Machakos–Kangundo corridor.", parks: ["Machakos", "Thika", "Kangundo"], image: px(5306140) },
];

/** Real weekend getaways from Nairobi — transport + stay budgeted (research 2025–26). */
export const WEEKEND_ROUTES = [
  {
    name: "Naivasha",
    q: "Naivasha",
    transport: "Matatu via Naivasha Rd · KES 800–1,300 return",
    stayFrom: "KES 1,000 / night",
    total: "From KES 3,900 all-in",
    note: "Cycle Hells Gate, camp by the lake, hippos at dusk.",
  },
  {
    name: "Nakuru",
    q: "Nakuru",
    transport: "Matatu via Nakuru–Nairobi Hwy · KES 800–1,400 return",
    stayFrom: "KES 2,500 / night",
    total: "From KES 3,600 all-in",
    note: "Menengai crater hikes and Hyrax Hill — zero entry fees.",
  },
  {
    name: "Nanyuki",
    q: "Nanyuki",
    transport: "Madaraka Express commuter or matatu · from KES 400",
    stayFrom: "KES 2,500 / night",
    total: "From KES 3,200 all-in",
    note: "Mt Kenya foothills, Mau Mau caves and Thomson's Falls nearby.",
  },
  {
    name: "Machakos",
    q: "Machakos",
    transport: "Matatu from Machakos Country Bus Station · KES 400–800 return",
    stayFrom: "KES 1,800 / night",
    total: "From KES 3,450 all-in",
    note: "People's Park is free — picnics, walks and budget staycations.",
  },
];

/** Real landmarks & regions (links to ?q= search). */
export const DIANI_SPOTS = [
  { name: "Diani Beach", q: "Diani Beach", blurb: "White sands, reef & beach bars" },
  { name: "Galu Beach", q: "Galu Beach", blurb: "Kitesurfing & barefoot shores" },
  { name: "Watamu", q: "Watamu", blurb: "Marine-park bays & turtle season" },
  { name: "Lamu Old Town", q: "Lamu", blurb: "UNESCO dhow-era alleys" },
  { name: "Maasai Mara", q: "Maasai Mara", blurb: "Home of the Great Migration" },
  { name: "Amboseli", q: "Amboseli", blurb: "Elephants under Kilimanjaro" },
];

/** Amenity groupings shown on the listing detail page. */
export const AMENITY_GROUPS: { title: string; icon: string; match: RegExp }[] = [
  { title: "Self check-in & home", icon: "🔑", match: /(self-check|kitchen|washer|workspace|essentials|parking|free parking|security|safe|iron)/i },
  { title: "Safari & nature", icon: "🦁", match: /(safari|game|wildlife|guide|bush|river|flamingo|sunset|balloon|star)/i },
  { title: "Scenic views", icon: "🌅", match: /(view|kilimanjaro|valley|mountain|lake|ocean|beach|sea|garden|balcony|terrace|reef)/i },
  { title: "Sleep & bath", icon: "🛏️", match: /(bed|linen|bath|shower|wifi|air|fan|mosquito|net)/i },
  { title: "Food & drink", icon: "🍽️", match: /(dining|breakfast|bar|bbq|grill|minibar|restaurant|coffee|tea)/i },
  { title: "Pool & wellness", icon: "🏊", match: /(pool|spa|gym|lounge|hammock|fireplace|fire|jacuzzi)/i },
  { title: "Family & access", icon: "👨‍👩‍👧", match: /(family|kid|child|beach access|nature walks|cultural|airport)/i },
];

export const SERVICE_FEE_RATE = 0.07; // 7% platform fee on the room subtotal

// ---------------------------------------------------------------- Stima & Maji
// "Stima & Maji" honesty cards — power, water and Wi-Fi truth per property.
// Every Kenyan traveller has been burned by a 12-hour blackout or a dry tap at
// a "luxury" lodge; we tell the truth instead of burying it in fine print.

export type UtilityInfo = {
  key: "power" | "water" | "wifi";
  icon: string;
  title: string;
  label: string;
  honest: string;
};

const POWER: Record<string, { icon: string; label: string; honest: string }> = {
  generator: { icon: "⚡", label: "Backup generator", honest: "Stima inaweza kukatika — but a generator kicks in fast." },
  solar: { icon: "☀️", label: "Solar-powered", honest: "Off-grid solar — power all day, even when the grid drops." },
  grid: { icon: "🔌", label: "Grid power only", honest: "No backup on site — check with the host before a heatwave." },
};

const WATER: Record<string, { icon: string; label: string; honest: string }> = {
  borehole: { icon: "💧", label: "Borehole water", honest: "Own well — taps keep running even through rationing." },
  municipal: { icon: "🚰", label: "Municipal supply", honest: "City water with storage tanks on site." },
  treated: { icon: "🧪", label: "Treated water", honest: "Filtered & treated — safe to drink from the tap." },
};

const WIFI: Record<string, { icon: string; label: string; honest: string }> = {
  fibre: { icon: "📶", label: "Fibre Wi-Fi", honest: "Fast, reliable fibre — video calls are fine." },
  starlink: { icon: "🛰️", label: "Starlink Wi-Fi", honest: "Satellite internet — solid even in the bush." },
  hotspot: { icon: "📱", label: "Mobile hotspot", honest: "Limited hotspot — fine for messages, not for streaming." },
  none: { icon: "📴", label: "No Wi-Fi", honest: "Deliberately unplugged — bring a book, not a laptop." },
};

export function stimaMaji(listing: {
  powerBackup: string;
  waterSource: string;
  wifiType: string;
}): UtilityInfo[] {
  const power = POWER[listing.powerBackup] ?? POWER.grid;
  const water = WATER[listing.waterSource] ?? WATER.municipal;
  const wifi = WIFI[listing.wifiType] ?? WIFI.hotspot;
  return [
    { key: "power", icon: power.icon, title: "Power", label: power.label, honest: power.honest },
    { key: "water", icon: water.icon, title: "Water", label: water.label, honest: water.honest },
    { key: "wifi", icon: wifi.icon, title: "Wi-Fi", label: wifi.label, honest: wifi.honest },
  ];
}

/** WhatsApp "ask the host" link with a pre-filled message. */
export function waLink(listing: { hostPhone: string | null; title: string }): string | null {
  if (!listing.hostPhone) return null;
  const digits = listing.hostPhone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(`Habari! I'm interested in ${listing.title} on SafariStay — could you tell me more?`);
  return `https://wa.me/${digits}?text=${text}`;
}
