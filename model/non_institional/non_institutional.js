const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const non_Institutional_Schema = new Schema({
    _id: {
        type: SchemaTypes.ObjectId,
        required: true,
      },
    user: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },
      property_transactions: [{
        type: SchemaTypes.ObjectId,
        ref: "property_investment",
      }
      ],
      funds_transactions: [{
        type: SchemaTypes.ObjectId,
        ref: "fund_investment",
      }
      ],
      properties: [{
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "fund",
      }
      ],
      funds: [{
        type: SchemaTypes.ObjectId,
        ref: "fund",
      }
      ],
    
    kyc: {
        type: SchemaTypes.ObjectId,
        ref: "kyc"
      },
    accreditation: {
        type: SchemaTypes.ObjectId,
        ref: "accreditation"
      },

    
    },
    {
      timestamps: true,
    }
  );
  
  
  non_Institutional_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("non_Institutional", non_Institutional_Schema);
  