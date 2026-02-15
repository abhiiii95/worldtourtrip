import mongoose from "mongoose";
import Author from "./Author";
import bContentModel from "./bContentModel";
import Category from "./Category";

const blogPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      required: false,
    },
    imgageAlt: {
      type: String,
    },
    metaTags: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
    },
    description: {
      type: String,
    },
    routPath: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogContent",
    },
    thumbnail: {
      type: String,
    },
    thumbnail_public_id: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.BlogPage ||
  mongoose.model("BlogPage", blogPageSchema);
