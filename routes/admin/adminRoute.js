const express = require("express");
const { get_Developers , get_Due_Deligence} = require("../../controller/Admin/Developers/adminDevelopers");
const route = express.Router();


/**
 * Developers
 */

route.get("/developers/:userId", get_Developers)
route.get("/get_Due_Deligence/:userId", get_Due_Deligence)



module.exports = route;