const express = require("express");
const { userAccreditation , userKyc, getUserKyc, propertyInvestmentInfo, fundInvestmentInfo, userUpdateAccreditation} = require("../../controller/General/user");


const route = express.Router();

route.post("/kyc/", userKyc)
route.get("/kyc/", getUserKyc)
route.post("/institutional/kyc/", userKyc)
route.post("/accreditation/", userUpdateAccreditation)
route.get("/accreditation/", userAccreditation)

/**
 * property
 */
route.get("/property/:prodId", propertyInvestmentInfo)
route.get("/fund/:prodId", propertyInvestmentInfo)

module.exports = route