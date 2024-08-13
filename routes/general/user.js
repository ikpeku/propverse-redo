const express = require("express");
const { errorHandler } = require("../../utils/error");
const { userAccreditation , userKyc, getUserKyc} = require("../../controller/General/user");


const route = express.Router();

route.post("/kyc/", userKyc)
route.get("/kyc/", getUserKyc)
route.post("/institutional/kyc/", userKyc)
route.post("/accreditation/", userAccreditation)
route.get("/accreditation/", userAccreditation)



module.exports = route