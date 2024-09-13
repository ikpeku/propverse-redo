const express = require('express');
const {
  createFund,
  getAllFunds,
  getSingleFund,
  fundtransationdatail,
  submitFund,
  draftFund,
} = require('../../controller/institutional/fund');

const {
  checkInstitutionalUser,
} = require('../../middleware/users/institutional');
const { fundPurposeInquiry } = require('../../controller/institutional/primaryContactDetails');
const route = express.Router();

route.post('/fund/submit/:fundId', checkInstitutionalUser, submitFund, createFund);
route.post('/fund/draft/:fundId', checkInstitutionalUser, draftFund, createFund);

route.post('/fund-inquiry', checkInstitutionalUser, fundPurposeInquiry);

route.get('/funds', getAllFunds);
route.get('/fund/:id', getSingleFund);
route.get('/fundtransationdatail/:fundId', fundtransationdatail);

module.exports = route;
