const express = require("express");
const { userRequestDocs } = require("../../controller/Non_Institional/requestDocs");
const { contactSupport } = require("../../controller/Non_Institional/contactSupport");
const { 
     getUserInvestment ,getInvestmentById,
     dashbroad_Non_Institutional_FundChart,
     dashbroad_Non_Institutional} = require("../../controller/Non_Institional/invest");
const route = express.Router();

route.post("/request-doc", userRequestDocs)
route.post("/contact-support/:prodId", contactSupport)

route.get("/invests/:userId", getUserInvestment)
route.get("/invest/:prodId", getInvestmentById)
route.get("/dashboardchart", dashbroad_Non_Institutional_FundChart)
route.get("/dashbroad", dashbroad_Non_Institutional)


module.exports = route;