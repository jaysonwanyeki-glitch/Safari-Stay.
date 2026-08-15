// Curated taxonomy for the Kenyan Airbnb-style marketplace (individual hosts).

export type Category = {
  key: string; // matches propertyType value, or "all"
  label: string;
  icon: string; // emoji glyph
};

/** Primary filter chips shown in the category bar. */
export const CATEGORIES: Category[] = [
  { key: "all", label: "All stays", icon: "🌍" },
  { key: "safari_lodge", label: "Safari lodges", icon: "🦁" },
  { key: "beach_resort", label: "Beach resorts", icon: "🏖️" },
  { key: "beach_villa", label: "Beach villas", icon: "🏝️" },
  { key: "apartment", label: "Apartments", icon: "🏢" },
  { key: "cottage", label: "Cottages", icon: "🏡" },
  { key: "bush_villa", label: "Bush homes", icon: "🌿" },
  { key: "guesthouse", label: "Guesthouses", icon: "🏠" },
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
  return `Entire ${t.toLowerCase()}`;
}

/** Price-tier quick filters (Budget / Mid / Luxury). */
export const PRICE_TIERS = [
  { key: "budget", label: "Budget", icon: "💸", blurb: "Under KES 20,000 / night" },
  { key: "mid", label: "Mid-range", icon: "💰", blurb: "KES 20,000 – 60,000" },
  { key: "luxury", label: "Luxury", icon: "👑", blurb: "KES 60,000 and up" },
] as const;

/** Derive a price tier from a nightly KES rate. */
export function tierForPrice(price: number): "budget" | "mid" | "luxury" {
  if (price < 20000) return "budget";
  if (price < 60000) return "mid";
  return "luxury";
}

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
