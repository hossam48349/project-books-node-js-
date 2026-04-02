import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    status: {
      type: String,
      default: "to-do",
      enum: {
        values: ["to-do", "in progress", "done"],
        message: "status must be to-do, in progress, or done",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => {
          return Array.isArray(value) && value.length > 0;
        },
        message: "tags must be a non-empty array",
      },
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;