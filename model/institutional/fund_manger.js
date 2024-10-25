const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const Institutional_Schema = new Schema({
    _id: {
        type: SchemaTypes.ObjectId,
        required: true,
      },
    user: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },
     transactions: [{
        type: SchemaTypes.ObjectId,
        ref: "transaction",
      }
      ],
      // properties: [{
      //   // type: SchemaTypes.ObjectId,
      //   type: String,
      //   ref: "properties",
      // }
      // ],
      // funds: [{
      //   type: SchemaTypes.ObjectId,
      //   ref: "fund",
      // }
      // ],

      limitedpartners: [{
        type: Schema.Types.ObjectId,
        ref: "transaction",
      }],
  
      funds_holdings: {
        project_investments: [{
          type: Schema.Types.ObjectId,
          ref: "properties",
        }],
        funds_investments: [{
          type: Schema.Types.ObjectId,
          ref: "fund",
        }],
  
      },
    
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
  
  
  Institutional_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("non_Institutional", Institutional_Schema);
  