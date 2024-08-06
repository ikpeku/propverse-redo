
const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const non_institutional_accreditation_Schema = new Schema(
  {
    _id: String,
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    accreditation: {
        is_accredited_investor_qualify: {
          type: Boolean,
          default: false,
        },
  
        verify_method: {
          type: String,
          enum: ['individual', 'entity', ''],
          default: '',
        },
  
        isSubmitted: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          default: 'not verified',
          enum: ['not verified', 'processing', 'verified'],
        },
        isVerify: {
          type: Boolean,
          default: false,
        },
        accredited_method: {
          type: String,
          default: '',
        },
        individual: {
          accredited_verify_method: {
            type: String,
            default: '',
          },
          method: {
            type: String,
            default: '',
            enum: [
              'verify_method_1',
              'verify_method_2',
              'verify_method_3',
              'verify_method_4',
              '',
            ],
          },
          verify_method_1: {
            letter_of_verification: {
              location: {
                type: String,
                default: '',
              },
              originalname: {
                type: String,
                default: '',
              },
              mimetype: {
                type: String,
                default: '',
              },
              size: {
                type: String,
                default: '',
              },
              key: {
                type: String,
                default: '',
              },
            },
            verifier_detail: {
              title: {
                type: String,
                default: '',
              },
              name: {
                type: String,
                default: '',
              },
              email: {
                type: String,
                default: '',
              },
            },
            added: Date,
          },
          verify_method_2: {
            networth_estimate: {
              proof1: {
                location: {
                  type: String,
                  default: '',
                },
                originalname: {
                  type: String,
                  default: '',
                },
                mimetype: {
                  type: String,
                  default: '',
                },
                size: {
                  type: String,
                  default: '',
                },
                key: {
                  type: String,
                  default: '',
                },
              },
              proof2: {
                location: {
                  type: String,
                  default: '',
                },
                originalname: {
                  type: String,
                  default: '',
                },
                mimetype: {
                  type: String,
                  default: '',
                },
                size: {
                  type: String,
                  default: '',
                },
                key: {
                  type: String,
                  default: '',
                },
              },
            },
            added: Date,
          },
          verify_method_3: {
            account_type: {
              type: String,
              default: '',
            },
            gross_income1: {
              year: {
                type: String,
                default: '',
              },
              amount: {
                type: Number,
                default: 0,
              },
            },
            gross_income2: {
              year: {
                type: String,
                default: '',
              },
              amount: {
                type: Number,
                default: 0,
              },
            },
            proof_of_income: {
              document1: {
                year: {
                  type: String,
                  default: '',
                },
                name: {
                  type: String,
                  default: '',
                },
                file: {
                  location: {
                    type: String,
                    default: '',
                  },
                  originalname: {
                    type: String,
                    default: '',
                  },
                  mimetype: {
                    type: String,
                    default: '',
                  },
                  size: {
                    type: String,
                    default: '',
                  },
                  key: {
                    type: String,
                    default: '',
                  },
                },
              },
              document2: {
                year: {
                  type: String,
                  default: '',
                },
                name: {
                  type: String,
                  default: '',
                },
                file: {
                  location: {
                    type: String,
                    default: '',
                  },
                  originalname: {
                    type: String,
                    default: '',
                  },
                  mimetype: {
                    type: String,
                    default: '',
                  },
                  size: {
                    type: String,
                    default: '',
                  },
                  key: {
                    type: String,
                    default: '',
                  },
                },
              },
            },
            added: Date,
          },
  
          verify_method_4: {
            proof_of_finra_lincence: {
              location: {
                type: String,
                default: '',
              },
              originalname: {
                type: String,
                default: '',
              },
              mimetype: {
                type: String,
                default: '',
              },
              size: {
                type: String,
                default: '',
              },
              key: {
                type: String,
                default: '',
              },
            },
            added: Date,
          },
        },
        isDocumentSubmitted: {
          type: Boolean,
          default: false,
        },
  
        entity: {
          added: Date,
          investment_entity: {
            type: String,
            default: '',
          },
          details: {
            entity_legal_name: {
              type: String,
              default: '',
            },
            isOwner: {
              type: Boolean,
              default: false,
            },
            date: {
              day: {
                type: String,
                default: '',
              },
              month: {
                type: String,
                default: '',
              },
              year: {
                type: String,
                default: '',
              },
            },
            country: {
              type: String,
              default: '',
            },
            city: {
              type: String,
              default: '',
            },
            address: {
              type: String,
              default: '',
            },
            mobile: {
              type: String,
              default: '',
            },
            social: {
              type: String,
              default: '',
            },
            tax_id: {
              type: String,
              default: '',
            },
            signatory: {
              type: Boolean,
              default: false,
            },
          },
          entity_document: [
            {
              location: {
                type: String,
                default: '',
              },
              originalname: {
                type: String,
                default: '',
              },
              mimetype: {
                type: String,
                default: '',
              },
              size: {
                type: String,
                default: '',
              },
              key: {
                type: String,
                default: '',
              },
            },
          ],
        },
      },
   
  },
  {
    timestamps: true,
  }
);
  
  
  non_institutional_accreditation_Schema.plugin(aggregatePaginate);
  
  module.exports = mongoose.model("non_institutional_accreditation", non_institutional_accreditation_Schema);
  