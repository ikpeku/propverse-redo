const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const developer_due_deligence_Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
     isAdminAproved: {
      type: String,
      default: "Non Verified",
      enums: ["Non Verified", "Verified", "Rejected"]
    },
    isSubmited: {
        type: Boolean,
        default: false,
      },

  company_information: {
    name: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      phone_number: {
        type: String,
        default: "",
      }
  },
 
    projects : {
        previous_project_1: {
            name: {
              type: String,
              default: "",
            },
            location: {
              type: String,
              default: "",
            },
            type: {
              type: String,
              default: "",
            },
            cost: {
                amount: {
                    type: String,
                    default: "",
                },
                currency: {
                    type: String,
                    default: "",
                  },
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
            // partner: partnerSchema
            project_partners: {
              partner_1: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
                partner_2: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
            }
           
          },
          previous_project_2: {
            name: {
              type: String,
              default: "",
            },
            location: {
              type: String,
              default: "",
            },
            type: {
              type: String,
              default: "",
            },
            cost: {
                amount: {
                    type: String,
                    default: "",
                },
                currency: {
                    type: String,
                    default: "",
                  },
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
            // partner: partnerSchema
            project_partners: {
              partner_1: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
                partner_2: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
            }
           
          },
          previous_project_3: {
            name: {
              type: String,
              default: "",
            },
            location: {
              type: String,
              default: "",
            },
            type: {
              type: String,
              default: "",
            },
            cost: {
                amount: {
                    type: String,
                    default: "",
                },
                currency: {
                    type: String,
                    default: "",
                  },
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
            // partner: partnerSchema
            project_partners: {
              partner_1: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
                partner_2: {
                  name: {
                    type: String,
                    default: "",
                  },
                  contact: {
                    type: String,
                    default: "",
                  },
                },
            }
           
          },
    },

    financials: {
      Current_Company_Valuation: {
        amount: {
            type: String,
        default: "",
        },
        currency: {
            type: String,
            default: "",
          },
      },
      
      Valuation_Method_Used: {
        type: String,
        default: "",
      },
      Last_Financial_Audit_Date: {
        type: Date,
        default: "",
      },
      supporting_documents: [
        {
          location: String,
          originalname: String,
          mimetype: String,
          size: String,
          key: String,
        },
      ],
    },

    references_and_recognition: {
      recognition: {
        type: String,
        default: "",
      },

      recognition_documents: [
        {
          location: String,
          originalname: String,
          mimetype: String,
          size: String,
          key: String,
        },
      ],

      reference_1: {
        name: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        contact: {
          type: String,
          default: "",
        },
      },
      reference_2: {
        name: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        contact: {
          type: String,
          default: "",
        },
      },
      reference_3: {
        name: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        contact: {
          type: String,
          default: "",
        },
      },
    },

    declaration: {
      name: {
        type: String,
        default: "",
      },
      title: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);


developer_due_deligence_Schema.plugin(aggregatePaginate);

module.exports = mongoose.model("due_deligence", developer_due_deligence_Schema);




 