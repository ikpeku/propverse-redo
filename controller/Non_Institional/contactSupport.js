// contactSupportlMailOption

const { requestDocslMailOption, contactSupportlMailOption } = require("../../middleware/sendMail")
const User = require("../../model/user")
const { errorHandler } = require("../../utils/error")
const { mailerController } = require("../../utils/mailer")


exports.contactSupport = async(req,res,next) => {
    const {prodId} = req.params

    const {firstName, lastName, email, phone, message} = req.body
    try {

       const data = await User.find({account_type: 'Admin'})

       if(!data) {
        return next(401,"failed to return data");
       }
      
       data.forEach(user => {
           mailerController(
            contactSupportlMailOption({
            email: user.email, 
            title: "Propverse Contact Support",
             Investor_Name: `${firstName} ${" "}${lastName}`,
             message,
             phone,
             userEmail: email
            })
          );
       })



    // 

       return res.status(200).json({status:"success", data: "mail sent successfully"});
       
    } catch (error) {
        next(errorHandler(500,"failed to seent mail"))
    }

}