// 
const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const non_institutional_kyc_Schema = new Schema(
  {
    _id: String,
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    document_type: {
      type: String,
      default: "",
    },
    front_document_photo: {
      location: {
        type: String,
        default: "",
      },
      originalname: {
        type: String,
        // default: "",
      },
      mimetype: {
        type: String,
        // default: "",
      },
      size: {
        type: String,
        // default: "",
      },
      key: {
        type: String,
        // default: "",
      },
    },
    bank_statement: {
      location: {
        type: String,
        default: "",
      },
      originalname: {
        type: String,
        // default: "",
      },
      mimetype: {
        type: String,
        // default: "",
      },
      size: {
        type: String,
        // default: "",
      },
      key: {
        type: String,
        // default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);
  
  
  non_institutional_kyc_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("non_institutional_kyc", non_institutional_kyc_Schema);
  