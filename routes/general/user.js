const express = require("express");
const { errorHandler } = require("../../utils/error");
const { userAccreditation , userKyc} = require("../../controller/General/user");


const route = express.Router();

route.post("/accreditation/", userAccreditation)
route.post("/kyc/", userKyc)



module.exports = route