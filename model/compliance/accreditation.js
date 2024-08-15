const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const accreditation_Schema = new Schema(
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
    status: {
      type: String,
      default: "not verified",
      enum: ["not verified", "processing", "verified", "rejected"],
    },
    verify_method: {
      type: String,
      enum: ["individual", "entity"],
      default: "individual",
    },

    accreditation: {
      is_accredited_investor_qualify: {
        type: Boolean,
        default: false,
      },

      // isVerify: {
      //   type: Boolean,
      //   default: false,
      // },
      accredited_method: {
        type: String,
        default: "Individual with net-worth of $1M+ (with or without spouse)",
        enum: [
          "Individual with net-worth of $1M+ (with or without spouse)",
          "Individual with annual income in last two years of $200K+ ($300K+ with spouse)",
          "Entity or trust not formed for the specific purpose of investing with $5M+ in assets",
          "FINRA-licensed individual in good standing with Series 7, 65 or 82",
        ],
      },

      individual: {
        accredited_verify_method: {
          type: String,
          default:
            "I possess an official letter attesting to my income or accredited status, issued by either my lawyer, CPA, or investment advisor.",
          enum: [
            "I possess an official letter attesting to my income or accredited status, issued by either my lawyer, CPA, or investment advisor.",
            "I possess a net worth exceeding $1 million.",
            "I have earned an annual income exceeding $200,000 in the past two years, and when combined with my spouse's income, it surpasses $300,000.",
            "I am a reputable professional, licensed by FINRA, with an impeccable standing. I hold valid licenses for Series 7, 82, and 65.",
          ],
        },
        // method: {
        //   type: String,
        //   default: '',
        //   enum: [
        //     'verify_method_1',
        //     'verify_method_2',
        //     'verify_method_3',
        //     'verify_method_4',
        //     '',
        //   ],
        // },
        verify_method_1: {
          letter_of_verification: {
            location: {
              type: String,
              default: "",
            },
            originalname: {
              type: String,
              default: "",
            },
            mimetype: {
              type: String,
              default: "",
            },
            size: {
              type: String,
              default: "",
            },
            key: {
              type: String,
              default: "",
            },
          },
          verifier_detail: {
            title: {
              type: String,
              default: "",
            },
            name: {
              type: String,
              default: "",
            },
            email: {
              type: String,
              default: "",
            },
          },
          added: Date,
        },
        verify_method_2: {
          networth_estimate: {
            proof1: {
              location: {
                type: String,
                default: "",
              },
              originalname: {
                type: String,
                default: "",
              },
              mimetype: {
                type: String,
                default: "",
              },
              size: {
                type: String,
                default: "",
              },
              key: {
                type: String,
                default: "",
              },
            },
            proof2: {
              location: {
                type: String,
                default: "",
              },
              originalname: {
                type: String,
                default: "",
              },
              mimetype: {
                type: String,
                default: "",
              },
              size: {
                type: String,
                default: "",
              },
              key: {
                type: String,
                default: "",
              },
            },
          },
          added: Date,
        },
        verify_method_3: {
          account_type: {
            type: String,
            default: "",
          },
          gross_income1: {
            year: {
              type: String,
              default: "",
            },
            amount: {
              type: Number,
              default: 0,
            },
          },
          gross_income2: {
            year: {
              type: String,
              default: "",
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
                default: "",
              },
              name: {
                type: String,
                default: "",
              },
              file: {
                location: {
                  type: String,
                  default: "",
                },
                originalname: {
                  type: String,
                  default: "",
                },
                mimetype: {
                  type: String,
                  default: "",
                },
                size: {
                  type: String,
                  default: "",
                },
                key: {
                  type: String,
                  default: "",
                },
              },
            },
            document2: {
              year: {
                type: String,
                default: "",
              },
              name: {
                type: String,
                default: "",
              },
              file: {
                location: {
                  type: String,
                  default: "",
                },
                originalname: {
                  type: String,
                  default: "",
                },
                mimetype: {
                  type: String,
                  default: "",
                },
                size: {
                  type: String,
                  default: "",
                },
                key: {
                  type: String,
                  default: "",
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
              default: "",
            },
            originalname: {
              type: String,
              default: "",
            },
            mimetype: {
              type: String,
              default: "",
            },
            size: {
              type: String,
              default: "",
            },
            key: {
              type: String,
              default: "",
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
          default: "LLC",
          enum: ["LLC", "Trust", "Corporation", "Partnership"],
        },
        details: {
          entity_legal_name: {
            type: String,
            default: "",
          },
          isOwner: {
            type: Boolean,
            default: false,
          },
          date: {
            day: {
              type: String,
              default: "",
            },
            month: {
              type: String,
              default: "",
            },
            year: {
              type: String,
              default: "",
            },
          },
          country: {
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
          mobile: {
            type: String,
            default: "",
          },
          social: {
            type: String,
            default: "",
          },
          tax_id: {
            type: String,
            default: "",
          },
          signatory: {
            type: Boolean,
            default: false,
          },
        },
        entity_document: Array,
        // [
        //   {
        //     location: {
        //       type: String,
        //       default: '',
        //     },
        //     originalname: {
        //       type: String,
        //       default: '',
        //     },
        //     mimetype: {
        //       type: String,
        //       default: '',
        //     },
        //     size: {
        //       type: String,
        //       default: '',
        //     },
        //     key: {
        //       type: String,
        //       default: '',
        //     },
        //   },
        // ],
      },
    },
  },
  {
    timestamps: true,
  }
);

accreditation_Schema.plugin(aggregatePaginate);

module.exports = mongoose.model("accreditation", accreditation_Schema);
