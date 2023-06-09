const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    data: [
      {
        question: {
          type: Number,
          required: true,
          trim: true,
        },
        most: {
          type: Number,
          required: true,
          trim: true,
        },
        least: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],
    totals: {
      most: [
        {
          type: Number,
          required: true,
        },
      ],
      least: [
        {
          type: Number,
          required: true,
        },
      ],
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
  },
  {
    collection: "disc",
  }
);

module.exports = schema;
