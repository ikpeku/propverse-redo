
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");
const Kyc = require("../../model/compliance/kyc");

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
  


  