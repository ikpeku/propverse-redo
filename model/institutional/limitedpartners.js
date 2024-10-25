const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const limited_partners_Schema = new Schema(
  {
    user: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },
      
    
    fund: {
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "fund",
        required: true,
      },
      capital_committed: {
        amount: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "",
          },
      },
      capital_deploy: {
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
  
  
  limited_partners_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("limited_partners", limited_partners_Schema);
  