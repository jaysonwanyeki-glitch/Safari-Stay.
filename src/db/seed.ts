import { db } from "@/db";
import { bookings, listings, reviews } from "@/db/schema";
import { sql } from "drizzle-orm";
import { tierForPrice } from "@/lib/constants";

// Real Kenya photography (Pexels) used across the catalogue.
const px = (id: number, w = 1600, h = 1067, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const TENTS = [17831034, 18671249, 1001437, 9491326, 18717287, 28157088, 30041430, 17831035];
const WILDLIFE = [18960157, 5306128, 30125343, 5306140, 35717988, 20335122, 19294855, 31055413, 30705107, 20865860];
const KILIMANJARO = [35718707, 19267298, 15994021, 29093739, 5109704, 37808650, 15993988];
const ROOMS = [28148280, 6394651, 6434592, 29000312, 6876834, 14025910, 28148281, 2736384, 14025911, 29006838];
const BEACH = [27742235, 20693413, 20693411, 23234936, 36216421, 10489622, 12497747, 7952876];
const LAKES = [7734639, 33473218, 12573131, 33473215, 20653797, 20653421, 30153995];
const POOLS = [12387911, 20975737, 37790193, 20975726, 20975727, 6129994, 5041953];
const DIANI = [33719857, 27742223, 33629231, 8157590, 1591379, 37476348, 2549084];
const BALCONY = [14025912, 20221437, 13205670, 38960514, 11978834, 27349378, 14917459, 33963776];
const SWAHILI = [33802298, 25254990, 18896097];

const imgs = (...ids: number[]) => ids.map((id) => px(id));

type SeedListing = typeof listings.$inferInsert;

// ---------------------------------------------------------------- LISTINGS
// 15 real, well-known Kenyan properties. Rates are published seasonal prices
// (green/low and peak) converted to KES; coordinates are real map locations.
const RAW_LISTINGS: SeedListing[] = [
  {
    title: "Angama Mara",
    slug: "angama-mara",
    description:
      "Thirty tented suites suspended high on the Oloololo Escarpment, 300 metres above the floor of the Great Rift Valley and the Mara Triangle below. All-inclusive safari living: private game drives, walking safaris, all meals and drinks, laundry and airstrip transfers — with arguably the finest views in the Mara.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Oloololo Escarpment",
    hostName: "Angama Limited",
    hostSince: 2015,
    hostBio: "Award-winning lodge built with the Maasai community on the escarpment rim. Known for hot-air balloon dawns and migration-season crossings.",
    superhost: true,
    pricePerNight: 477000,
    peakPricePerNight: 761000,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    website: "https://www.angama.com",
    locationName: "Maasai Mara (Mara Triangle)",
    region: "Maasai Mara",
    county: "Narok",
    latitude: "-1.266700",
    longitude: "35.033300",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "Walking safaris", "All meals & drinks", "Laundry service", "Wi-Fi",
      "Airstrip transfers", "Hot-air balloon (extra)", "Kilimanjaro views", "Sundowner cocktails",
      "Masai cultural visits", "Emergency evacuation cover", "Security 24/7",
    ],
    highlights: ["Mara Triangle front-row", "Escarpment cliff-edge suites", "Balloon rides at dawn"],
    imageUrls: imgs(TENTS[0], WILDLIFE[4], KILIMANJARO[1], ROOMS[4], POOLS[2], TENTS[7]),
    rating: "4.96",
    reviewsCount: 328,
    featured: true,
  },
  {
    title: "Governors' Camp",
    slug: "governors-camp",
    description:
      "The original classic tented camp, on the banks of the Mara River since 1972 — front-row seats to the great wildebeest river crossings. Full-board stays with two to three shared game drives a day, professional guides, airstrip transfers and daily laundry in the heart of the Maasai Mara.",
    propertyType: "tented_camp",
    roomType: "entire",
    landmark: "Mara River",
    hostName: "Governors' Camp Collection",
    hostSince: 1972,
    hostBio: "A Kenyan safari institution for over half a century, family-run and set on a private bend of the Mara River.",
    superhost: true,
    pricePerNight: 117000,
    peakPricePerNight: 258000,
    cleaningFee: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.governorscamp.com",
    locationName: "Maasai Mara National Reserve",
    region: "Maasai Mara",
    county: "Narok",
    latitude: "-1.279500",
    longitude: "35.139700",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "Full board", "Shared drives daily", "Laundry service", "Wi-Fi",
      "Airstrip transfers", "Sundowner cocktails", "Bush breakfasts", "Bird watching",
      "Maasai cultural visits", "Solar power", "Security 24/7",
    ],
    highlights: ["The original Mara camp", "River-crossing front-row", "Half a century of safaris"],
    imageUrls: imgs(TENTS[1], WILDLIFE[2], ROOMS[5], TENTS[7], WILDLIFE[8], POOLS[2]),
    rating: "4.86",
    reviewsCount: 712,
    featured: true,
  },
  {
    title: "Entim Camp",
    slug: "entim-camp",
    description:
      "An intimate camp set centrally in the Maasai Mara on the Talek–Mara river confluence — the very migration corridors where the herds cross. All-inclusive luxury tents with house drinks, shared game drives, laundry and meals as the Mara plays out beyond your canvas walls.",
    propertyType: "tented_camp",
    roomType: "entire",
    landmark: "Talek River",
    hostName: "Entim Mara Camp",
    hostSince: 2012,
    hostBio: "A small, family-run camp built on the migration river crossroads — maasai guides lead every drive.",
    superhost: true,
    pricePerNight: 181000,
    peakPricePerNight: 283000,
    cleaningFee: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.entimcamp.com",
    locationName: "Maasai Mara National Reserve",
    region: "Maasai Mara",
    county: "Narok",
    latitude: "-1.383300",
    longitude: "35.066700",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "All meals & drinks", "House drinks", "Laundry service", "Wi-Fi",
      "Sundowner cocktails", "Bush breakfasts", "Walking safaris", "Bird watching",
      "Maasai cultural visits", "Solar power", "Security 24/7",
    ],
    highlights: ["On the migration crossing", "Central Mara position", "All-inclusive luxury"],
    imageUrls: imgs(TENTS[4], WILDLIFE[1], ROOMS[1], KILIMANJARO[4], TENTS[6], WILDLIFE[3]),
    rating: "4.9",
    reviewsCount: 204,
    featured: false,
  },
  {
    title: "Amboseli Serena Safari Lodge",
    slug: "amboseli-serena-safari-lodge",
    description:
      "A Maasai-themed lodge deep inside Amboseli National Park, facing the snows of Kilimanjaro across the game-rich swamps. Watch elephant families file to the waterhole from the pool terrace — the classic Amboseli postcard, live.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Amboseli NP",
    hostName: "Serena Hotels",
    hostSince: 1971,
    hostBio: "Serena's collection of lodges sits at Kenya's wildest viewpoints; this one is built on a private spring in Amboseli.",
    superhost: true,
    pricePerNight: 39700,
    peakPricePerNight: 54200,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.serenahotels.com/amboseli",
    locationName: "Amboseli National Park",
    region: "Amboseli",
    county: "Kajiado",
    latitude: "-2.638900",
    longitude: "37.250000",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "Pool", "Wi-Fi", "24-hour room service", "Breakfast included",
      "Kilimanjaro views", "Wildlife viewing", "Sundowner cocktails", "Maasai cultural visits",
      "Laundry service", "Bar & restaurant", "Security 24/7",
    ],
    highlights: ["Kilimanjaro views on site", "Elephants at the waterhole", "Inside the national park"],
    imageUrls: imgs(KILIMANJARO[2], KILIMANJARO[0], POOLS[1], ROOMS[6], WILDLIFE[5], KILIMANJARO[5]),
    rating: "4.74",
    reviewsCount: 946,
    featured: false,
  },
  {
    title: "Elephant Bedroom Camp",
    slug: "elephant-bedroom-camp",
    description:
      "Elegant 'bedroom' tents on the banks of the Ewaso Ng'iro in Samburu, where elephant families wander through camp between river visits. Home turf of the rare Samburu Special Five: reticulated giraffe, Grevy's zebra, beisa oryx, gerenuk and Somali ostrich.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Ewaso Ng'iro River",
    hostName: "Elephant Bedroom Camp",
    hostSince: 2009,
    hostBio: "A boutique tented camp famed for elephants roaming the riverbank at arm's length.",
    superhost: true,
    pricePerNight: 113500,
    peakPricePerNight: 243000,
    cleaningFee: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.elephantbedroomcamp.com",
    locationName: "Samburu National Reserve",
    region: "Samburu",
    county: "Samburu",
    latitude: "0.589400",
    longitude: "37.603300",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "All meals & drinks", "Sundowner cocktails", "Laundry service", "Wi-Fi",
      "Nature walks", "River views", "Bird watching", "Solar power", "Samburu cultural evenings",
      "Airstrip transfers", "Security 24/7",
    ],
    highlights: ["Elephants in camp", "The Samburu Special Five", "Riverfront bedroom tents"],
    imageUrls: imgs(TENTS[3], WILDLIFE[5], ROOMS[3], POOLS[2], TENTS[0], WILDLIFE[6]),
    rating: "4.92",
    reviewsCount: 176,
    featured: true,
  },
  {
    title: "Ol Pejeta Bush Camp",
    slug: "ol-pejeta-bush-camp",
    description:
      "A six-tent eco camp on East Africa's largest black rhino sanctuary, and home to the last two northern white rhinos on Earth. Solar-powered luxury on the Ewaso Ng'iro, with guided walks, night drives and conservation experiences that give back to the sanctuary.",
    propertyType: "eco_camp",
    roomType: "entire",
    landmark: "Ol Pejeta Conservancy",
    hostName: "Asilia Africa",
    hostSince: 2014,
    hostBio: "Asilia runs a small collection of purpose-built camps; Ol Pejeta is their conservation flagship in Laikipia.",
    superhost: true,
    pricePerNight: 155000,
    peakPricePerNight: 238000,
    cleaningFee: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.asiliaafrica.com/ol-pejeta-bush-camp",
    locationName: "Ol Pejeta Conservancy",
    region: "Laikipia",
    county: "Laikipia",
    latitude: "0.062800",
    longitude: "36.904400",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "Nature walks", "Night drives", "All meals", "Laundry service",
      "Conservation visits", "Solar power", "Eco-friendly", "Wi-Fi", "Wildlife viewing",
      "Coffee & tea", "Security 24/7",
    ],
    highlights: ["Black rhino sanctuary", "Last northern white rhinos", "Conservation experiences"],
    imageUrls: imgs(TENTS[5], WILDLIFE[3], ROOMS[0], POOLS[6], WILDLIFE[7], KILIMANJARO[4]),
    rating: "4.88",
    reviewsCount: 92,
    featured: false,
  },
  {
    title: "Finch Hattons Luxury Tented Camp",
    slug: "finch-hattons",
    description:
      "The grande dame of Tsavo West — a colonial-era luxury camp on the banks of a natural spring, where lions, elephants and buffalo come to drink beside the pool. Tented suites, candlelit dinners and private game drives across Kenya's largest wilderness.",
    propertyType: "tented_camp",
    roomType: "entire",
    landmark: "Mzima Springs",
    hostName: "Finch Hattons Ltd",
    hostSince: 1996,
    hostBio: "A storied Tsavo camp rebuilt in the grand safari style — sundowners by the spring are legendary.",
    superhost: true,
    pricePerNight: 256000,
    peakPricePerNight: 374000,
    cleaningFee: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.finchhattons.com",
    locationName: "Tsavo West National Park",
    region: "Tsavo",
    county: "Taita-Taveta",
    latitude: "-2.933300",
    longitude: "37.900000",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Game drives included", "Pool", "All meals", "Laundry service", "Wi-Fi",
      "Sundowner cocktails", "Bush breakfasts", "Spring-water views", "Bird watching",
      "Airstrip transfers", "Bar & restaurant", "Security 24/7",
    ],
    highlights: ["Lions by the spring", "Colonial-era grandeur", "Kenya's largest wilderness"],
    imageUrls: imgs(POOLS[2], TENTS[6], WILDLIFE[5], ROOMS[1], KILIMANJARO[0], TENTS[1]),
    rating: "4.95",
    reviewsCount: 141,
    featured: true,
  },
  {
    title: "Serena Mountain Lodge",
    slug: "serena-mountain-lodge",
    description:
      "A tree-lodge hidden in the montane forest of Mount Kenya's slopes, built around a floodlit waterhole and salt lick where elephant, buffalo and bongo emerge after dark. Rustic-cosy rooms, log fires and forest walks beneath the glaciered peaks.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Mount Kenya NP",
    hostName: "Serena Hotels",
    hostSince: 1976,
    hostBio: "Serena's mountain hideaway — a canopy-level lodge watching the forest by floodlight.",
    superhost: false,
    pricePerNight: 29700,
    peakPricePerNight: 51600,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.serenahotels.com/serena-mountain-lodge",
    locationName: "Mount Kenya National Park",
    region: "Mount Kenya",
    county: "Nyeri",
    latitude: "-0.316700",
    longitude: "37.150000",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Wildlife viewing", "Floodlit waterhole", "Breakfast included", "Wi-Fi", "Fireplace",
      "Nature walks", "Bird watching", "Hot showers", "Bar & restaurant", "Laundry service",
      "Coffee & tea", "Free parking",
    ],
    highlights: ["Night game at the salt lick", "Cloud-forest setting", "Mount Kenya base camp"],
    imageUrls: imgs(ROOMS[5], KILIMANJARO[6], POOLS[3], ROOMS[8], WILDLIFE[1], TENTS[7]),
    rating: "4.7",
    reviewsCount: 823,
    featured: false,
  },
  {
    title: "Lake Naivasha Sopa Resort",
    slug: "lake-naivasha-sopa-resort",
    description:
      "A lakeside resort spread along the shore of the Rift Valley's freshwater jewel, where hippos graze the lawns at dusk and fish eagles call overhead. Boat to Crescent Island and walk among giraffe, zebra and buffalo — a perfect Rift Valley escape.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Lake Naivasha",
    hostName: "Sopa Lodges",
    hostSince: 1997,
    hostBio: "Sopa's Rift Valley resort — manicured gardens meeting the wild shore of Lake Naivasha.",
    superhost: false,
    pricePerNight: 52900,
    peakPricePerNight: 78000,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.sopalodges.com",
    locationName: "Lake Naivasha",
    region: "Rift Valley Lakes",
    county: "Nakuru",
    latitude: "-0.811100",
    longitude: "36.391700",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Lake view", "Pool", "Breakfast included", "Wi-Fi", "Boat trips (extra)",
      "Bird watching", "Garden", "Bar & restaurant", "Laundry service", "Free parking",
      "Family friendly", "Security 24/7",
    ],
    highlights: ["Hippos on the lawn", "Crescent Island walk", "Rift Valley sunsets"],
    imageUrls: imgs(LAKES[0], LAKES[2], POOLS[0], ROOMS[3], LAKES[3], ROOMS[7]),
    rating: "4.66",
    reviewsCount: 1045,
    featured: false,
  },
  {
    title: "Giraffe Manor",
    slug: "giraffe-manor",
    description:
      "The iconic 1932 manor in Nairobi's Karen suburb, where resident Rothschild giraffes poke their heads through the breakfast windows each morning. An elegant step back in time and the world's most photogenic hotel — minutes from the Giraffe Centre and Nairobi National Park.",
    propertyType: "safari_lodge",
    roomType: "entire",
    landmark: "Karen · Lang'ata",
    hostName: "The Safari Collection",
    hostSince: 1932,
    hostBio: "A Nairobi icon and conservation pioneer — the manor's giraffes are ambassadors for the endangered Rothschild subspecies.",
    superhost: true,
    pricePerNight: 301500,
    peakPricePerNight: 401000,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    website: "https://www.thesafaricollection.com/giraffe-manor",
    locationName: "Nairobi (Karen)",
    region: "Nairobi",
    county: "Nairobi",
    latitude: "-1.375600",
    longitude: "36.744700",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Breakfast included", "Giraffe feeding", "All meals", "Wi-Fi", "Garden",
      "Nature walks", "Conservation visits", "Fireplace", "Bar & restaurant", "Laundry service",
      "Airstrip transfers", "Security 24/7",
    ],
    highlights: ["Giraffes at breakfast", "1932 manor house", "Conservation legacy"],
    imageUrls: imgs(WILDLIFE[8], ROOMS[4], KILIMANJARO[1], TENTS[7], POOLS[4], ROOMS[0]),
    rating: "4.97",
    reviewsCount: 611,
    featured: true,
  },
  {
    title: "Kinondo Kwetu",
    slug: "kinondo-kwetu",
    description:
      "Barefoot luxury on a private stretch of Galu Beach: a fully inclusive eco-resort with no cars, just sand paths under the palms. All meals, selected drinks, beachfront gym, pools and non-motorised water sports — plus snorkelling on the reef at low tide.",
    propertyType: "beach_resort",
    roomType: "entire",
    landmark: "Galu Beach",
    hostName: "Kinondo Kwetu Resort",
    hostSince: 1998,
    hostBio: "A Kenyan-owned barefoot-luxury resort on the south coast — all-inclusive, eco-minded and wonderfully unplugged.",
    superhost: true,
    pricePerNight: 139500,
    peakPricePerNight: 185000,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.kinondokwetu.com",
    locationName: "Diani Beach (Galu)",
    region: "Coast",
    county: "Kwale",
    latitude: "-4.366700",
    longitude: "39.566700",
    bedrooms: 1,
    beds: 2,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "All meals included", "Selected drinks", "Beach access", "Pool", "Gym",
      "Snorkelling included", "Non-motorised water sports", "Yoga & spa", "Wi-Fi",
      "Ocean view", "Laundry service", "Security 24/7",
    ],
    highlights: ["Private Galu beachfront", "Truly all-inclusive", "Barefoot, no-cars ethos"],
    imageUrls: imgs(BEACH[0], DIANI[1], POOLS[0], ROOMS[1], BEACH[4], BALCONY[6]),
    rating: "4.94",
    reviewsCount: 268,
    featured: true,
  },
  {
    title: "Diani Sea Lodge",
    slug: "diani-sea-lodge",
    description:
      "A classic all-inclusive beach resort on Diani's white sands — a palm garden sloping to the reef at low tide. Board sports, a dive centre and Swahili buffets, with the beach bars of Diani a stroll along the sand.",
    propertyType: "beach_resort",
    roomType: "entire",
    landmark: "Diani Beach",
    hostName: "Diani Sea Lodge",
    hostSince: 1977,
    hostBio: "One of Diani's original resorts, welcoming families and honeymooners for nearly fifty years.",
    superhost: false,
    pricePerNight: 26000,
    peakPricePerNight: 33700,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.dianisealodge.com",
    locationName: "Diani Beach",
    region: "Coast",
    county: "Kwale",
    latitude: "-4.313700",
    longitude: "39.583100",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "All meals included", "Pool", "Beach access", "Dive centre", "Wi-Fi", "Air conditioning",
      "Bar & restaurant", "Watersports (extra)", "Kids club", "Laundry service",
      "Free parking", "Security 24/7",
    ],
    highlights: ["All-inclusive Diani classic", "Reef at low tide", "On-site dive centre"],
    imageUrls: imgs(BEACH[1], DIANI[0], POOLS[4], ROOMS[2], BEACH[5], ROOMS[8]),
    rating: "4.71",
    reviewsCount: 1284,
    featured: false,
  },
  {
    title: "The Sands at Nomad",
    slug: "the-sands-at-nomad",
    description:
      "A boutique beach hotel perched on Diani's beachfront, where contemporary Swahili design meets candlelit dinners and a legendary pool at the tide's edge. Steps to the beach bars, dive shops and the reef — the sweet spot of Diani.",
    propertyType: "beach_resort",
    roomType: "entire",
    landmark: "Diani Beach",
    hostName: "Hemmingways Collection",
    hostSince: 2000,
    hostBio: "An award-winning Diani boutique hotel known for its seafront dining and serene pool.",
    superhost: true,
    pricePerNight: 36800,
    peakPricePerNight: 56200,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.thesandsatnomad.com",
    locationName: "Diani Beach",
    region: "Coast",
    county: "Kwale",
    latitude: "-4.347800",
    longitude: "39.590300",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Pool", "Beach access", "Breakfast included", "Wi-Fi", "Air conditioning",
      "Bar & restaurant", "Spa", "Dive centre (extra)", "Ocean view", "Laundry service",
      "Free parking", "Security 24/7",
    ],
    highlights: ["Boutique beachfront design", "Legendary pool", "Diani's best seafront dining"],
    imageUrls: imgs(POOLS[1], BEACH[2], DIANI[3], ROOMS[7], BALCONY[0], BEACH[6]),
    rating: "4.83",
    reviewsCount: 452,
    featured: true,
  },
  {
    title: "Medina Palms",
    slug: "medina-palms-watamu",
    description:
      "A Swahili-inspired village of suites and private villas on Watamu's lagoon-facing beach, fringing the protected marine park. Pools, a beachfront spa, and turtle season at your doorstep — as the sun sets over Mida Creek.",
    propertyType: "beach_resort",
    roomType: "entire",
    landmark: "Watamu Marine Park",
    hostName: "Medina Palms Watamu",
    hostSince: 2013,
    hostBio: "An architectural love letter to the Swahili coast, built around courtyards, pools and the Indian Ocean.",
    superhost: true,
    pricePerNight: 28900,
    peakPricePerNight: 56100,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "10:00 AM",
    website: "https://www.medinapalms.com",
    locationName: "Watamu",
    region: "Coast",
    county: "Kilifi",
    latitude: "-3.360000",
    longitude: "39.995000",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Pool", "Beach access", "Breakfast included", "Wi-Fi", "Air conditioning", "Spa",
      "Bar & restaurant", "Snorkelling (extra)", "Ocean view", "Laundry service",
      "Free parking", "Security 24/7",
    ],
    highlights: ["Marine-park lagoon", "Swahili village design", "Turtle-nesting season"],
    imageUrls: imgs(POOLS[6], BEACH[5], ROOMS[3], BEACH[1], POOLS[2], ROOMS[0]),
    rating: "4.8",
    reviewsCount: 389,
    featured: true,
  },
  {
    title: "Peponi Hotel",
    slug: "peponi-hotel-lamu",
    description:
      "The legendary whitewashed dhow-era hotel on Lamu's seafront, welcoming sailors and wanderers since 1967. Carved Swahili doors, rooftop sundowners, and the old town's labyrinth of alleys a barefoot stroll away.",
    propertyType: "beach_resort",
    roomType: "entire",
    landmark: "Shela Beach",
    hostName: "Peponi Hotels Ltd",
    hostSince: 1967,
    hostBio: "Lamu's most storied address — part hotel, part island institution, run by the same family for generations.",
    superhost: true,
    pricePerNight: 31600,
    peakPricePerNight: 41900,
    cleaningFee: 0,
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    website: "https://www.peponi-lamu.com",
    locationName: "Lamu (Shela)",
    region: "Coast",
    county: "Lamu",
    latitude: "-2.294800",
    longitude: "40.916000",
    bedrooms: 1,
    beds: 1,
    bathrooms: "1",
    maxGuests: 2,
    amenities: [
      "Breakfast included", "Rooftop terrace", "Beach access", "Wi-Fi", "Bar & restaurant",
      "Dhow trips (extra)", "Cultural visits", "Air conditioning", "Laundry service",
      "Ocean view", "Coffee & tea", "Security 24/7",
    ],
    highlights: ["Lamu legend since 1967", "Rooftop dhow sunsets", "Old town on your doorstep"],
    imageUrls: imgs(SWAHILI[0], BEACH[7], ROOMS[2], SWAHILI[1], BALCONY[5], ROOMS[5]),
    rating: "4.88",
    reviewsCount: 533,
    featured: false,
  },
];

// Derive the price tier from the low-season rate (budget / mid / luxury).
const LISTINGS: SeedListing[] = RAW_LISTINGS.map((l) => ({
  ...l,
  priceTier: tierForPrice(l.pricePerNight ?? 0),
}));

// ---------------------------------------------------------------- REVIEWS
type SeedReview = {
  listingSlug: string;
  guestName: string;
  rating: number;
  comment: string;
  stayedOn: string;
};

const REVIEWS: SeedReview[] = [
  // Angama Mara
  { listingSlug: "angama-mara", guestName: "Charlotte P.", rating: 5, comment: "Woke to mist in the escarpment below and elephants crossing the Triangle. The most beautiful room I have ever stayed in — pure theatre.", stayedOn: "August 2026" },
  { listingSlug: "angama-mara", guestName: "Duncan M.", rating: 5, comment: "Balloon at dawn over the Mara, champagne, then a leopard sighting before breakfast. Flawless in every way.", stayedOn: "July 2026" },
  { listingSlug: "angama-mara", guestName: "Aisha K.", rating: 5, comment: "The staff made our anniversary unforgettable — sundowners on the escarpment edge at sunset. Worth every shilling.", stayedOn: "October 2026" },
  // Governors' Camp
  { listingSlug: "governors-camp", guestName: "Tom R.", rating: 5, comment: "River crossing at our door on day two. Classic canvas camp done properly — bucket showers included!", stayedOn: "July 2026" },
  { listingSlug: "governors-camp", guestName: "Sofia L.", rating: 4, comment: "Wonderful guiding and a real sense of history. Expect the classic camp experience rather than boutique luxury.", stayedOn: "June 2026" },
  { listingSlug: "governors-camp", guestName: "James W.", rating: 5, comment: "Fifty years of practice shows. Drives were long, cold and brilliant — and the campfire sundowners are magic.", stayedOn: "August 2026" },
  // Entim Camp
  { listingSlug: "entim-camp", guestName: "Priya N.", rating: 5, comment: "Three crossings in two days from the camp's own river position. Intimate, warm and brilliantly located.", stayedOn: "September 2026" },
  { listingSlug: "entim-camp", guestName: "Hans G.", rating: 5, comment: "Small camp, huge wildlife. House drinks by the fire after a lion hunt played out in front of us.", stayedOn: "July 2026" },
  // Amboseli Serena
  { listingSlug: "amboseli-serena-safari-lodge", guestName: "Emma T.", rating: 4, comment: "Elephants at the waterhole from the pool — and Kilimanjaro pink at dawn. Rooms are classic rather than modern, but the setting is unbeatable.", stayedOn: "January 2026" },
  { listingSlug: "amboseli-serena-safari-lodge", guestName: "David O.", rating: 5, comment: "Our kids counted 60 elephants in an hour. Friendly staff and a very reasonable rate for a park lodge.", stayedOn: "April 2026" },
  // Elephant Bedroom Camp
  { listingSlug: "elephant-bedroom-camp", guestName: "Natalie F.", rating: 5, comment: "An elephant family walked through camp while we had tea. The Special Five were all ticked by day three.", stayedOn: "August 2026" },
  { listingSlug: "elephant-bedroom-camp", guestName: "Kwame A.", rating: 5, comment: "The riverbank bedroom tents are pure romance — falling asleep to the Ewaso Ng'iro and waking to giraffe.", stayedOn: "June 2026" },
  // Ol Pejeta Bush Camp
  { listingSlug: "ol-pejeta-bush-camp", guestName: "Grace M.", rating: 5, comment: "Seeing the last northern white rhinos with a ranger was profoundly moving. A stay with real purpose.", stayedOn: "July 2026" },
  { listingSlug: "ol-pejeta-bush-camp", guestName: "Rob H.", rating: 4, comment: "Superb guiding, lovely tents. The night drive was the highlight of our whole trip.", stayedOn: "September 2026" },
  // Finch Hattons
  { listingSlug: "finch-hattons", guestName: "Isabella R.", rating: 5, comment: "Lions drinking at the spring beside the pool — surreal. This is old-school safari glamour at its best.", stayedOn: "August 2026" },
  { listingSlug: "finch-hattons", guestName: "Oliver B.", rating: 5, comment: "The camp's setting on the spring is extraordinary. Service and food were impeccable.", stayedOn: "October 2026" },
  // Serena Mountain Lodge
  { listingSlug: "serena-mountain-lodge", guestName: "Anna D.", rating: 4, comment: "Buffalo at the floodlit waterhole all night — the kids didn't sleep and didn't care. Rustic charm in the cloud forest.", stayedOn: "March 2026" },
  { listingSlug: "serena-mountain-lodge", guestName: "Peter K.", rating: 4, comment: "Great base for climbing Mt Kenya. Rooms are dated but the wildlife viewing is world-class.", stayedOn: "February 2026" },
  // Lake Naivasha Sopa
  { listingSlug: "lake-naivasha-sopa-resort", guestName: "Lucy W.", rating: 4, comment: "Hippos grazing the lawn at dusk — our boat trip to Crescent Island was the trip's highlight.", stayedOn: "May 2026" },
  { listingSlug: "lake-naivasha-sopa-resort", guestName: "Mark S.", rating: 4, comment: "Great value lakeside resort. Gardens are lovely; rooms are perfectly comfortable.", stayedOn: "November 2026" },
  // Giraffe Manor
  { listingSlug: "giraffe-manor", guestName: "Hannah B.", rating: 5, comment: "A giraffe head through the breakfast window. I cried. I simply cannot recommend this place enough.", stayedOn: "July 2026" },
  { listingSlug: "giraffe-manor", guestName: "Liam O.", rating: 5, comment: "Feeding the Rothschild giraffes at eye level was the single most magical moment of our honeymoon.", stayedOn: "December 2026" },
  { listingSlug: "giraffe-manor", guestName: "Zara H.", rating: 5, comment: "1932 elegance, extraordinary conservation story, and the world's most famous breakfast guests.", stayedOn: "August 2026" },
  // Kinondo Kwetu
  { listingSlug: "kinondo-kwetu", guestName: "Megan C.", rating: 5, comment: "Shoes off for four days. Snorkelling the reef, yoga at dawn, all-inclusive and utterly restful.", stayedOn: "January 2026" },
  { listingSlug: "kinondo-kwetu", guestName: "Samuel J.", rating: 5, comment: "The best value all-inclusive on the south coast. Beachfront bandas under the palms are pure bliss.", stayedOn: "April 2026" },
  { listingSlug: "kinondo-kwetu", guestName: "Claire D.", rating: 4, comment: "Wonderful beach and food. Go in green season for the best rates and quieter sands.", stayedOn: "June 2026" },
  // Diani Sea Lodge
  { listingSlug: "diani-sea-lodge", guestName: "Brian K.", rating: 4, comment: "Solid all-inclusive classic on the best stretch of Diani sand. Great value for families.", stayedOn: "August 2026" },
  { listingSlug: "diani-sea-lodge", guestName: "Fatima A.", rating: 4, comment: "Reef snorkelling at low tide straight off the beach. Rooms are dated but spotless.", stayedOn: "February 2026" },
  // The Sands at Nomad
  { listingSlug: "the-sands-at-nomad", guestName: "Jessica M.", rating: 5, comment: "Candlelit dinner with our toes in the sand. The pool at high tide is one of the best on the coast.", stayedOn: "July 2026" },
  { listingSlug: "the-sands-at-nomad", guestName: "Andre V.", rating: 5, comment: "Effortlessly stylish. The seafront dining and cocktails were the highlight of our Diani week.", stayedOn: "September 2026" },
  // Medina Palms
  { listingSlug: "medina-palms-watamu", guestName: "Sophie L.", rating: 5, comment: "Stunning Swahili architecture, lagoon views, and we watched turtles hatching in November. Unforgettable.", stayedOn: "November 2026" },
  { listingSlug: "medina-palms-watamu", guestName: "Tom D.", rating: 4, comment: "Beautiful villas and pools. Watamu's reef is a short boat ride and worth every shilling.", stayedOn: "December 2026" },
  // Peponi Hotel
  { listingSlug: "peponi-hotel-lamu", guestName: "Rebecca S.", rating: 5, comment: "Lamu time moves slowly and so does dinner — in the best way. Rooftop sundowners over the dhows.", stayedOn: "January 2026" },
  { listingSlug: "peponi-hotel-lamu", guestName: "Chris P.", rating: 5, comment: "A step back to the dhow era. Shela beach, old town alleys and the most relaxed hotel in Kenya.", stayedOn: "March 2026" },
];

// ---------------------------------------------------------------- BOOKINGS
// Deterministic PRNG so reseeding produces the same availability picture.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const GUESTS: [string, string][] = [
  ["Jane Muthoni", "jane.muthoni@gmail.com"],
  ["Peter Kipchoge", "peter.kipchoge@gmail.com"],
  ["Amina Yusuf", "amina.yusuf@gmail.com"],
  ["Daniel Wafula", "daniel.wafula@gmail.com"],
  ["Lucy Wanjiru", "lucy.wanjiru@gmail.com"],
  ["Michael Otieno", "michael.otieno@gmail.com"],
  ["Sarah Njeri", "sarah.njeri@gmail.com"],
  ["Brian Kamau", "brian.kamau@gmail.com"],
  ["Grace Achieng", "grace.achieng@gmail.com"],
  ["Kevin Mwangi", "kevin.mwangi@gmail.com"],
];

type SeedBooking = typeof bookings.$inferInsert;

function generateBookings(idBySlug: Map<string, number>, rates: Map<string, { price: number; cleaning: number; maxGuests: number }>): SeedBooking[] {
  const out: SeedBooking[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const [slug, listingId] of idBySlug) {
    const rnd = mulberry32(2000 + listingId);
    const rate = rates.get(slug)!;
    const make = (checkIn: Date, nights: number) => {
      const checkOut = addDays(checkIn, nights);
      const guest = GUESTS[Math.floor(rnd() * GUESTS.length)];
      const guests = 2 + Math.floor(rnd() * Math.max(1, rate.maxGuests - 1));
      return {
        listingId,
        guestName: guest[0],
        guestEmail: guest[1],
        checkIn: iso(checkIn),
        checkOut: iso(checkOut),
        guests,
        nights,
        totalKes: rate.price * nights + rate.cleaning,
      };
    };

    // Recent stays → "booked this week/month" stats
    const pastCount = 5 + Math.floor(rnd() * 5);
    for (let i = 0; i < pastCount; i++) {
      const daysAgo = 1 + Math.floor(rnd() * 60);
      out.push(make(addDays(today, -daysAgo), 2 + Math.floor(rnd() * 4)));
    }

    // Future stays → availability (unavailable dates)
    const futureCount = 5 + Math.floor(rnd() * 5);
    for (let i = 0; i < futureCount; i++) {
      const daysAhead = 7 + Math.floor(rnd() * 90);
      out.push(make(addDays(today, daysAhead), 2 + Math.floor(rnd() * 5)));
    }
  }
  return out;
}

// ---------------------------------------------------------------- SEED
async function seed() {
  await db.execute(sql`truncate table listings restart identity cascade`);

  const inserted = await db.insert(listings).values(LISTINGS).returning({ id: listings.id, slug: listings.slug });
  const idBySlug = new Map(inserted.map((r) => [r.slug, r.id]));
  const rates = new Map(
    LISTINGS.map((l) => [
      l.slug!,
      { price: l.pricePerNight!, cleaning: l.cleaningFee ?? 0, maxGuests: l.maxGuests ?? 2 },
    ]),
  );

  const reviewRows = REVIEWS.map((r) => ({
    listingId: idBySlug.get(r.listingSlug)!,
    guestName: r.guestName,
    rating: r.rating,
    comment: r.comment,
    stayedOn: r.stayedOn,
  }));
  await db.insert(reviews).values(reviewRows);

  const bookingRows = generateBookings(idBySlug, rates);
  await db.insert(bookings).values(bookingRows);

  console.log(`Seeded ${inserted.length} listings, ${reviewRows.length} reviews, ${bookingRows.length} bookings.`);
  await db.execute(sql`select 1`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
