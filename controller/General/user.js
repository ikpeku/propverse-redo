const Kyc = require("../../model/compliance/kyc")
const Accreditation = require("../../model/compliance/accreditation")
const { errorHandler } = require("../../utils/error")
const Property = require("../../model/developer/properties");
const Fund = require("../../model/institutional/fund");
const PayInTransaction = require("../../model/transaction/transactions");

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
      

       await Kyc.findByIdAndUpdate(req.payload.userId, {$set:{
        "isSubmitted": true,
        "kyc.afirmation": afirmation,
        "kyc.proof_of_identify": proof_of_identify,
        "kyc.proof_of_funds": proof_of_funds,
        "kyc.fund_manager": fund_manager,
        // kyc:{
        //     afirmation,
        //     proof_of_identify,
        //     proof_of_funds,
        //     fund_manager
        //   }
       }}).exec()

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

      await Accreditation.findByIdAndUpdate(req.payload.userId, { $set:
        {
        // ...{isSubmitted: true},
        // ...{status: "processing"},
        // ...{verify_method: "individual"},
        // ...{added: new Date().toISOString()},
        // accreditation:{
        //   ...is_accredited_investor_qualify && {$set: {is_accredited_investor_qualify}},
        //  ...accredited_method && {accredited_method},
        //   ...{isDocumentSubmitted: true},
        //   ...{individual: {
        //     ...accredited_verify_method && {accredited_verify_method},

        "isSubmitted": true,
        "status": "processing",
        "verify_method": "individual",
        "added": new Date().toISOString(),
  
  
        "accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify,
        "accreditation.accredited_method": accredited_method,
        "accreditation.isDocumentSubmitted": true,
  
  
        "accreditation.individual.accredited_verify_method": accredited_verify_method,
        "accreditation.individual.method": "verify_method_1",
        "accreditation.individual.verify_method_1.letter_of_verification": letter_of_verification,
        "accreditation.individual.verify_method_1.verifier_detail.title": title,
        "accreditation.individual.verify_method_1.verifier_detail.name": name,
        "accreditation.individual.verify_method_1.verifier_detail.email": email,

            // ...{method: "verify_method_1"},
            // ...{verify_method_1: {
            //   ...letter_of_verification && {letter_of_verification},
            //  ...{verifier_detail: {
            //     ...title && {title},
            //     ...name && {name},
            //     ...email && {email}
            //   }},
            
            // }}
          }
        
        }

    //     }
    //   }
    // }
    ).exec()
    
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

    const resp =  await Accreditation.findByIdAndUpdate(req.payload.userId, {$set:{
    
      "isSubmitted": true,
      "status": "processing",
      "verify_method": "individual",
      "added": new Date().toISOString(),


      "accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify,
      "accreditation.accredited_method": accredited_method,
      "accreditation.isDocumentSubmitted": true,


      "accreditation.individual.accredited_verify_method": accredited_verify_method,
      "accreditation.individual.method": "verify_method_2",

"accreditation.individual.verify_method_2.networth_estimate.proof1": proof1,
"accreditation.individual.verify_method_2.networth_estimate.proof1": proof2

       
      }}
    ).exec()
    
      return  res.status(200).json({
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

      await Accreditation.findByIdAndUpdate(req.payload.userId, {$set:{
        // isSubmitted: true,
        // status: "processing",
        // verify_method: "individual",
        // added: new Date().toISOString(),

        "isSubmitted": true,
        "status": "processing",
        "verify_method": "individual",
        "added": new Date().toISOString(),


        "accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify,
        "accreditation.accredited_method": accredited_method,
        "accreditation.isDocumentSubmitted": true,


        "accreditation.individual.accredited_verify_method": accredited_verify_method,
        "accreditation.individual.method": "verify_method_3",

        "accreditation.individual.verify_method_3.account_type": account_type,
        "accreditation.individual.verify_method_3.gross_income1": gross_income1,
        "accreditation.individual.verify_method_3.gross_income2": gross_income2,
        "accreditation.individual.verify_method_3.proof_of_income.document1": document1,
        "accreditation.individual.verify_method_3.proof_of_income.document2": document2,


      //   accreditation:{
      //     is_accredited_investor_qualify,
      //     accredited_method,
      //     isDocumentSubmitted: true,

      //     individual: {
      //       accredited_verify_method,
      //       method: "verify_method_3",

      //       verify_method_3: {
      //         account_type,
      //         gross_income1,
      //         gross_income2,
      //         proof_of_income: {
      //           document1,
      //           document2,
      //         }
            
      //     }

      //   }
      // }
      }}).exec()
    
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
  
        await Accreditation.findByIdAndUpdate(req.payload.userId, {$set:{
         
          "isSubmitted": true,
          "status": "processing",
          "verify_method": "individual",
          "added": new Date().toISOString(),

          "accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify,
          "accreditation.accredited_method": accredited_method,
          "accreditation.isDocumentSubmitted": true,

          "accreditation.individual.accredited_verify_method": accredited_verify_method,
          "accreditation.individual.method": "verify_method_4",
          "accreditation.individual.verify_method_4.proof_of_finra_lincence": proof_of_finra_lincence,

          // accreditation:{
          //   is_accredited_investor_qualify,
          //   accredited_method,
          //   isDocumentSubmitted: true,

          //   individual: {
          //     accredited_verify_method,
          //     method: "verify_method_4",
          //     verify_method_4: {
          //       proof_of_finra_lincence
               
          //     }
          //   }
          // }

        }}).exec()
      
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
  
       const entityResponse = await Accreditation.findOneAndUpdate({_id:req.payload.userId}, {$set:{
         
          "isSubmitted": true,
          "status": "processing",
          "verify_method": "entity",
          "added": new Date().toISOString(),

          "accreditation.is_accredited_investor_qualify": is_accredited_investor_qualify,
          "accreditation.accredited_method": accredited_method,
          "accreditation.entity.investment_entity": investment_entity,
          "accreditation.entity.details.isOwner": isOwner,
          "accreditation.entity.details.entity_legal_name": entity_legal_name,
          "accreditation.entity.details.date.day": day,
          "accreditation.entity.details.date.month": month,
          "accreditation.entity.details.date.year": year,
          "accreditation.entity.details.country": country,
          "accreditation.entity.details.city": city,
          "accreditation.entity.details.address": address,
          "accreditation.entity.details.mobile": mobile,
          "accreditation.entity.details.social": social,
          "accreditation.entity.details.tax_id": tax_id,
          "accreditation.entity.details.signatory": signatory,

        }}).exec()



        if(entityResponse.accreditation.entity.entity_document.length === 0) {
          await Accreditation.findOneAndUpdate({_id:req.payload.userId}, {$set: {
            "accreditation.isDocumentSubmitted": false
            // accreditation:{
            //   isDocumentSubmitted: false,
            // }
          }}).exec()
        } else {
          await Accreditation.findOneAndUpdate({_id:req.payload.userId}, {$set: {
            "accreditation.isDocumentSubmitted": true
            // accreditation:{
            //   isDocumentSubmitted: true,
            // }
          }}).exec()
        }

      
        return res.status(200).json({
          message: "success", entityResponse: entityResponse.accreditation.entity.entity_document.length
         })
  
      } catch (error) {
          next(errorHandler(500, error))
          // next(errorHandler(500, "failed to update"))
        
      }
  
    }




exports.AccreditationEntityDocument = async(req, res, next) => {
  const {entity_document} = req.body;

    try {

        const data =   await Accreditation.findByIdAndUpdate(req.payload.userId,  
          { 
        $push: {"accreditation.entity.entity_document":  {$each: entity_document}},

        },
          // { new: true, useFindAndModify: false }
        )
        await Accreditation.findOneAndUpdate({_id:req.payload.userId}, {$set: {
          "accreditation.isDocumentSubmitted": true
        }}).exec()
   
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



exports.get_Transactions = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  const country = req?.query?.country;
  const status = req?.query?.status;
  const name = req?.query?.name;




  const options = {
    page,
    limit,
  };



  let query =  [
          {
      $lookup: {
           from: "users",
           localField: "investor",
           foreignField: "_id",
           as: "user",
         },
       },
       {
        $unwind: "$user"
       },

  ]
  // 'Institutional Investor',
  // 'Developer',
  // 'Non-Institutional Investor',
  // 'Admin',

   
    // if(req.payload.status == 'Non-Institutional Investor'){
    //    query.push(
    //   {
    //       $project: {
    //         name: 1,
    //         description: 1,
    //         paid: 1,
    //         transaction_type: 1,
    //         createdAt: 1,
    //         status: 1,
    //         _id: 1
    //       },
    //     }
    // )
    // }

//  if(req.payload.status == 'Developer'){  
//    query.push(

//         {
//             $project: {
//               investorname: "$user.username",
//               projectname:  "$name",
//               transaction_type: 1,
//               paid: 1,
//               createdAt: 1,
//               status: 1,
//               _id: 1
//             },
//           }
//       )
//     }




  query.push(
      {
                    $project: {
                      investorname: "$user.username",
                      country: "$user.country",
                      projectname:  "$name",
                      transaction_type: 1,
                      paid: 1,
                      createdAt: 1,
                      status: 1,
                      _id: 1
                    },
                  }
    )






    if(searchText){

      query.push({
        $match: {
          $or: [
            { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
            { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
            { verify_type: { $regex: ".*" + searchText + ".*", $options: "i" } },
            { status: searchText}
          ]
        }
      })

      
    }
    
    if(country){
      query.push({
        $match: { country: { $regex: ".*" + country + ".*", $options: "i" } }
      })
    }
    if(status){
      query.push({
        $match: {status}
      })
    }
    if(name){
      query.push({
        $match: {username: { $regex: name, $options: "i" } }
      })
    }

    // console.log(req.payload)

     query.push(
     
        {
          $sort: {
            updatedAt: -1,
          },
        },
    )

  try {
    const myAggregate =  PayInTransaction.aggregate(query);

    const paginationResult = await PayInTransaction.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    // next(errorHandler(500, "network error"));
    next(errorHandler(500, error));
    
  }
}


