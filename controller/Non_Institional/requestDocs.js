const { requestDocslMailOption } = require("../../middleware/sendMail")
const properties = require("../../model/developer/properties")
const { errorHandler } = require("../../utils/error")
const { mailerController } = require("../../utils/mailer")


exports.userRequestDocs = async(req,res,next) => {

    const {firstName, lastName, email, phone, prodId} = req.body
    try {
        
       const data = await properties.findById(prodId).populate("user")

       if(!data) {
        return next(401,"failed to return data");
       }

           mailerController(
            requestDocslMailOption({
            email: data.user.email, 
            title: "Propverse Property Document Request",
             Developer_Name: data.user.username,
             Investor_Name: `${firstName} ${" "}${lastName}`,
             Property_Name: data.property_detail.property_overview.property_name,
             phone,
             userEmail: email
            })
          );

       return res.status(200).json({status:"success", data: "mail sent successfully"});

    } catch (error) {
        next(errorHandler("mail sending failed"))
    }

}