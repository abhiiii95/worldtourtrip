import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    travelDate: {
      type: String,
      trim: true,
    },
    travelers: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    // source helps track where the lead came from (contact page, package detail, home, etc.)
    source: {
      type: String,
      trim: true,
      default: "contact",
    },
  },
  { timestamps: true },
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
