const mongoose = require("mongoose");
const { model , Schema} = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { SchemaTypes } = require("mongoose");

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    email: {
      type: String,
      required: [true, 'Please add the user email address'],
      unique: [true, 'Email address already in used'],
    },
    password: {
      type: String,
      required: [true, 'Please add the user password'],
    },
    username: {
      type: String,
      required: [true, 'Please add user name'],
    },
    country: {
      type: String,
      default: '',
    },
    phone_number: {
      type: String,
      default: '0X0000000',
    },
    account_type: {
      type: String,
      enum: [
        'Institutional Investor',
        'Developer',
        'Non-Institutional Investor',
        'Admin',
      ],
      default: 'Non Institutional Investor',
      require: [true, 'All fields are required'],
    },
    verify_account: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },

    payout_account: {
      bank_name: {
        type: String,
        default: '',
      },
      account_name: {
        type: String,
        default: '',
      },
      account_number: {
        type: String,
        default: '',
      },
    },

    company_profile: {
      title: {
        type: String,
        default: '',
      },
      logo: {
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
      about: {
        type: String,
        default: '',
      },
      cover_image: {
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


    referral: {
      referralId: {
        type: String,
        default: '',
      },
    },

    // compliance: {
  
     

    // }




  },
  {
    timestamps: true,
  }
);

// userSchema.post("find", (res, next) => {

// })

userSchema.plugin(aggregatePaginate);

module.exports = model('user', userSchema);
