const mongoose = require("mongoose");
const { model , Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema(
  {

    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already in used"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    username: {
      type: String,
      required: [true, "Please add user name"],
    },
    country: {
      type: String,
      default: "",
    },
    phone_number: {
      type: String,
      default: "0X0000000",
    },
    account_type: {
      type: String,
      enum: [
        "Institutional Investor",
        "Developer",
        "Non-Institutional Investor",
        "Admin"
      ],
      default: "Non Institutional Investor",
      require: [true, "All fields are required"],
    },
    verify_account: {
      type: Boolean,
      default: false,
    },

    payout_account: {
      bank_name: {
        type: String,
        default: "",
      },
      account_name: {
        type: String,
        default: "",
      },
      account_number: {
        type: String,
        default: "",
      },
    },

    company_profile: {
      title:{
        type: String,
        default: "",
      },
      logo: {
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
      about: {
        type: String,
        default: "",
      },
      cover_image: {
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




    referral: {
      referralId: {
        type: String,
        default: "",
      },
    },

   
    kyc: {
      document_type: {
        type: String,
        default: "",
      },
      front_document_photo:   {
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
      bank_statement:   {
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

    accreditation: {
      is_accredited_investor_qualify: {
        type: Boolean,
        default: false,
      },

      verify_method: {
        type: String,
        enum: ["individual", "entity", ""],
        default: "",
      },

      isSubmitted:{
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        default: "not verified",
        enum: ["not verified", "processing", "verified"],
      },
      isVerify: {
        type: Boolean,
        default: false,
      },
      accredited_method: {
        type: String,
        default: "",
      },
      individual: {
        accredited_verify_method: {
          type: String,
          default: "",
        },
        method: {
          type: String,
          default: "",
          enum: [
            "verify_method_1",
            "verify_method_2",
            "verify_method_3",
            "verify_method_4",
            "",
          ],
        },
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
          added: Date
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
          added: Date
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
          added: Date
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
          added: Date
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
          default: "",
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
        entity_document: [
          {
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
        ],
      },
    },
   
    
  },
  {
    timestamps: true,
  }
);



// userSchema.post("find", (res, next) => {
  
// })

userSchema.plugin(mongoosePaginate);

module.exports = model("user", userSchema);
