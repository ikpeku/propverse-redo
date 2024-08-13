const Kyc = require("../../model/compliance/kyc")
const Accreditation = require("../../model/compliance/accreditation")
const { errorHandler } = require("../../utils/error")

exports.userKyc = async(req, res, next) => {
    const {
            afirmation,
            proof_of_identify,
            proof_of_funds,
            fund_manager
    } = req.body


    try {

       await Kyc.findByIdAndUpdate(req.payload.userId, {
        isSubmitted: true,
        kyc:{
            afirmation,
            proof_of_identify,
            proof_of_funds,
            fund_manager
          }
       })

       res.status(200).json({
        message: "success"
       })

    } catch (error) {
        next(errorHandler(500, "failed to update"))
    }
}

exports.getUserKyc = async(req, res, next) => {
    
    try {

     const data =   await Kyc.findById(req.payload.userId)

       res.status(200).json({
        message: "success",
        data
       })

    } catch (error) {
        next(errorHandler(500, "failed"))
    }
}




exports.userUpdateAccreditation = async(req, res, next) => {

}


exports.userAccreditation = async(req, res, next) => {

    try {

        const data =   await Accreditation.findById(req.payload.userId)
   
          res.status(200).json({
           message: "success",
           data
          })
   
       } catch (error) {
           next(errorHandler(500, "failed"))
       }

}