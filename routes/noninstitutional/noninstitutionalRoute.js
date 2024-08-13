const express = require("express");
const { userRequestDocs } = require("../../controller/Non_Institional/requestDocs");
const { contactSupport } = require("../../controller/Non_Institional/contactSupport");
const { makeInvestmentOnproperty,makeInvestmentFunds, getUserInvestment ,getInvestmentById} = require("../../controller/Non_Institional/invest");
const route = express.Router();

route.post("/request-doc", userRequestDocs)
route.post("/contact-support", contactSupport)
route.post("/property/invest/:userId", makeInvestmentOnproperty)
route.post("/fund/invest/:userId", makeInvestmentFunds)

route.get("/invests/:userId", getUserInvestment)
route.get("/invest/:prodId", getInvestmentById)


module.exports = route;