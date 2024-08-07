const mongoose = require('mongoose');
const { Schema } = mongoose;

const institutionalUserSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  company_affiliation: { type: String, default: '' },

  linkedin: { type: String, default: '' },

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
    enum: ['yes', 'no'],
    default: 'nes',
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
  isAccountComplete: {
    type: Boolean,
    default: false,
  },
});

const InstitutionalUser = mongoose.model(
  'InstitutionalUser',
  institutionalUserSchema
);

module.exports = InstitutionalUser;
