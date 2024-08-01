const express = require("express");
const { get_Due_deligence, update_Due_deligence,due_Deligence_Submit, allRecievedDocs, allSentDocs, createDocs, docDetail } = require("../../controller/Developer/developercontroller");
const route = express.Router();


route.get("/due_deligence/:userId", get_Due_deligence)


route.patch("/due_deligence/submit/:userId", due_Deligence_Submit, update_Due_deligence)
route.patch("/due_deligence/draft/:userId", update_Due_deligence)


route.get("/doc/:docId", docDetail)
route.get("/docs/received/:userId", allRecievedDocs)
route.get("/docs/send/:userId", allSentDocs)
route.post("/docs/:userId", createDocs)


module.exports = route;
// 