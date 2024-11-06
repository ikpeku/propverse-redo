const express = require("express");
const { get_Due_deligence, update_Due_deligence,due_Deligence_Submit,  createDocs, docDetail, userUploadedDocs, update_Due_deligence_company_profile, due_Deligence_Draft, get_Developer_Info } = require("../../controller/Developer/developercontroller");
const { createProperty , isNew, isNotSubmmited, isOld, isSubmmited, getPropertyById, updateProperty, getUserProperties, isPropertyCurrent, isUser, updatePropertyProgress, uploadActivities, getPropertyInvestors, getPropertyInvestorbyId, getDevelopersInvestors, DeveloperDashbroad} = require("../../controller/Developer/properties");
const route = express.Router();



route.get("/dashbroad", DeveloperDashbroad);
route.get("/due_deligence/:userId", get_Due_deligence);

route.patch("/due_deligence/submit/:userId", due_Deligence_Submit, update_Due_deligence);
route.patch("/due_deligence/draft/:userId",due_Deligence_Draft, update_Due_deligence);
route.patch("/due_deligence/company_profile/:userId", update_Due_deligence_company_profile);


route.get("/doc/:docId", docDetail);
route.get("/docs/:userId", userUploadedDocs); 
route.post("/docs/:userId", createDocs);



/**
 * properties
 */

route.get("/property/:prodId/", getPropertyById);

route.get("/properties/new/:userId/",isUser, isNew, isSubmmited, getUserProperties);
route.get("/properties/old/:userId/", isUser,  isOld, isSubmmited, getUserProperties);

route.get("/properties/draft/:userId/",isUser,  isNotSubmmited, getUserProperties);
route.get("/properties/:userId/", isUser, isSubmmited, getUserProperties);

route.get("/current/properties/:userId",isUser, isSubmmited, isPropertyCurrent, getUserProperties);
route.get("/current/properties/", isSubmmited, isPropertyCurrent, getUserProperties);


route.post("/property/create/", isSubmmited, createProperty);
route.patch("/property/:prodId/", updateProperty);
route.patch("/propertyprogress/:prodId", updatePropertyProgress);


route.post("/property/draft/",  isNotSubmmited, createProperty);
route.post("/create/activity/:prodId", uploadActivities);

// investors
route.get("/propertyinvestors/:prodId", getPropertyInvestors);
route.get("/propertyinvestordetail/:txnId", getPropertyInvestorbyId);

route.get("/devinvestment", getDevelopersInvestors);

// dev info
route.get("/:userId", get_Developer_Info);

module.exports = route;