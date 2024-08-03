const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const property_activities_Schema = new Schema(
  {
    title: String,
    activity: String,
    documents_type: String,
    property: {
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "properties",
        required: true,
      },
    documents: [
      {
        location: String,
        originalname: String,
        mimetype: String,
        size: String,
        key: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

property_activities_Schema.plugin(aggregatePaginate);

module.exports = mongoose.model("property_activities", property_activities_Schema);
