// 
const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const kyc_Schema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    kyc:{
      afirmation: {
        type: Boolean,
        default: false
      },

      fund_mangager: {
        type: String,
        default: "Individual fund manager",
        enum: ["Individual fund manager", "Corperate fund manager"]

      },


      proof_of_identify: {
        document_type: {
          type: String,
          default: "",
        },
        document: {
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
      proof_of_funds:{
        document: {
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
  
      }
    }


  },
  {
    timestamps: true,
  }
);
  
  
  kyc_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("kyc", kyc_Schema);
  