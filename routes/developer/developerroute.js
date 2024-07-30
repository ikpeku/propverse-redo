const express = require("express");
const { get_Due_deligence } = require("../../controller/Developer/developercontroller");
const route = express.Router();


route.get("/due_deligence/:userId", get_Due_deligence)


module.exports = route;