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
  get_Current_Listed_Properties,
  propertyInvestmentState,
  not_sold,
  sold
  
} = require("../../controller/Admin/Developers/adminDevelopers");


const { get_All_Non_Institutional, get_Suspended_All_Non_Institutional, get_Non_Institutional, uploadPropertyDoc, get_All_Non_Institutional_Compliance, get_user_Compliance, get_All_Funds_Investors} = require("../../controller/Admin/Non_Institutional/non_institutional");
const { suspendUserAccount , kycVerification, complianceVerification, VerifyPayIn, AdminDashbroad} = require("../../controller/Admin/GeneralAdmin");
const { FundsManagement ,currentListed, fundsListedApproval, statusFund, approveFund, rejectFund, pauseFund, unPauseFund} = require("../../controller/Admin/Institutional/funds");
const { get_All_Institutional, get_Institutional } = require("../../controller/Admin/Institutional/institutional");
const { uploadActivities } = require("../../controller/Developer/properties");
const { create_Property_Transactions, create_Funds_Transactions, update_Transactions } = require("../../controller/General/user");
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

route.patch(
  "/property/sold/:prodId",
  sold,
  propertyInvestmentState
);
route.patch(
  "/property/not_sold/:prodId",
  not_sold,
  propertyInvestmentState
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


route.patch("/transaction/:type/:txnId", VerifyPayIn)


// institional investor
/**
 * funds
 */
route.get("/funds/unlimited", get_All_Funds_Investors)

route.get("/institutional/approval",fundsListedApproval, FundsManagement)
route.get("/institutional/currentlisted",currentListed, FundsManagement)

route.get("/institutional/managers", get_All_Institutional)
route.get("/institutional/manager/:userId", get_Institutional)

route.patch("/fund/pause/:fundId", 
  pauseFund,
  statusFund);

route.patch(
    "/fund/resume/:fundId",
    unPauseFund,
    statusFund
);

route.patch("/fund/reject/:fundId", 
  rejectFund,
  pauseFund,
  statusFund);

route.patch(
    "/fund/approve/:fundId",
    approveFund,
    statusFund
);


/**
 * Dashbroad
 */
route.get("/dashbroad", AdminDashbroad)

/**
 * transaction
 */
route.post("/payintransaction/property", create_Property_Transactions);
route.post("/payintransaction/funds", create_Funds_Transactions);
route.get("/capitalcommitted/", create_Funds_Transactions);
route.patch("/updatetransaction/:txnId", update_Transactions);


module.exports = route;
