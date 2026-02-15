const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
    },
    authorDes: {
      type: String,
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
  { timestamps: true }
);

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
