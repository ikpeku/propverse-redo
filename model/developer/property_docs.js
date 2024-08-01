const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const property_docs_Schema = new Schema(
  {
    investor_name: String,
    sendBy: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    recieveBy: {
      type: SchemaTypes.ObjectId,
      ref: "user",
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

    status: {
      type: String,
      enum: ["Uploaded", "Failed"],
    //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

property_docs_Schema.plugin(aggregatePaginate);

module.exports = mongoose.model("property_documents", property_docs_Schema);
