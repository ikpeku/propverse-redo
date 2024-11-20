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
  fundHoldingFunds,
  userHoldingFunds,
  AllUserFunds,
  userIvestmentFundById,
  userIvestmentFundById_graph,
  institionalDashbroad,
} = require('../../controller/institutional/fund');

const {
  checkInstitutionalUser,
} = require('../../middleware/users/institutional');
const { fundPurposeInquiry } = require('../../controller/institutional/primaryContactDetails');
const { capitalcommitted, getLimitedPartners, getLimitedPartnerById } = require('../../controller/General/user');
const route = express.Router();

route.get('/dashbroad', 
  // checkInstitutionalUser, 
  institionalDashbroad);


route.post('/fund/submit/:fundId', checkInstitutionalUser, submitFund, createFund);
route.post('/fund/draft/:fundId', checkInstitutionalUser, draftFund, createFund);

route.post('/fund-inquiry', checkInstitutionalUser, fundPurposeInquiry);

route.get('/funds', AllApprovedFunds, getAllFunds);
route.get('/userfunds', AllUserFunds, getAllFunds);

route.get('/draft/funds', AllUserDraftFunds, getAllFunds);
route.get('/submit/funds', AllUserSubmitFunds, getAllFunds);


route.get('/fund/:id', getSingleFund);
route.get('/fundtransationdatail/:fundId', fundtransationdatail);
route.get('/capitalcommitted/:fundId/:userId', capitalcommitted);
route.get('/limitedpartners/:fundId', getLimitedPartners);
route.get('/partner/:partnerId', getLimitedPartnerById); //limited_partner_by_id
route.get('/fundholding/project/:fundId', getHoldingsProject);
route.get('/fundholding/funds', userHoldingFunds, getHoldingsFunds);
route.get('/fundholding/funds/:fundId',fundHoldingFunds, getHoldingsFunds);
route.get('/fundoverview/:fundId', getFundOverview);
route.get('/fundportfolio/:fundId', getFundPortfolio);
route.get('/investedfund/:partnerId', userIvestmentFundById);
route.get('/investedfundchart/:partnerId', userIvestmentFundById_graph);

module.exports = route;
