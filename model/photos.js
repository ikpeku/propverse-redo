//
const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photos_Schema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },

    location: {
      type: String
    },
    originalname: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: String,
    },
    key: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("photos", photos_Schema);
