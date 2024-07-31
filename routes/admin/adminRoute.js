const express = require("express");
const { get_Developers , get_Due_Deligence, approveDueDeligence, statusDueDeligence, rejectDueDeligence} = require("../../controller/Admin/Developers/adminDevelopers");
const route = express.Router();


/**
 * Developers
 */

route.get("/developers/:userId", get_Developers)
route.get("/get_Due_Deligence/:userId", get_Due_Deligence)
route.patch("/get_Due_Deligence/approve/:userId", approveDueDeligence, statusDueDeligence)
route.post("/get_Due_Deligence/reject/:userId", rejectDueDeligence, statusDueDeligence)



module.exports = route;