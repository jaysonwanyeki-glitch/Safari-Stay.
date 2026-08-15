import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// ---- Listings: safari lodges, tented camps, bush villas, hotels & beach resorts ----
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(), // tented_camp, eco_camp, bush_villa, beach_villa, apartment, guesthouse, cottage, farm_stay
  roomType: text("room_type").notNull().default("entire"), // entire | private (Airbnb-style)
  hostName: text("host_name").notNull(),
  hostSince: integer("host_since").notNull(),
  hostBio: text("host_bio"),
  superhost: boolean("superhost").default(false).notNull(),
  pricePerNight: integer("price_per_night").notNull(), // Kenyan Shillings (KES)
  cleaningFee: integer("cleaning_fee").default(0).notNull(),
  locationName: text("location_name").notNull(), // park / reserve / area
    region: text("region").notNull(),
    county: text("county"),
    landmark: text("landmark"),
    priceTier: text("price_tier").notNull().default("mid"),
    latitude: numeric("latitude", { precision: 9, scale: 6 }).notNull(),
  longitude: numeric("longitude", { precision: 9, scale: 6 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  beds: integer("beds").notNull(),
  bathrooms: numeric("bathrooms", { precision: 3, scale: 1 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: text("amenities").array().notNull(),
  highlights: text("highlights").array(),
  imageUrls: text("image_urls").array().notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  reviewsCount: integer("reviews_count").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---- Guest reviews ----
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  guestName: text("guest_name").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  stayedOn: text("stayed_on").notNull(),
});

// ---- Reservations (booking flow) ----
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull(),
  nights: integer("nights").notNull(),
  totalKes: integer("total_kes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
