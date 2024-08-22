const express = require("express");
const {
  userAccreditation,
  userKyc,
  getUserKyc,
  propertyInvestmentInfo,
  fundInvestmentInfo,

Accreditation1,
Accreditation2,
Accreditation3,
Accreditation4,
AccreditationEntity,
AccreditationEntityDocument
} = require("../../controller/General/user");

const route = express.Router();

route.post("/kyc/", userKyc);
route.get("/kyc/", getUserKyc);
route.post("/institutional/kyc/", userKyc);
route.post("/accreditation/1", Accreditation1);
route.post("/accreditation/2", Accreditation2);
route.post("/accreditation/3", Accreditation3);
route.post("/accreditation/4", Accreditation4);
route.post("/entity/accreditation", AccreditationEntity);
route.post("/documents/accreditation", AccreditationEntityDocument);

route.get("/accreditation/", userAccreditation);

/**
 * property
 */
route.get("/property/:prodId", propertyInvestmentInfo);
route.get("/fund/:prodId", propertyInvestmentInfo);

module.exports = route;
