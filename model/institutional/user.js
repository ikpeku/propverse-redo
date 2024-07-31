const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../user');

const institutionalUserSchema = new Schema({
  funds: [{ type: Schema.Types.ObjectId, ref: 'Fund' }],

  fund_purpose_inquiry: {
    type: String,
    enum: [
      'Launching a new real estate fund',
      'Transitioning an existing fund',
      'Seeking funding for a venture',
    ],
    default: '',
  },

  investor_accreditation_status: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'Yes',
  },

  location_of_investment_region: { type: String, default: '' },

  capital_already_secured: {
    type: String,
    enum: [
      'A. Under $500k',
      'B. $500k - $1.5M',
      'C. $1.6M - $5M',
      'D. $6M - $10M',
      'E. More than $10M',
      'F. None, I want to meet LP through Propversere',
    ],
    default: 'A. Under $500k',
  },
});

const InstitutionalUser = User.discriminator(
  'InstitutionalUser',
  institutionalUserSchema
);

module.exports = InstitutionalUser;
