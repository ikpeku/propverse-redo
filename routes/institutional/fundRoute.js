const express = require('express');
const {
  createFund,
  getAllFunds,
  getSingleFund,
} = require('../../controller/institutional/fund');
const {
  authInstitutionalUser,
} = require('../../middleware/users/institutional');
const { getLoggedInUser } = require('../../utils/bearerToken');
const route = express.Router();

route.post('/fund', createFund);
route.get('/funds', getAllFunds);
route.get('/fund/:id', getSingleFund);

module.exports = route;
