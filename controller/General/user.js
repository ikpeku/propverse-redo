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

       return res.status(200).json({
        message: "success"
       })

    } catch (error) {
        next(errorHandler(500, "failed to update"))
    }
}

exports.getUserKyc = async(req, res, next) => {
    
    try {

     const data =   await Kyc.findById(req.payload.userId)

     return res.status(200).json({
        message: "success",
        data
       })

    } catch (error) {
        next(errorHandler(500, "failed"))
    }
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

        $set:
        {
        ...{isSubmitted: true},
        ...{status: "processing"},
        ...{verify_method: "individual"},

        ...{accreditation:{
          ...is_accredited_investor_qualify && {is_accredited_investor_qualify},
         ...accredited_method && {accredited_method},
          ...{isDocumentSubmitted: true},
          ...{individual: {
            ...accredited_verify_method && {accredited_verify_method},
            ...{method: "verify_method_1"},
            ...{verify_method_1: {
              ...letter_of_verification && {letter_of_verification},
             ...{verifier_detail: {
                ...title && {title},
                ...name && {name},
                ...email && {email}
              }},
              ...{added: new Date().toISOString()}
            }}
          }}

        }}
      }
    }
    )
    
     return res.status(200).json({
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

    const resp =  await Accreditation.findByIdAndUpdate(req.payload.userId, {
        ...{$set:{isSubmitted: true}},
      ...{$set: { status: "processing"}},
        ...{$set:{verify_method: "individual"}},
        ...{$set:{"accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify}},
        ...{$set:{"accreditation.accredited_method": accredited_method}},
        ...{$set:{"accreditation.isDocumentSubmitted": true}},
        ...{$set:{"accreditation.individual.accredited_verify_method": accredited_verify_method}},
        ...{$set:{"accreditation.individual.method": "verify_method_2"}},
        ...{$set:{"accreditation.individual.verify_method_2.networth_estimate.proof1": proof1}},
        ...{$set:{"accreditation.individual.verify_method_2.networth_estimate.proof1": proof2}},
        ...{$set:{"accreditation.individual.verify_method_2.added": new Date().toISOString()}},
        
      //   accreditation:{
      //     is_accredited_investor_qualify,
      //     accredited_method,
      //     isDocumentSubmitted: true,

      //     individual: {
      //       accredited_verify_method,
      //       method: "verify_method_2",

      //       verify_method_2: {
      //         networth_estimate: {
      //           proof1,
      //           proof2,
      //         },
      //         added: new Date().toISOString()
            
      //     }

      //   }
      // }
      }, {new: true})
    
      return  res.status(200).json({
        message: "success",resp
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
          isDocumentSubmitted: true,
          individual: {
            accredited_verify_method,
            method: "verify_method_3",
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
    
      return  res.status(200).json({
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
            isDocumentSubmitted: true,
            individual: {
              accredited_verify_method,
              method: "verify_method_4",
              verify_method_4: {
                proof_of_finra_lincence,
                added: new Date().toISOString()
              }
            }
          }
        })
      
        return res.status(200).json({
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
            isDocumentSubmitted: false,
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
      
        return res.status(200).json({
          message: "success",
         })
  
      } catch (error) {
          next(errorHandler(500, "failed to update"))
        
      }
  
    }




exports.AccreditationEntityDocument = async(req, res, next) => {
  const {entity_document} = req.body;

    try {

        const data =   await Accreditation.findByIdAndUpdate(req.payload.userId,  
          { "accreditation.isDocumentSubmitted ": true,
        $push: {"accreditation.entity.entity_document":  entity_document}
        },
          { new: true, useFindAndModify: false })
   
          return  res.status(200).json({
           message: "success"
          })
   
       } catch (error) {
           next(errorHandler(500, "failed"))
       }

}

exports.userAccreditation = async(req, res, next) => {

    try {

        const data =   await Accreditation.findById(req.payload.userId)
   
        return  res.status(200).json({
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

