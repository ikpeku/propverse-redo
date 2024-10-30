const express = require('express');
const {
  createFund,
  getAllFunds,
  getSingleFund,
  fundtransationdatail,
  submitFund,
  draftFund,
  AllApprovedFunds,
  AllUserSubmitFunds,
  AllUserDraftFunds,
  getHoldingsFunds,
  getHoldingsProject,
  getFundOverview,
  getFundPortfolio,
} = require('../../controller/institutional/fund');

const {
  checkInstitutionalUser,
} = require('../../middleware/users/institutional');
const { fundPurposeInquiry } = require('../../controller/institutional/primaryContactDetails');
const { capitalcommitted, getLimitedPartners } = require('../../controller/General/user');
const route = express.Router();

route.post('/fund/submit/:fundId', checkInstitutionalUser, submitFund, createFund);
route.post('/fund/draft/:fundId', checkInstitutionalUser, draftFund, createFund);

route.post('/fund-inquiry', checkInstitutionalUser, fundPurposeInquiry);

route.get('/funds', AllApprovedFunds, getAllFunds);

route.get('/draft/funds', AllUserDraftFunds, getAllFunds);
route.get('/submit/funds', AllUserSubmitFunds, getAllFunds);


route.get('/fund/:id', getSingleFund);
route.get('/fundtransationdatail/:fundId', fundtransationdatail);
route.get('/capitalcommitted/:fundId/:userId', capitalcommitted);
route.get('/limitedpartners/:fundId', getLimitedPartners);
route.get('/fundholding/project/:fundId', getHoldingsProject);
route.get('/fundholding/funds/:fundId', getHoldingsFunds);
route.get('/fundoverview/:fundId', getFundOverview);
route.get('/fundportfolio/:fundId', getFundPortfolio);

module.exports = route;
