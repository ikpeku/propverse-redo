
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");


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
  