const express = require("express");
const { userRequestDocs } = require("../../controller/Non_Institional/requestDocs");
const { contactSupport } = require("../../controller/Non_Institional/contactSupport");
const { makeInvestmentOnproperty,makeInvestmentFunds, getUserInvestment ,getInvestmentById} = require("../../controller/Non_Institional/invest");
const route = express.Router();

route.post("/request-doc", userRequestDocs)
route.post("/contact-support/:prodId", contactSupport)
route.post("/property/invest/:userId", (req, res,next) =>{
    req.body.investmentType = "property"
     next()
 }, makeInvestmentOnproperty)
route.post("/fund/invest/:userId", (req, res,next) =>{
   req.body.investmentType = "funds"
    next()
},
 makeInvestmentFunds)

route.get("/invests/:userId", getUserInvestment)
route.get("/invest/:prodId", getInvestmentById)


module.exports = route;