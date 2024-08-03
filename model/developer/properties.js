const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const propertiesSchema = new Schema(
  {
    _id: String,
    user: {
        type: SchemaTypes.ObjectId,
        ref: "user",
        required: true,
      },
      activities: {
        // type: SchemaTypes.ObjectId,
        type: String,
        ref: "property_activities",
        required: true,
      },

      isSubmitted: {
      type: Boolean,
      default: false,
    },

    isAdminAproved: {
        type: String,
        default: "Not Approve",
        enums: ["Not Approve", "Approved", "Rejected"]
    },
    investment_status: {
        type: String,
        default: "Pending",
        enums: ["Pending", "Completed"]
      },
    property_state: {
        type: String,
        enums: ["new", "old"]
    },

    isDetail_lock: {
        type: Boolean,
        default: false,
      },

      property_detail : {
          property_overview: {
          //   avatar: {
          //     type: [
          //       {
          //         location: String,
          //         originalname: String,
          //         mimetype: String,
          //         size: String,
          //         key: String,
          //       },
          //     ],
          //   },
            property_type: {
              type: String,
              enum: ["Residential", "Commercial", "Industrial"],
              default: "Residential",
            },
            property_name: {
              type: String,
              default: "",
            },
            unit_number: {
              type: Number,
              default: 0,
            },
            room_configuration: {
              type: Number,
              default: 0,
            },
            location: {
              type: String,
              default: "",
            },
            price: {
              amount: {
                  type: Number,
                  default: 0,
              },
              currency: {
                  type: String,
                  default: "",
                },
            },
            size: {
              type: Number,
              default: 0,
            },
            date: {
              starting_date: {
                  type: Date,
                  default: () => Date.now(),
                },
                closing_date: {
                  type: Date,
                  default: () => Date.now() + 14*24*60*60*1000,
                },
            },
            property_description:{
                description: {
                  type: String,
                  default: "",
                },
              amenities: [String],
            },
            
          },
          
          property_images: [
              {
                location: String,
                originalname: String,
                mimetype: String,
                size: String,
                key: String
              },
            ],
          
         special_facility: [{
          facility_name: {
            type: String,
            default: ""
          },
          facilty_photos: [
              {
                location: String,
                originalname: String,
                mimetype: String,
                size: String,
                key: String
              },
            ],
      
         }],
          payment_plan: [
              {
                number_of_months: {
                  type: Number,
                  default: 0,
              },
                total_amount: {
                  amount: {
                      type: Number,
                      default: 0,
                  },
                  currency: {
                      type: String,
                      default: "",
                    },
      
                },
                initial_amount:  {
                  amount: {
                      type: Number,
                      default: 0,
                  },
                  currency: {
                      type: String,
                      default: "",
                    },
      
                },
                Initial_deposit:  {
                  amount: {
                      type: Number,
                      default: 0,
                  },
                  currency: {
                      type: String,
                      default: "",
                    },
      
                },
                monthly_payment:  {
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
            ],
          property_documents: [
              {
                location: String,
                originalname: String,
                mimetype: String,
                size: String,
                key: String,
              },
            ],
          property_location: {
              country: {
                  type: String,
                  default: "",
                },
              state: {
                  type: String,
                  default: "",
                },
              city: {
                  type: String,
                  default: "",
                },
              address: {
                  type: String,
                  default: "",
                },
          },
      
          property_units: [
              {
                unit_name_or_number: String,
                price: {
                  amount: {
                      type: Number,
                      default: 0,
                  },
                  currency: {
                      type: String,
                      default: "",
                    },
                },
                size: Number,
                number_of_bedroom: Number,
                number_of_bathroom: Number,
                avatar: {
                  location: String,
                  originalname: String,
                  mimetype: String,
                  size: String,
                  key: String,
                },
              },
            ],

      }








  },
  {
    timestamps: true,
  }
);


propertiesSchema.plugin(aggregatePaginate);


module.exports =  mongoose.model("properties", propertiesSchema);


// With `sanitizeProjection`, Mongoose forces all projection values to be numbers
// doc = await UserModel.findOne().sanitizeProjection(true).select({ name: '$password' });
// doc.name; // 'John'
// doc.password; // undefined