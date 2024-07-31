const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const fundSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: [true, 'Please enter the name of the fund'],
    },

    description: {
      type: String,
      required: [true, 'Please enter the name of the fund'],
    },

    thumbnails: {
      type: Array,
      items: {
        type: Object,
        properties: {
          location: {
            type: String,
            default: '',
            // required: true,
          },
          originalname: {
            type: String,
            default: '',
            // required: true,
          },
          mimetype: {
            type: String,
            default: '',
            // required: true,
          },
          size: {
            type: String,
            default: '',
            // required: true,
          },
          key: {
            type: String,
            default: '',
            // required: true,
          },
        },
      },
    },

    property_type: {
      type: [String],
      enum: ['residential', 'industrial', 'commercial'],
      default: [],
      require: [true, 'Select at least one property type'],
    },

    investment_structure: {
      type: String,
      enum: ['opportunistic', 'reit'],
      default: 'opportunistic',
      required: [true, 'Select Investment structure'],
    },

    location: {
      type: String,
      default: 'enter location',
      required: true,
    },

    raise_goal: {
      type: Number,
      required: true,
    },

    minimum_investment: {
      type: Number,
      required: true,
    },

    mininmum_hold_period: {
      type: Number,
      enum: [2, 3],
      default: 1,
      require: [true, 'Select Mininmum Hold Period'],
    },

    distribution_period: {
      type: String,
      enum: ['Annually', 'Bi-Annually'],
      default: 'Annually',
      require: [true, 'Select Distribution'],
    },

    number_of_investors: {
      type: Number,
      required: true,
    },

    loan_to_cost: {
      type: Number,
      required: true,
    },

    annual_yield: {
      type: Number,
      required: true,
    },

    deadline: {
      type: String,
      required: true,
    },

    // Fund Pitch

    pitch_deck_desc: {
      type: String,
    },

    pitch_deck_image: {
      type: Array,
      items: {
        type: Object,
        properties: {
          location: {
            type: String,
            default: '',
            // required: true,
          },
          originalname: {
            type: String,
            default: '',
            // required: true,
          },
          mimetype: {
            type: String,
            default: '',
            // required: true,
          },
          size: {
            type: String,
            default: '',
            // required: true,
          },
          key: {
            type: String,
            default: '',
            // required: true,
          },
        },
      },
    },

    name_of_current_fund_investment: {
      type: String,
      required: true,
    },

    key_fund_highlights: {
      type: [String],
      default: [],
      required: true,
    },

    investment_strategy: {
      type: [String],
      default: [],
      required: true,
    },

    //   FUNDS TERMS
    fund_terms: {
      type: [String],
      default: [],
      required: true,
    },

    primary_target_market: {
      type: [String],
      default: [],
      required: true,
    },

    distribution_and_fees: {
      type: [String],
      default: [],
      required: true,
    },

    closing: {
      type: String,
      required: true,
    },

    reporting: {
      type: [String],
      default: [],
      required: true,
    },

    // Fund Investment Team

    team_members: {
      type: Array,
      items: {
        type: Object,
        properties: {
          name_of_team_member: {
            type: String,
            required: true,
          },
          position_of_team_member: {
            type: String,
            required: true,
          },
          image_of_team_member: {
            type: Object,
            properties: {
              location: {
                type: String,
                default: '',
                // required: true,
              },
              originalname: {
                type: String,
                default: '',
                // required: true,
              },
              mimetype: {
                type: String,
                default: '',
                // required: true,
              },
              size: {
                type: String,
                default: '',
                // required: true,
              },
              key: {
                type: String,
                default: '',
                // required: true,
              },
            },
          },
        },
      },
    },

    funds_documents: {
      type: Array,
      items: {
        type: Object,
        properties: {
          location: {
            type: String,
            default: '',
            // required: true,
          },
          originalname: {
            type: String,
            default: '',
            // required: true,
          },
          mimetype: {
            type: String,
            default: '',
            // required: true,
          },
          size: {
            type: String,
            default: '',
            // required: true,
          },
          key: {
            type: String,
            default: '',
            // required: true,
          },
        },
      },
    },

    lock_fund: {
      type: Boolean,
      default: false,
    },

    shareable_link: {
      type: String,
      default: '',
    },
  },

  {
    timestamps: true,
  }
);

fundSchema.post('find', function (docs, next) {
  console.log(`${docs.length} funds were found`);
  next();
});

module.exports = model('fund', fundSchema);