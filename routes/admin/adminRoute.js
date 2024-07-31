const express = require("express");
const { get_Developers } = require("../../controller/Admin/Developers/adminDevelopers");
const route = express.Router();


/**
 * Developers
 */

route.get("/developers/:userId", get_Developers)



module.exports = route;