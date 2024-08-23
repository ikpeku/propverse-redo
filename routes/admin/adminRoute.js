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
  get_Properties,
  get_Current_Listed_Properties
  
} = require("../../controller/Admin/Developers/adminDevelopers");


const {uploadActivities, get_All_Non_Institutional, get_Suspended_All_Non_Institutional, get_Non_Institutional, uploadPropertyDoc, get_All_Non_Institutional_Compliance, get_user_Compliance} = require("../../controller/Admin/Non_Institutional/non_institutional");
const { suspendUserAccount , kycVerification, complianceVerification, get_Transactions} = require("../../controller/Admin/GeneralAdmin");
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

route.get("/properties", get_Properties)
route.get("/current-list", get_Current_Listed_Properties)

route.post("/property/update/doc/:prodId", uploadPropertyDoc)
/**
 * Non - Institutional Investor
 */

route.post("/create/activity/:prodId", uploadActivities)
route.get("/non-institutional", get_All_Non_Institutional)
route.get("/suspend/non-institutional", get_Suspended_All_Non_Institutional)
route.get("/profile/:userId", get_Non_Institutional)
route.get("/compliance", get_All_Non_Institutional_Compliance)

route.get("/compliance/:userId", get_user_Compliance)


/**
 * suspend user account
 */
route.post("/suspend/:userId", suspendUserAccount)

/**
 * kyv
 */
route.patch("/kyc/approve/:userId", kycVerification)
route.patch("/kyc/reject/:userId", (req,res,next) => {
  req.body.isRejected = true;
  next()

}, kycVerification)

route.patch("/compliance/approve/:userId", complianceVerification)
route.patch("/compliance/reject/:userId", (req,res,next) => {
  req.body.isRejected = true;
  next()

},complianceVerification)



route.get("/transactions/payin", get_Transactions)


module.exports = route;
