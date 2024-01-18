const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema(
  {
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
        },
        starCount: {
          type: Number,
          defaultValue: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", feedBackSchema);

module.exports = Feedback;
