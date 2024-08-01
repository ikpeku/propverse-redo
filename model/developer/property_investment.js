const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const property_investment_Schema = new Schema(
  {
    investor: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },
    property: {
        type: SchemaTypes.ObjectId,
        ref: "properties",
        required: true,
      },
      status: {
        type: String,
        enum: ["Success", "Failed"],
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

    },
    {
      timestamps: true,
    }
  );
  
  
  property_investment_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("property_investment", property_investment_Schema);
  