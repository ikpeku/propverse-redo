const Kyc = require("../../model/compliance/kyc")
const Accreditation = require("../../model/compliance/accreditation")
const { errorHandler } = require("../../utils/error")
const Property = require("../../model/developer/properties");
const Fund = require("../../model/institutional/fund");

exports.userKyc = async(req, res, next) => {
    const {
            afirmation,
            proof_of_identify,
            proof_of_funds,
            fund_manager
    } = req.body


    try {

        const response =  await Kyc.findById(req.payload.userId)

        if(!response) {
            return next(errorHandler(401,"user not found"))
          }
      

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

    const response =   await Accreditation.findById(req.payload.userId)


    if(!response) {
        return next(errorHandler(401,"user not found"))
      }


      // isSubmitted: {
      //   type: Boolean,
      //   default: false,
      // },
      // status: {
      //   type: String,
      //   default: "not verified",
      //   enum: ["not verified", "processing", "verified", "rejected"],
      // },
      // verify_method: {
      //   type: String,
      //   enum: ["individual", "entity"],
      //   default: "individual",
      // },
  
      // accreditation: {
      //   is_accredited_investor_qualify: {
      //     type: Boolean,
      //     default: false,
      //   },
  
      //   // isVerify: {
      //   //   type: Boolean,
      //   //   default: false,
      //   // },
      //   accredited_method: {
      //     type: String,
      //     default: "Individual with net-worth of $1M+ (with or without spouse)",
      //     enum: [
      //       "Individual with net-worth of $1M+ (with or without spouse)",
      //       "Individual with annual income in last two years of $200K+ ($300K+ with spouse)",
      //       "Entity or trust not formed for the specific purpose of investing with $5M+ in assets",
      //       "FINRA-licensed individual in good standing with Series 7, 65 or 82",
      //     ],
      //   },
  
      //   individual: {
      //     accredited_verify_method: {
      //       type: String,
      //       default:
      //         "I possess an official letter attesting to my income or accredited status, issued by either my lawyer, CPA, or investment advisor.",
      //       enum: [
      //         "I possess an official letter attesting to my income or accredited status, issued by either my lawyer, CPA, or investment advisor.",
      //         "I possess a net worth exceeding $1 million.",
      //         "I have earned an annual income exceeding $200,000 in the past two years, and when combined with my spouse's income, it surpasses $300,000.",
      //         "I am a reputable professional, licensed by FINRA, with an impeccable standing. I hold valid licenses for Series 7, 82, and 65.",
      //       ],
      //     },
      //     // method: {
      //     //   type: String,
      //     //   default: '',
      //     //   enum: [
      //     //     'verify_method_1',
      //     //     'verify_method_2',
      //     //     'verify_method_3',
      //     //     'verify_method_4',
      //     //     '',
      //     //   ],
      //     // },
      //     verify_method_1: {
      //       letter_of_verification: {
      //         location: {
      //           type: String,
      //           default: "",
      //         },
      //         originalname: {
      //           type: String,
      //           default: "",
      //         },
      //         mimetype: {
      //           type: String,
      //           default: "",
      //         },
      //         size: {
      //           type: String,
      //           default: "",
      //         },
      //         key: {
      //           type: String,
      //           default: "",
      //         },
      //       },
      //       verifier_detail: {
      //         title: {
      //           type: String,
      //           default: "",
      //         },
      //         name: {
      //           type: String,
      //           default: "",
      //         },
      //         email: {
      //           type: String,
      //           default: "",
      //         },
      //       },
      //       added: Date,
      //     },
      //     verify_method_2: {
      //       networth_estimate: {
      //         proof1: {
      //           location: {
      //             type: String,
      //             default: "",
      //           },
      //           originalname: {
      //             type: String,
      //             default: "",
      //           },
      //           mimetype: {
      //             type: String,
      //             default: "",
      //           },
      //           size: {
      //             type: String,
      //             default: "",
      //           },
      //           key: {
      //             type: String,
      //             default: "",
      //           },
      //         },
      //         proof2: {
      //           location: {
      //             type: String,
      //             default: "",
      //           },
      //           originalname: {
      //             type: String,
      //             default: "",
      //           },
      //           mimetype: {
      //             type: String,
      //             default: "",
      //           },
      //           size: {
      //             type: String,
      //             default: "",
      //           },
      //           key: {
      //             type: String,
      //             default: "",
      //           },
      //         },
      //       },
      //       added: Date,
      //     },
      //     verify_method_3: {
      //       account_type: {
      //         type: String,
      //         default: "",
      //       },
      //       gross_income1: {
      //         year: {
      //           type: String,
      //           default: "",
      //         },
      //         amount: {
      //           type: Number,
      //           default: 0,
      //         },
      //       },
      //       gross_income2: {
      //         year: {
      //           type: String,
      //           default: "",
      //         },
      //         amount: {
      //           type: Number,
      //           default: 0,
      //         },
      //       },
      //       proof_of_income: {
      //         document1: {
      //           year: {
      //             type: String,
      //             default: "",
      //           },
      //           name: {
      //             type: String,
      //             default: "",
      //           },
      //           file: {
      //             location: {
      //               type: String,
      //               default: "",
      //             },
      //             originalname: {
      //               type: String,
      //               default: "",
      //             },
      //             mimetype: {
      //               type: String,
      //               default: "",
      //             },
      //             size: {
      //               type: String,
      //               default: "",
      //             },
      //             key: {
      //               type: String,
      //               default: "",
      //             },
      //           },
      //         },
      //         document2: {
      //           year: {
      //             type: String,
      //             default: "",
      //           },
      //           name: {
      //             type: String,
      //             default: "",
      //           },
      //           file: {
      //             location: {
      //               type: String,
      //               default: "",
      //             },
      //             originalname: {
      //               type: String,
      //               default: "",
      //             },
      //             mimetype: {
      //               type: String,
      //               default: "",
      //             },
      //             size: {
      //               type: String,
      //               default: "",
      //             },
      //             key: {
      //               type: String,
      //               default: "",
      //             },
      //           },
      //         },
      //       },
      //       added: Date,
      //     },
  
      //     verify_method_4: {
      //       proof_of_finra_lincence: {
      //         location: {
      //           type: String,
      //           default: "",
      //         },
      //         originalname: {
      //           type: String,
      //           default: "",
      //         },
      //         mimetype: {
      //           type: String,
      //           default: "",
      //         },
      //         size: {
      //           type: String,
      //           default: "",
      //         },
      //         key: {
      //           type: String,
      //           default: "",
      //         },
      //       },
      //       added: Date,
      //     },
      //   },
  
      //   isDocumentSubmitted: {
      //     type: Boolean,
      //     default: false,
      //   },
  
      //   entity: {
      //     added: Date,
      //     investment_entity: {
      //       type: String,
      //       default: "LLC",
      //       enum: ["LLC", "Trust", "Corporation", "Partnership"],
      //     },
      //     details: {
      //       entity_legal_name: {
      //         type: String,
      //         default: "",
      //       },
      //       isOwner: {
      //         type: Boolean,
      //         default: false,
      //       },
      //       date: {
      //         day: {
      //           type: String,
      //           default: "",
      //         },
      //         month: {
      //           type: String,
      //           default: "",
      //         },
      //         year: {
      //           type: String,
      //           default: "",
      //         },
      //       },
      //       country: {
      //         type: String,
      //         default: "",
      //       },
      //       city: {
      //         type: String,
      //         default: "",
      //       },
      //       address: {
      //         type: String,
      //         default: "",
      //       },
      //       mobile: {
      //         type: String,
      //         default: "",
      //       },
      //       social: {
      //         type: String,
      //         default: "",
      //       },
      //       tax_id: {
      //         type: String,
      //         default: "",
      //       },
      //       signatory: {
      //         type: Boolean,
      //         default: false,
      //       },
      //     },
      //     entity_document
      //   },
      // },




  

}

exports.Accreditation1 = async(req, res, next) => {

  const {
    is_accredited_investor_qualify,
    accredited_method,
    accredited_verify_method,
    letter_of_verification,

        title,
        name,
        email
  } = req.body

  try {
    const response =   await Accreditation.findById(req.payload.userId)
  
  
    if(!response) {
        return next(errorHandler(401,"user not found"))
      }

      await Accreditation.findByIdAndUpdate(req.payload.userId, {
        isSubmitted: true,
        status: "processing",
        verify_method: "individual",

        accreditation:{
          is_accredited_investor_qualify,
          accredited_method,
          individual: {
            accredited_verify_method,
            verify_method_1: {
              letter_of_verification,
              verifier_detail: {
                title,
                name,
                email
              },
              added: new Date().toISOString()
            }
          }

        }
      })
    
      res.status(200).json({
        message: "success"
       })

    } catch (error) {
        next(errorHandler(500, "failed to update"))
    }

  }

exports.Accreditation2 = async(req, res, next) => {

  const {
    is_accredited_investor_qualify,
    accredited_method,
    accredited_verify_method,
    proof1,
    proof2,
 
  } = req.body

  try {
    const response =   await Accreditation.findById(req.payload.userId)
  
  
    if(!response) {
        return next(errorHandler(401,"user not found"))
      }

      await Accreditation.findByIdAndUpdate(req.payload.userId, {
        isSubmitted: true,
        status: "processing",
        verify_method: "individual",

        accreditation:{
          is_accredited_investor_qualify,
          accredited_method,
          individual: {
            accredited_verify_method,
            verify_method_2: {
              networth_estimate: {
                proof1,
                proof2,
              },
              added: new Date().toISOString()
            
          }

        }
      }
      })
    
      res.status(200).json({
        message: "success"
       })

    } catch (error) {
        next(errorHandler(500, "failed to update"))
    }

  }


exports.Accreditation3 = async(req, res, next) => {

  const {
    is_accredited_investor_qualify,
    accredited_method,
    accredited_verify_method,
   account_type,
          gross_income1,
          gross_income2,
          document1,
    document2
 
  } = req.body

  try {
    const response =   await Accreditation.findById(req.payload.userId)
  
  
    if(!response) {
        return next(errorHandler(401,"user not found"))
      }

      await Accreditation.findByIdAndUpdate(req.payload.userId, {
        isSubmitted: true,
        status: "processing",
        verify_method: "individual",

        accreditation:{
          is_accredited_investor_qualify,
          accredited_method,
          individual: {
            accredited_verify_method,
            verify_method_3: {
              account_type,
              gross_income1,
              gross_income2,
              proof_of_income: {
                document1,
                document2,
              },
              added: new Date().toISOString()
            
          }

        }
      }
      })
    
      res.status(200).json({
        message: "success"
       })

    } catch (error) {
        next(errorHandler(500, "failed to update"))
    }

  }




  
  exports.Accreditation4 = async(req, res, next) => {

    const {
      is_accredited_investor_qualify,
      accredited_method,
      accredited_verify_method,
      proof_of_finra_lincence,
  
    } = req.body
  
    try {
      const response =   await Accreditation.findById(req.payload.userId)
    
    
      if(!response) {
          return next(errorHandler(401,"user not found"))
        }
  
        await Accreditation.findByIdAndUpdate(req.payload.userId, {
         
          isSubmitted: true,
          status: "processing",
          verify_method: "individual",
  
          accreditation:{
            is_accredited_investor_qualify,
            accredited_method,
            individual: {
              accredited_verify_method,
              verify_method_4: {
                proof_of_finra_lincence,
                added: new Date().toISOString()
              }
            }
          }
        })
      
        res.status(200).json({
          message: "success"
         })
  
      } catch (error) {
          next(errorHandler(500, "failed to update"))
      }
  
    }


  exports.AccreditationEntity = async(req, res, next) => {

    const {
      is_accredited_investor_qualify,
      accredited_method,
      investment_entity,
      isOwner,
      entity_legal_name,
      day,
     month,
      year,

      country, 
         city,  
         address, 
         mobile, 
         social,  
         tax_id,  
         signatory
  
    } = req.body;
  
  
    try {
      const response =   await Accreditation.findById(req.payload.userId)
    
    
      if(!response) {
          return next(errorHandler(401,"user not found"))
        }
  
        await Accreditation.findByIdAndUpdate(req.payload.userId, {
         
          isSubmitted: true,
          status: "processing",
          verify_method: "entity",
  
          accreditation:{
            is_accredited_investor_qualify,
            accredited_method,

            entity: {
              added: new Date().toISOString(),
              investment_entity,
              details: {
                isOwner,
                entity_legal_name,
                date: {
                  day,
                  month,
                  year,
                },
               country, 
         city,  
         address, 
         mobile, 
         social,  
         tax_id,  
         signatory
              }

            }

          }
        },{ new: true, useFindAndModify: false })
      
        res.status(200).json({
          message: "success", response
         })
  
      } catch (error) {
          next(errorHandler(500, "failed to update"))
        
      }
  
    }




exports.AccreditationEntityDocument = async(req, res, next) => {
  const {entity_document} = req.body;

    try {

        const data =   await Accreditation.findByIdAndUpdate(req.payload.userId,  
          { $push: { "accreditation.isDocumentSubmitted ": true,},
        $set: {"accreditation.entity.entity_document":  entity_document}
        },
          { new: true, useFindAndModify: false })
   
          res.status(200).json({
           message: "success",
           data
          })
   
       } catch (error) {
           next(errorHandler(500, "failed"))
       }

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





exports.propertyInvestmentInfo = async(req,res,next) => {
  const {prodId} = req.params
  console.log(prodId)

  // let query = []

  // try {
  //   const myAggregate = await Property.aggregate(query);

  //   return res.status(200).json({ status: "success", data: myAggregate[0] });
  // } catch (error) {
  //   next(errorHandler(500, "network error"));
    
  // }
  
}

exports.fundInvestmentInfo = async(req,res,next) => {
  const {prodId} = req.params
  console.log(prodId)

  // let query = []

  // try {
  //   const myAggregate = await Fund.aggregate(query);

  //   return res.status(200).json({ status: "success", data: myAggregate[0] });
  // } catch (error) {
  //   next(errorHandler(500, "network error"));
    
  // }
}

