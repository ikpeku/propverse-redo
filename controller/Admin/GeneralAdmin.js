
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");
const Kyc = require("../../model/compliance/kyc");
const TransactionsPayIn = require("../../model/transaction/transactions")
const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
const Property = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");



const Compliance = require("../../model/compliance/accreditation");
const { mailerController } = require("../../utils/mailer");
const { GeneralMailOption } = require("../../middleware/sendMail");


exports.suspendUserAccount = async(req,res,next) => {
    const {userId} = req.params
  
    try {
     const response = await User.findById(userId);
  
     response.isSuspended = !response.isSuspended
     response.save()

     res.status(200).json({
        message: "success"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }

  
exports.kycVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason, isRejected} = req.body
  
    try {
     const response = await Kyc.findById(userId).populate("user");

     if(!response) {
      return next(errorHandler(401,"user not found"))
    }
  
    if(isRejected) {
      response.isApproved = false
    } else {
      response.isApproved = true
    }

     response.save()


     if(isRejected) {
      mailerController(
        GeneralMailOption({
          email: response?.user?.email,
          text: rejectreason,
          title: "Propsverse Kyc Rejection",
        })
      );
  
    }

     res.status(200).json({
        message: "success",
        data: isRejected ? "kyc rejected successfully" : "kyv approved successfully"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  
exports.complianceVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason,isRejected} = req.body
    
    try {
      const response = await Compliance.findById(userId).populate("user");

      if(!response) {
        return next(errorHandler(401,"user not found"))
      }
  

  await Compliance.findByIdAndUpdate(userId, {$set: {status: isRejected ? "rejected" : "verified" }})


  if(isRejected) {
    mailerController(
      GeneralMailOption({
        email: response?.user?.email,
        text: rejectreason,
        title: "Propsverse compliance Rejection",
      })
    );

  }

     res.status(200).json({
        message: "success",
        data: isRejected ? "compliance rejected successfully" : "compliance approved successfully",
     })
      
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  


exports.VerifyPayIn = async(req,res,next) => {
    const {txnId, type} = req.params;
    const {rejectreason} = req.body;
  
  
    try {
     const response = await TransactionsPayIn.findById(txnId).populate("investor");

     if(!response) {
      return next(errorHandler(401,"invalid transaction"))
    }

  
     response.isVerify = true

     if(type === "reject"){
      response.status = "Failed"
      if(response.transaction_type == "property purchase"){
         
        await Non_Institutional_Investor.findByIdAndUpdate(
         response.investor,
         { $pull: { transactions: response._id, properties: response.property } },
         { new: true, useFindAndModify: false }
       );
     
       await Property.findByIdAndUpdate(
       response.property,
         { $push: { transactions: response._id } },
         { new: true, useFindAndModify: false }
       );

      }
      if(response.transaction_type == "funds"){
       await Non_Institutional_Investor.findByIdAndUpdate(
         response.investor,
         { $pull: { transactions: response._id, funds: response.funds } },
         { new: true, useFindAndModify: false }
       );
       
       await Funds.findByIdAndUpdate(
         response.funds,
         { $pull: { investments: response._id } },
         { new: true, useFindAndModify: false }
       );

      }


      mailerController(
        GeneralMailOption({
          email: response?.investor?.email,
          text: rejectreason,
          title: "Propsverse transaction Rejection",
        })
      );
     } 
     
     if(type === "approve") {
         response.status = "Success"

         if(response.transaction_type == "property purchase"){
         
           await Non_Institutional_Investor.findByIdAndUpdate(
            response.investor,
            { $push: { transactions: response._id, properties: response.property } },
            { new: true, useFindAndModify: false }
          );
        
          await Property.findByIdAndUpdate(
          response.property,
            { $push: { transactions: response._id } },
            { new: true, useFindAndModify: false }
          );

         }
         if(response.transaction_type == "funds"){
          await Non_Institutional_Investor.findByIdAndUpdate(
            response.investor,
            { $push: { transactions: response._id, funds: response.funds } },
            { new: true, useFindAndModify: false }
          );
          
          await Funds.findByIdAndUpdate(
            response.funds,
            { $push: { investments: response._id } },
            { new: true, useFindAndModify: false }
          );

         }

      


     }

     response.save()
  

     res.status(200).json({
        message: type !== "approve" ? "Rejected successfully" : "Approved successfully"
     })
      
    } catch (error) {
      next(errorHandler(500, "operation failed"));   
    }
  
  }



  