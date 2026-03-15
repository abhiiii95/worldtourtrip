import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    // id: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const faqsSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ["flight", "blog", "destination", "deals"],
      default: "home",
    },

    faqs: [faqSchema],
  },
  { timestamps: true }
);

const Faq = mongoose.models.Faq || mongoose.model("Faq", faqsSchema);

export default Faq;