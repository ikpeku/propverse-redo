const express = require("express");
const {
  get_Developers,
  get_Due_Deligence,
  approveDueDeligence,
  statusDueDeligence,
  rejectDueDeligence,
  approveProperty,
  rejectProperty,
  statusProperty,
  
} = require("../../controller/Admin/Developers/adminDevelopers");


const {uploadActivities, get_All_Non_Institutional, get_Suspended_All_Non_Institutional, get_Non_Institutional} = require("../../controller/Admin/Non_Institutional/non_institutional");
const { suspendUserAccount , kycVerification} = require("../../controller/Admin/GeneralAdmin");
const route = express.Router();

/**
 * Developers
 */
// due deligence
route.get("/developers/:userId", get_Developers);
route.get("/get_Due_Deligence/:userId", get_Due_Deligence);
route.patch(
  "/get_Due_Deligence/approve/:userId",
  approveDueDeligence,
  statusDueDeligence
);
route.post(
  "/get_Due_Deligence/reject/:userId",
  rejectDueDeligence,
  statusDueDeligence
);

// property
route.patch(
  "/property/approve/:prodId",
  approveProperty,
  statusProperty
);
route.post("/property/reject/:prodId", 
rejectProperty,
statusProperty);


/**
 * Non - Institutional Investor
 */

route.post("/create/activity/:prodId", uploadActivities)
route.get("/non-institutional", get_All_Non_Institutional)
route.get("/suspend/non-institutional", get_Suspended_All_Non_Institutional)
route.get("/profile/:userId", get_Non_Institutional)


/**
 * suspend user account
 */
route.post("/suspend/:userId", suspendUserAccount)

/**
 * kyv
 */
route.post("/kyc/verify/:userId", kycVerification)


module.exports = route;
