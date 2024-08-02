const { GeneralMailOption } = require("../../middleware/sendMail")
const properties = require("../../model/developer/properties")
const { mailerController } = require("../../utils/mailer")


exports.userRequestDocs = async(req,res,next) => {
    const {prodId} = req.params
    const {firstName, lastName, email, phone} = req.body
    try {
        
       const data = await properties.findById(prodId)

    //    mailerController(
    //     GeneralMailOption({
    //       email: data.user.email,
    //       text: rejection_reason,
    //       title: "Propsverse Property Rejection",
    //     })
    //   );



       return res.status(200).json({status:"success", data})
    } catch (error) {
        next("failed to return data")
    }

}