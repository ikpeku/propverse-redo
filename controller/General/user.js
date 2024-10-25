const Kyc = require("../../model/compliance/kyc")
const User = require("../../model/user")
const Accreditation = require("../../model/compliance/accreditation")
const { errorHandler } = require("../../utils/error")
const properties = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");
const Limited_partners = require("../../model/institutional/limitedpartners");
const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
const PayInTransaction = require("../../model/transaction/transactions");
const Due_deligence = require("../../model/developer/due_deligence");
const { ObjectId } = require("mongodb");

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




/**
 * Account Section
 */

exports.get_UserInfo = async (req, res, next) => {
 
  try {
    const myAggregate = await User.findById(req.payload.userId).select("-password");

    let developer;
        if(myAggregate?.account_type === "Developer"){
          developer = await Due_deligence.findById(req.payload.userId).select("isAdminAproved isSubmited")
        }

    return res.status(200).json({ status: "success",
       data: myAggregate?.account_type === "Developer" ? {...myAggregate._doc, ...developer._doc} : myAggregate
      });

      
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}

exports.set_Payout = async (req, res, next) => {
  const {
  bank_name,
          account_name,
          account_number,
          swift_code
  } = req.body
 
  try {
    const myAggregate = await User.findById(req.payload.userId).select("-password");

    myAggregate.payout_account.bank_name =  bank_name;
    myAggregate.payout_account.account_name =  account_name;
    myAggregate.payout_account.account_number =  account_number;
    myAggregate.payout_account.swift_code =  swift_code;

    myAggregate.save()



    return res.status(200).json({ status: "success", data: myAggregate.payout_account });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}

exports.set_User_Info = async (req, res, next) => {
  const {
 username,
 email,
 phone_number,
 country,
 address
  } = req.body
 
  try {
    const myAggregate = await User.findById(req.payload.userId).select("-password");

    myAggregate.username =  username;
    myAggregate.email =  email;
    myAggregate.phone_number =  phone_number;
    myAggregate.country =  country;
    myAggregate.address =  address;

    myAggregate.save()



    return res.status(200).json({ status: "success" });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}


exports.set_User_Avatar = async (req, res, next) => {
  const { avatar } = req.body;
 
  try {
    const myAggregate = await User.findById(req.payload.userId).select("-password");
    myAggregate.avatar =  avatar;
    myAggregate.save()

    return res.status(200).json({ status: "success" });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}


// referrals

/**
 * Account Section
 */

exports.get_Rerral = async (req, res, next) => {
 
  try {
    const data = await User.findById(req.payload.userId).select("-password"); 


    let referralDetail = {
      referralurl: `http://localhost:3000/select-account?refId=${data.referral.referralId}`,
      referral: 0,
      Invested: 0,
      InvestedReward: 0,
    }

    
    return res.status(200).json({ status: "success",
       data: referralDetail
      });

      
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}


/**
 * Account Section
 */

exports.customise_Referral = async (req, res, next) => {
  // const {} = req.body
 
  try {
    const data = await User.findById(req.payload.userId).select("-password"); 


    let referralDetail = {
      referralurl: `http://localhost:3000/select-account?refId=${data.referral.referralId}`,
      referral: 0,
      Invested: 0,
      InvestedReward: 0,
    }

    
    return res.status(200).json({ status: "success",
       data: referralDetail
      });

      
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
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
      $sort: {
        updatedAt: -1,
      },
    },
  ]
  // 'Institutional Investor',
  // 'Developer',
  // 'Non-Institutional Investor',
  // 'Admin',


  if(req.payload.status !== 'Admin'){
  query.push(
    {
      $match: { investor:  new ObjectId(req.payload.userId)}
    }
  )
  }

  query.push(
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
       }
  )




   
    if(req.payload.status == 'Non-Institutional Investor'){
       query.push(
      {
          $project: {
            name: 1,
            description: 1,
            paid: 1,
            transaction_type: 1,
            createdAt: 1,
            status: 1,
            _id: 1
          },
        }
    )
    }

 if(req.payload.status == 'Developer'){  
   query.push(

        {
            $project: {
              investorname: "$user.username",
              projectname:  "$name",
              transaction_type: 1,
              paid: 1,
              createdAt: 1,
              status: 1,
              _id: 1
            },
          }
      )
    }



  if(req.payload.status == 'Admin'){
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
  }





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
    next(errorHandler(500, "network error"));
    
  }
}


exports.get_Transaction_by_Id = async (req, res, next) => {
 

  let query =  [
    {
      $match: { _id:  new ObjectId(req.params.txnId)}
    },
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
    {
      $project: {
        name: 1,
        description: 1,
        date: "$createdAt",
        amount_paid: "$paid.amount",
        total_amount : "$property_amount.amount",
        payment_status: "$status",
        transaction_type: 1,
        transaction_method: "$payment_method",
        transaction_status: "$payment_status",
    "user.username": 1,
    "user.phone_number": 1,
    "user.email": 1
      },
    }
   
  ]
 

  try {
    const myAggregate = await PayInTransaction.aggregate(query);

  

    return res.status(200).json({ status: "success", data: myAggregate[0] });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}

exports.delete_Transaction = async (req, res, next) => {
 
 

  try {
    const myAggregate = await PayInTransaction.findByIdAndDelete(req.params.txnId);

  

    return res.status(200).json({ status: "delete success" });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}

exports.create_Property_Transactions = async (req, res, next) => {

  const {description, investorId, fundId, prodId,payment_status, paymentDate,
    paid: {
      amount,
      currency,
    }
  } = req.body;

  if(req.payload.status !== 'Admin') return next(errorHandler(403, "Admin operation only"));
  
  try {
  

    const isUser = await User.findById(investorId)
    if (!isUser) {
      return next(errorHandler(400, "invalid user id"));
    }
   
    // console.log(prodId)
  const response = await properties.findById(prodId);

  if (!response) {
    return next(errorHandler(400, "confirm transact failed"));
  }

  if(fundId){
  const fundInvestment =  await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      transaction_type: "property",
      funds: fundId,
      name: response.property_detail.property_overview.property_name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.property_detail.property_overview.price.amount,
        currency: response.property_detail.property_overview.price.currency,
      },
      // proof_of_payment: {
      //   location,
      //   originalname,
      //   mimetype,
      //   size,
      //   key,
      // },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

    // await Non_Institutional_Investor.findByIdAndUpdate(
    //   fundInvestment.investor,
    //   { $push: { transactions: fundInvestment._id, funds: fundInvestment.funds } },
    //   { new: true, useFindAndModify: false }
    // );
    await properties.findByIdAndUpdate(
      fundInvestment.property,
      { $push: { transactions: fundInvestment._id } },
      { new: true, useFindAndModify: false }
    );
    
    await Funds.findByIdAndUpdate(
      fundInvestment.funds,
      { $push: { investments: fundInvestment._id } },
      { new: true, useFindAndModify: false }
    );


  } else {
   const txnProperty = await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      transaction_type: "property",
      property: prodId,
      name: response.property_detail.property_overview.property_name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.property_detail.property_overview.price.amount,
        currency: response.property_detail.property_overview.price.currency,
      },
      // proof_of_payment: {
      //   location,
      //   originalname,
      //   mimetype,
      //   size,
      //   key,
      // },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

    await Non_Institutional_Investor.findByIdAndUpdate(
      txnProperty.investor,
      { $push: { transactions: txnProperty._id, properties: txnProperty.property } },
      { new: true, useFindAndModify: false }
    );
  
    await properties.findByIdAndUpdate(
      txnProperty.property,
      { $push: { transactions: txnProperty._id } },
      { new: true, useFindAndModify: false }
    );
  }


  // if(type === "reject"){
  //   response.status = "Failed"
  //   if(response.transaction_type == "property purchase"){
       
  //     await Non_Institutional_Investor.findByIdAndUpdate(
  //      response.investor,
  //      { $pull: { transactions: response._id, properties: response.property } },
  //      { new: true, useFindAndModify: false }
  //    );
   
  //    await Property.findByIdAndUpdate(
  //    response.property,
  //      { $push: { transactions: response._id } },
  //      { new: true, useFindAndModify: false }
  //    );

  //   }
  //   if(response.transaction_type == "funds"){
  //    await Non_Institutional_Investor.findByIdAndUpdate(
  //      response.investor,
  //      { $pull: { transactions: response._id, funds: response.funds } },
  //      { new: true, useFindAndModify: false }
  //    );
     
  //    await Funds.findByIdAndUpdate(
  //      response.funds,
  //      { $pull: { investments: response._id } },
  //      { new: true, useFindAndModify: false }
  //    );

  //   }


  //   mailerController(
  //     GeneralMailOption({
  //       email: response?.investor?.email,
  //       text: rejectreason,
  //       title: "Propsverse transaction Rejection",
  //     })
  //   );
  //  } 
   
  //  if(type === "approve") {
  //      response.status = "Success"

      //  if(response.transaction_type == "property purchase"){
       
      //    await Non_Institutional_Investor.findByIdAndUpdate(
      //     response.investor,
      //     { $push: { transactions: response._id, properties: response.property } },
      //     { new: true, useFindAndModify: false }
      //   );
      
      //   await Property.findByIdAndUpdate(
      //   response.property,
      //     { $push: { transactions: response._id } },
      //     { new: true, useFindAndModify: false }
      //   );

      //  }

      //  if(response.transaction_type == "funds"){
      //   await Non_Institutional_Investor.findByIdAndUpdate(
      //     response.investor,
      //     { $push: { transactions: response._id, funds: response.funds } },
      //     { new: true, useFindAndModify: false }
      //   );
        
      //   await Funds.findByIdAndUpdate(
      //     response.funds,
      //     { $push: { investments: response._id } },
      //     { new: true, useFindAndModify: false }
      //   );

      //  }

    


  //  }




  return res.status(200).json({ status: "success"});
  // return res.status(200).json({ status: "success", data:  investment});


  } catch (error) {
    next(error);
    // next(errorHandler(500, "network error"));
    
  }



  
}

exports.create_Funds_Transactions = async (req, res, next) => {

  const {description, investorId, fundId, prodId,payment_status, paymentDate,
    paid: {
      amount,
      currency,
    }
  } = req.body;

  if(req.payload.status !== 'Admin') return next(errorHandler(403, "Admin operation only"));
  
  try {
  
    const isUser = await User.findById(investorId)
    if (!isUser) {
      return next(errorHandler(400, "invalid user id"));
    }
   
    // console.log(prodId)
  const response = await properties.findById(prodId);

  if (!response) {
    return next(errorHandler(400, "confirm transact failed"));
  }

  if(fundId){
   const fundInvestment =  await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      property: prodId,
      transaction_type: "property",
      funds: fundId,
      name: response.property_detail.property_overview.property_name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.property_detail.property_overview.price.amount,
        currency: response.property_detail.property_overview.price.currency,
      },
      // proof_of_payment: {
      //   location,
      //   originalname,
      //   mimetype,
      //   size,
      //   key,
      // },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

    // await Non_Institutional_Investor.findByIdAndUpdate(
    //   fundInvestment.investor,
    //   { $push: { transactions: fundInvestment._id, funds: fundInvestment.funds } },
    //   { new: true, useFindAndModify: false }
    // );
    
    await Funds.findByIdAndUpdate(
      fundInvestment.funds,
      { $push: { investments: fundInvestment._id } },
      { new: true, useFindAndModify: false }
    );


  } else {
   const txnProperty = await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      transaction_type: "property",
      property: prodId,
      name: response.property_detail.property_overview.property_name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.property_detail.property_overview.price.amount,
        currency: response.property_detail.property_overview.price.currency,
      },
      // proof_of_payment: {
      //   location,
      //   originalname,
      //   mimetype,
      //   size,
      //   key,
      // },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

    await Non_Institutional_Investor.findByIdAndUpdate(
      txnProperty.investor,
      { $push: { transactions: txnProperty._id, properties: txnProperty.property } },
      { new: true, useFindAndModify: false }
    );
  
    await properties.findByIdAndUpdate(
      txnProperty.property,
      { $push: { transactions: txnProperty._id } },
      { new: true, useFindAndModify: false }
    );
  }


  return res.status(200).json({ status: "success"});

  } catch (error) {
    next(error);
    // next(errorHandler(500, "network error"));
    
  }



  
}


exports.capitalcommitted = async (req, res, next) => {
  const {userId, fundId} = req.params;

  try {
    const response =  await Limited_partners.findOne({user: userId,  fund:fundId})
 
    return res.status(200).json({ status: "success", data:response});

  } catch (error) {
    next(error)
    
  }
}






