const express = require("express");
const {
  userAccreditation,
  userKyc,
  getUserKyc,
  propertyInvestmentInfo,
Accreditation1,
Accreditation2,
Accreditation3,
Accreditation4,
AccreditationEntity,
AccreditationEntityDocument,
get_Transactions,
get_Transaction_by_Id,
get_UserInfo,
set_Payout,
set_User_Info,
set_User_Avatar,
get_Rerral,
delete_Transaction,
} = require("../../controller/General/user");
const { AllProperties, AllFunds, AllUsers } = require("../../controller/Admin/GeneralAdmin");

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


/**
 * transactions
 */
route.get("/transaction/:txnId", get_Transaction_by_Id);
route.delete("/transaction/:txnId", delete_Transaction);
route.get("/transactions/payin", get_Transactions);




/**
 * Account Section
 */

route.patch("/payout", set_Payout);
route.patch("/", set_User_Info);
route.patch("/avatar", set_User_Avatar);

route.get("/", get_UserInfo);
route.get("/referral", get_Rerral);

/**
 * Dashbroad
 */


/**
 * all datas
 */

 route.get("/allproperties", AllProperties);
 route.get("/allfunds", AllFunds);
 route.get("/allusers", AllUsers);

module.exports = route;
