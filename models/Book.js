const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add pagination plugin
bookSchema.plugin(mongoosePaginate);

// Create text index for search
bookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", bookSchema);
