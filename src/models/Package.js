import mongoose from "mongoose";

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [{ type: String }],
});

// One row in the hotel table (location → hotel name)
const hotelRowSchema = new mongoose.Schema({
  location: { type: String, trim: true },   // e.g. "Leh", "Nubra", "Pangong"
  nights: { type: Number, default: 1 },
  name: { type: String, trim: true },        // hotel names / similar
}, { _id: false });

// One pax-size → price mapping
const pricingRowSchema = new mongoose.Schema({
  pax: { type: Number },                     // e.g. 2, 4, 6, 8, 10, 12
  pricePerPerson: { type: Number },          // INR
}, { _id: false });

// One hotel option (Option 1 = 2★ Deluxe, Option 2 = 3★, …)
const hotelOptionSchema = new mongoose.Schema({
  optionName: { type: String, trim: true },     // "Option 1"
  starCategory: { type: String, trim: true },   // "2Star Deluxe", "3Star", …
  hotels: [hotelRowSchema],
  prices: [pricingRowSchema],
}, { _id: false });

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subtitle: { type: String, trim: true },
    description: { type: String },
    location: { type: String, trim: true },
    destination: { type: String, required: true, trim: true },
    destinationSlug: { type: String, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ["Adventure", "Leisure", "Beach", "Heritage", "Honeymoon", "Wildlife", "Pilgrimage", "Other"],
      default: "Leisure",
    },
    duration: { type: Number, required: true },
    nights: { type: Number },
    groupSize: { type: String, trim: true },
    price: { type: Number, required: true },
    margin: { type: Number, default: 0 },
    originalPrice: { type: Number },
    thumbnail: { type: String },
    thumbnail_public_id: { type: String },
    gallery: [{ type: String }],
    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],
    itinerary: [itineraryDaySchema],
    hotelOptions: [hotelOptionSchema],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, trim: true },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

packageSchema.index({ destinationSlug: 1, isActive: 1 });
packageSchema.index({ isPopular: 1, isActive: 1 });

export default mongoose.models.Package || mongoose.model("Package", packageSchema);
