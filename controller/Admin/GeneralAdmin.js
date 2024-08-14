
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");
const Kyc = require("../../model/compliance/kyc");
const Compliance = require("../../model/compliance/accreditation");


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
    const {rejectreason} = req.body
  
    try {
     const response = await Kyc.findById(userId);

     if(!response) {
      return next(errorHandler(401,"user not found"))
    }
  
     response.isApproved = !response.isApproved
     response.save()

     res.status(200).json({
        message: "success",
        response: response.isApproved
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  
exports.complianceVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason} = req.body
    
    try {
      const response = await Compliance.findById(userId);

      if(!response) {
        return next(errorHandler(401,"user not found"))
      }
      
     response.isApproved = !response.isApproved
     response.status =  response.status == 'not verified' ? "verified" : "not verified",
     response.save()
    
     res.status(200).json({
        message: "success",
        response:response.isApproved
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  