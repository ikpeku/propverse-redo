const express = require("express");
const { errorHandler } = require("../../utils/error");
const { userAccreditation , userKyc, getUserKyc} = require("../../controller/General/user");


const route = express.Router();

route.post("/accreditation/", userAccreditation)
route.post("/kyc/", userKyc)
route.get("/kyc/", getUserKyc)
route.post("/institutional/kyc/", userKyc)



module.exports = route