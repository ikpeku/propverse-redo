const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referral_Schema = new Schema(
  {
    referby: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    referred: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("referral", referral_Schema);