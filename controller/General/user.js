const Kyc = require("../../model/compliance/kyc")
const Accreditation = require("../../model/compliance/accreditation")

exports.userKyc = (req, res, next) => {

    console.log("enter kyc")
    console.log(req.payload)

    try {
        // isSubmitted: {
        //     type: Boolean,
        //     default: false,
        //   },
        //   isApproved: {
        //     type: Boolean,
        //     default: false,
        //   },
      
        //   kyc:{
        //     afirmation: {
        //       type: Boolean,
        //       default: false
        //     },
        //     proof_of_identify: {
        //       document_type: {
        //         type: String,
        //         default: "",
        //       },
        //       document: {
        //         location: {
        //           type: String,
        //           default: "",
        //         },
        //         originalname: {
        //           type: String,
        //           // default: "",
        //         },
        //         mimetype: {
        //           type: String,
        //           // default: "",
        //         },
        //         size: {
        //           type: String,
        //           // default: "",
        //         },
        //         key: {
        //           type: String,
        //           // default: "",
        //         },
        //       },
        //     },
        //     proof_of_funds:{
        //       document: {
        //         location: {
        //           type: String,
        //           default: "",
        //         },
        //         originalname: {
        //           type: String,
        //           // default: "",
        //         },
        //         mimetype: {
        //           type: String,
        //           // default: "",
        //         },
        //         size: {
        //           type: String,
        //           // default: "",
        //         },
        //         key: {
        //           type: String,
        //           // default: "",
        //         },
        //       },
        
        //     }
        //   }
    } catch (error) {
        
    }
}


exports.userAccreditation = (req, res, next) => {

    console.log("enter accreditation")

}