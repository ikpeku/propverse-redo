const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const transaction_Schema = new Schema(
  {
    investor: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },

      transaction_type: {
        type: String,
        enum: ["property purchase", "funds"],
      },
      isVerify: {
type: Boolean,
default: false
      },
    company: {
        type: SchemaTypes.ObjectId,
        ref: "due_deligence",
        // required: true,
      },

    property: {
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "properties",
        // required: true,
      },
    funds: {
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "fund",
        // required: true,
      },
      name: String,
      status: {
        type: String,
        enum: ["Success", "Failed", "Pending"],
        required: true,
      },
      paid: {
        amount: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "",
          },
      },
      
      property_amount: {
        amount: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "",
          },
      },

      proof_of_payment: {
        location: String,
        originalname: String,
        mimetype: String,
        size: String,
        key: String,
      },
      payment_method: {
        type: String,
      },
      payment_status: {
        type: String,
      },
      description: {
        type: String,
      },

    },
    {
      timestamps: true,
    }
  );
  
  
  transaction_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("transaction", transaction_Schema);
  