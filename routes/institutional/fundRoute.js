const express = require('express');
const {
  createFund,
  getAllFunds,
  getSingleFund,
} = require('../../controller/institutional/fund');
const { getCurrentUser } = require('../../utils/bearerToken');
const {
  checkInstitutionalUser,
} = require('../../middleware/users/institutional');
const { fundPurposeInquiry } = require('../../controller/institutional/user');
const route = express.Router();

route.post('/fund', getCurrentUser, checkInstitutionalUser, createFund);
route.post('/fund-inquiry', getCurrentUser, checkInstitutionalUser, fundPurposeInquiry);

route.get('/funds', getAllFunds);
route.get('/fund/:id', getSingleFund);

module.exports = route;
