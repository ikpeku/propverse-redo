const Kyc = require("../../model/compliance/kyc")
const User = require("../../model/user")
const Accreditation = require("../../model/compliance/accreditation")
const { errorHandler } = require("../../utils/error")
const properties = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");
const Limited_partners = require("../../model/institutional/limitedpartners");
const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
// const Institutional_Investor = require("../../model/institutional/primaryContactDetails");
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

  let query = [
    {
      $sort: {
        updatedAt: 1,
      },
    },
  ];
  // 'Institutional Investor',
  // 'Developer',
  // 'Non-Institutional Investor',
  // 'Admin',

  if (req.payload.status !== "Admin") {
    query.push({
      $match: { investor: new ObjectId(req.payload.userId) },
    });
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
      $unwind: "$user",
    }
  );

   
    if(req.payload.status == 'Non-Institutional Investor'){
       query.push(
      {
          $project: {
            name: 1,
            description: 1,
            paid: 1,
            transaction_type: 1,
            paymentDate: 1,
            updatedAt: 1,
            status: 1,
            _id: 1,
            
          },
        }
    )
    }

 if (req.payload.status == "Developer") {
   query.push({
     $project: {
       investorname: "$user.username",
       projectname: "$name",
       transaction_type: 1,
       paid: 1,
       paymentDate: 1,
       updatedAt: 1,
       status: 1,
       _id: 1,
     },
   });
 }

 if (req.payload.status == "Admin") {
   query.push(

     {
       $lookup: {
         from: "funds",
         localField: "funds",
         foreignField: "_id",
         as: "fund",
       },
     },

     {
      $addFields: {
        fund_detail: {
          $arrayElemAt: ["$fund", 0]
        }
      }
     },


     {
       $lookup: {
         from: "limited_partners",
         localField: "limited_partner",
         foreignField: "_id",
         as: "limited_partner",
       },
     },
     {
      $addFields: {
        limited_partner_detail: {
          $arrayElemAt: ["$limited_partner", 0]
        }
      }
     },

     {
       $project: {
         investorname: "$user.username",
         country: "$user.country",
         projectname: "$name",
         transaction_type: 1,
         description: 1,
         paid: 1,
         paymentDate: 1,
         updatedAt: 1,
         status: 1,
        _id: 1,
        fund_name: "$fund_detail.name",
        capital_committed: "$limited_partner_detail.capital_committed",
        capital_deploy: "$limited_partner_detail.capital_deploy",
        transaction_type: 1,
        invested_fund: "$funds",
        investorId: "$investor",
        fundId: "$funder",
        propertyId: "$property"
       },
     }
   );
 }


    if (searchText) {
      query.push({
        $match: {
          $or: [
            { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
            {
              investorname: { $regex: ".*" + searchText + ".*", $options: "i" },
            },
            { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
            {
              verify_type: { $regex: ".*" + searchText + ".*", $options: "i" },
            },
            { status: searchText },
          ],
        },
      });
    }

    if (country) {
      query.push({
        $match: { country: { $regex: ".*" + country + ".*", $options: "i" } },
      });
    }
    if (status) {
      query.push({
        $match: { status },
      });
    }
    if (name) {
      query.push({
        $match: { username: { $regex: name, $options: "i" } },
      });
    }

    query.push({
      $sort: {
        updatedAt: -1,
      },
    });

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

  

    return res.status(200).json({ status: "success", data: myAggregate[0] || null});
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

    const responseFunds = await Funds.findById(fundId);
    if (!responseFunds) {
      return next(errorHandler(400, "invalid fundId"));
    }


  const fundInvestment =  await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      transaction_type: "property",
      funder: fundId,
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
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });


    if(fundInvestment){
console.log("fundInvestment")
    }

   
 const isPropery =   await properties.findByIdAndUpdate(
      fundInvestment.property,
      { $push: { transactions: fundInvestment._id } },
      { new: true, useFindAndModify: false }
    );

    if(isPropery){
      console.log("isPropery")
          }
    

     const isFund =  await Funds.findByIdAndUpdate(
      fundId,
      { $push: { investments: fundInvestment._id , "funds_holdings.project_investments": fundInvestment.property} },
      { new: true, useFindAndModify: false }
    );

    if(isFund){
      console.log("isPropery")
          }


          return res.status(200).json({ status: "success"});
          

    
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
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

    if(txnProperty){
      console.log("txnProperty")
          }

   const investorAcct = await Non_Institutional_Investor.findByIdAndUpdate(
      txnProperty.investor,
      { $push: { transactions: txnProperty._id, properties: txnProperty.property } },
      { new: true, useFindAndModify: false }
    );

    if(investorAcct){
      console.log("investorAcct")
          }
  
          const investorProperties =  await properties.findByIdAndUpdate(
      txnProperty.property,
      { $push: { transactions: txnProperty._id } },
      { new: true, useFindAndModify: false }
    );

    if(investorProperties){
      console.log("investorProperties")
          }

  }


  return res.status(200).json({ status: "success"});


  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }



  
}

exports.create_Funds_Transactions = async (req, res, next) => {

  const { description, investorId, fundId, invested_fund,payment_status, paymentDate, capital_committed, paid: { amount, currency} } = req.body;

  if(req.payload.status !== 'Admin') return next(errorHandler(403, "Admin operation only"));
  
  try {
  
    const isUser = await User.findById(investorId)
    if (!isUser) {
      return next(errorHandler(400, "invalid user id"));
    }
   
   
  const response = await Funds.findById(invested_fund);

  if (!response) {
    return next(errorHandler(400, "confirm transact failed"));
  }


  if(fundId){

    const responseFunds = await Funds.findById(fundId);
    if (!responseFunds) {
      return next(errorHandler(400, "invalid fundId"));
    }

    
   const fundInvestment =  await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      // property: prodId,
      transaction_type: "funds",
      funder: fundId,
      funds: invested_fund,
      name: response.name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: capital_committed.amount,
        currency: capital_committed.currency,
      },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });

   const removebln =  await Funds.findByIdAndUpdate(
      fundId,
      { $push: { 
        "payout": fundInvestment._id 
      } },
      { new: true, useFindAndModify: false }
    );


    if(!removebln) {
      return next(errorHandler(400, "confirm transact failed"));
    }


    const item =   await Funds.findOne({_id:invested_fund,  "funds_holdings.funds_investments": fundId})

    if(item) {
           await Funds.findByIdAndUpdate(
            invested_fund,
        { $push: { 
          "investments": fundInvestment._id
        } },
        { new: true, useFindAndModify: false }
      );
       // "limitedpartners": Limited_partnersresponse._id, 
    } else {
      await Funds.findByIdAndUpdate(
        invested_fund,
    { $push: { 
      "investments": fundInvestment._id , 
      "funds_holdings.funds_investments": fundId} },
    { new: true, useFindAndModify: false }
  );

    }

    
       //   await Funds.findByIdAndUpdate(
    //     fundInvestment.funds,
    //     { $push: { 
    //       "investments": fundInvestment._id , 
    //       "limitedpartners": Limited_partnersresponse._id, 
    //       "funds_holdings.funds_investments": fundId} },
    //     { new: true, useFindAndModify: false }
    //   );

    // await Funds.findByIdAndUpdate(
    //   invested_fund,
    //   { $push: { 
    //     "investments": fundInvestment._id , 
    //     "limitedpartners": Limited_partnersresponse._id, 
    //     "funds_holdings.funds_investments": invested_fund} },
    //   { new: true, useFindAndModify: false }
    // );




    const dataLimited =  await Limited_partners.findOne({user: investorId,  fund:invested_fund})


    if(!dataLimited){
      const Limited_partnersresponse =  await Limited_partners.create({user: investorId,  fund:invested_fund, capital_committed:{amount:capital_committed.amount,currency: capital_committed.currency}, capital_deploy:{amount,currency} })      

      await Funds.findByIdAndUpdate(invested_fund,
        { $push: { 
          "limitedpartners": Limited_partnersresponse._id, 
        } },
        { new: true, useFindAndModify: false }
      );
      // "funds_holdings.funds_investments": invested_fund
      fundInvestment.limited_partner = Limited_partnersresponse._id;
      fundInvestment.save()

    } else {
      dataLimited.capital_deploy.amount += amount;
      dataLimited.save();

      // await Funds.findByIdAndUpdate(
      //   fundInvestment.funds,
      //   { $push: { investments: fundInvestment._id,} },
      //   { new: true, useFindAndModify: false }
      // );
    }




  } else {

   const txnProperty = await PayInTransaction.create({
      isVerify: true,
      investor: investorId,
      company: response.user,
      transaction_type: "funds",
      // property: prodId,
      funds: invested_fund,
      name: response.name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: capital_committed.amount,
        currency: capital_committed.currency,
      },
      payment_method: "bank  transfer",
      payment_status,
      description,
      paymentDate
    });



  const investor = await Non_Institutional_Investor.findByIdAndUpdate(
      txnProperty.investor,
      { $push: { transactions: txnProperty._id, funds: txnProperty.funds } },
      { new: true, useFindAndModify: false }
    );


    const dataLimited_partners =  await Limited_partners.findOne({user: investorId,  fund:invested_fund});

    

    if(!dataLimited_partners){
      const Limited_partnersresponse =  await Limited_partners.create({user: investorId,  fund:invested_fund, capital_committed:{amount:capital_committed.amount,currency: capital_committed.currency}, capital_deploy:{amount,currency} });
  
    const funding =  await Funds.findByIdAndUpdate(
        txnProperty.funds,
        { $push: { investments: txnProperty._id , limitedpartners: Limited_partnersresponse._id} },
        { new: true, useFindAndModify: false }
      );
      

    } else {
      dataLimited_partners.capital_deploy.amount += amount;
      dataLimited_partners.save();

      const funding =   await Funds.findByIdAndUpdate(
        txnProperty.funds,
        { $push: { investments: txnProperty._id} },
        { new: true, useFindAndModify: false }
      );


    }


  }

  return res.status(200).json({ status: "success"});

  } catch (error) {
    // next(errorHandler(500, "network error"));
    next(error)
    
  }
  
}


exports.capitalcommitted = async (req, res, next) => {
  const {userId, fundId} = req.params;

  const query = [
    {
      $match: {user: new ObjectId(userId),  fund: fundId}
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
     {
      $sort: {
        updatedAt: -1
      }
    },
    {
      $project: {
        username: "$user.username",
        capital_committed: 1,
        capital_deploy: 1,
        remaining_balance: {$subtract :["$capital_committed.amount", "$capital_deploy.amount"]},
        _id: "$_id",
      },
    },
   
  ]

  
  try {
    const allFunds = await Limited_partners.aggregate(query);

    res.status(200).json({
      success: true,
       data: allFunds[0] || null,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }
}



exports.getLimitedPartners = async (req, res, next) => {
 
const {fundId} = req.params
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  // const country = req?.query?.country;
  // const status = req?.query?.status;
  // const name = req?.query?.name;


  const myCustomLabels = {
    docs: 'data',
  };

  const options = {
    page,
    limit,
    customLabels: myCustomLabels
  };


  const query = [
    {
      $match: {fund: fundId}
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
     {
      $sort: {
        updatedAt: -1
      }
    },
    {
      $project: {
        username: "$user.username",
        capital_committed: 1,
        capital_deploy: 1,
        date_join: "$user.createdAt",
        remaining_balance: {$subtract :["$capital_committed.amount", "$capital_deploy.amount"]},
        _id: "$_id",
      },
    },
  ]

  if(searchText){
    query.push({
      $match: {
        $or: [
          { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
          { remaining_balance: { $regex: ".*" + searchText + ".*", $options: "i" } },
         
        ]
      }
    })
  }

  
  try {
    const allFunds =  Limited_partners.aggregate(query);

    const paginationResult = await Limited_partners.aggregatePaginate(
      allFunds,
      options
    );

    res.status(200).json({
      success: true,
     ...paginationResult
      // count: allFunds.length,
       
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }
}


exports.update_Transactions = async (req, res, next) => {

  const {description, investorId, fundId, prodId,payment_status, paymentDate,
    paid: {
      amount,
      currency,
    }, invested_fund, capital_committed
  } = req.body;
  const {txnId} = req.params;


  if(req.payload.status !== 'Admin') return next(errorHandler(403, "Admin operation only"));


  
  try {
  

    const isUser = await User.findById(investorId)
    if (!isUser) {
      return next(errorHandler(400, "invalid user id"));
    }

    const transaction =  await PayInTransaction.findById(txnId);


    if (transaction.transaction_type == "property"){
      const response = await properties.findById(prodId);
    
      if (!response) {
        return next(errorHandler(400, "confirm transact failed"));
      }
    
    
      if(fundId) {
        await properties.findByIdAndUpdate(
          transaction.property,
          { $pull: { transactions: transaction._id } },
          { new: true, useFindAndModify: false }
        );
        
        await Funds.findByIdAndUpdate(
          fundId,
          { $pull: { investments: transaction._id , "funds_holdings.project_investments": transaction.property} },
          { new: true, useFindAndModify: false }
        );
      } else {
        await Non_Institutional_Investor.findByIdAndUpdate(
          transaction.investor,
          { $pull: { transactions: transaction._id, properties: transaction.property } },
          { new: true, useFindAndModify: false }
        );
      
        await properties.findByIdAndUpdate(
          transaction.property,
          { $pull: { transactions: transaction._id } },
          { new: true, useFindAndModify: false }
        );
        
    
      }
            
    
      if(fundId){
    
        const responseFunds = await Funds.findById(fundId);
        if (!responseFunds) {
          return next(errorHandler(400, "invalid fundId"));
        }
    
        transaction.investor = investorId;
        transaction.company = response.user;
        transaction.transaction_type = "property";
        transaction.property = prodId;
        transaction.name = response.property_detail.property_overview.property_name;
        transaction.status = "Success";
        transaction.paid.amount = amount;
        transaction.paid.currency = currency;
        transaction.property_amount.amount = response.property_detail.property_overview.price.amount;
        transaction.property_amount.currency = response.property_detail.property_overview.price.currency;
        transaction.payment_method = "bank  transfer";
        transaction.payment_status =  payment_status;
        transaction.description = description;
        transaction.paymentDate = paymentDate;
    
        transaction.save()
    
       
        await properties.findByIdAndUpdate(
          transaction.property,
          { $push: { transactions: transaction._id } },
          { new: true, useFindAndModify: false }
        );
        
        await Funds.findByIdAndUpdate(
          fundId,
          { $push: { investments: transaction._id , "funds_holdings.project_investments": transaction.property} },
          { new: true, useFindAndModify: false }
        );
    
        
      } else {
    
        transaction.investor = investorId;
        transaction.company = response.user;
        transaction.transaction_type = "property";
        transaction.property = prodId;
        transaction.name = response.property_detail.property_overview.property_name;
        transaction.status = "Success";
        transaction.paid.amount = amount;
        transaction.paid.currency = currency;
        transaction.property_amount.amount = response.property_detail.property_overview.price.amount;
        transaction.property_amount.currency = response.property_detail.property_overview.price.currency;
        transaction.payment_method = "bank  transfer";
        transaction.payment_status =  payment_status;
        transaction.description = description;
        transaction.paymentDate = paymentDate;
    
        transaction.save()
    
    
        await Non_Institutional_Investor.findByIdAndUpdate(
          transaction.investor,
          { $push: { transactions: transaction._id, properties: transaction.property } },
          { new: true, useFindAndModify: false }
        );
      
        await properties.findByIdAndUpdate(
          transaction.property,
          { $push: { transactions: transaction._id } },
          { new: true, useFindAndModify: false }
        );
      }

    }
   
    if (transaction.transaction_type == "funds"){

  
      const response = await Funds.findById(invested_fund);
    
      if (!response) {
        return next(errorHandler(400, "confirm transact failed"));
      }
    
    
      if(fundId){
    
        const responseFunds = await Funds.findById(fundId);
        if (!responseFunds) {
          return next(errorHandler(400, "invalid fundId"));
        }
    
        
      //  const fundInvestment =  await PayInTransaction.create({
      //     isVerify: true,
      //     investor: investorId,
      //     company: response.user,
      //     // property: prodId,
      //     transaction_type: "funds",
      //     funder: fundId,
      //     funds: invested_fund,
      //     name: response.name,
      //     status: "Success",
      //     paid: {
      //       amount,
      //       currency,
      //     },
      //     property_amount: {
      //       amount: capital_committed.amount,
      //       currency: capital_committed.currency,
      //     },
      //     payment_method: "bank  transfer",
      //     payment_status,
      //     description,
      //     paymentDate
      //   });

      await Funds.findByIdAndUpdate(
        transaction.funder,
        { $pull: { 
          "payout": transaction._id 
        } },
        { new: true, useFindAndModify: false }
      );


        transaction.isVerify = true,
transaction.investor = investorId,
transaction.company = response.user,

transaction.transaction_type = "funds",
transaction.funder = fundId,
transaction.funds = invested_fund,
transaction.name = response.name,
transaction.status = "Success",
transaction.paid.amount = amount
transaction.paid.currency = currency
          
transaction.property_amount.amount =  capital_committed.amount, 
transaction.property_amount.currency =  capital_committed.currency, 
transaction.payment_status = payment_status,
transaction.description = description,
transaction.paymentDate = paymentDate
transaction.save()





    
       const removebln =  await Funds.findByIdAndUpdate(
          fundId,
          { $push: { 
            "payout": transaction._id 
          } },
          { new: true, useFindAndModify: false }
        );
    
    
        if(!removebln) {
          return next(errorHandler(400, "confirm transact failed"));
        }
    
    
        const item =   await Funds.findOne({_id:invested_fund,  "funds_holdings.funds_investments": fundId})
    
        if(item) {
               await Funds.findByIdAndUpdate(
                invested_fund,
            { $push: { 
              "investments": transaction._id
            } },
            { new: true, useFindAndModify: false }
          );
           // "limitedpartners": Limited_partnersresponse._id, 
        } else {
          await Funds.findByIdAndUpdate(
            invested_fund,
        { $push: { 
          "investments": transaction._id , 
          "funds_holdings.funds_investments": fundId} },
        { new: true, useFindAndModify: false }
      );
    
        }
    
        
           //   await Funds.findByIdAndUpdate(
        //     fundInvestment.funds,
        //     { $push: { 
        //       "investments": fundInvestment._id , 
        //       "limitedpartners": Limited_partnersresponse._id, 
        //       "funds_holdings.funds_investments": fundId} },
        //     { new: true, useFindAndModify: false }
        //   );
    
        // await Funds.findByIdAndUpdate(
        //   invested_fund,
        //   { $push: { 
        //     "investments": fundInvestment._id , 
        //     "limitedpartners": Limited_partnersresponse._id, 
        //     "funds_holdings.funds_investments": invested_fund} },
        //   { new: true, useFindAndModify: false }
        // );
    
    
    
    
        const dataLimited =  await Limited_partners.findOne({user: investorId,  fund:invested_fund})
    
    
        if(!dataLimited){
          const Limited_partnersresponse =  await Limited_partners.create({user: investorId,  fund:invested_fund, capital_committed:{amount:capital_committed.amount,currency: capital_committed.currency}, capital_deploy:{amount,currency} })      
    
          await Funds.findByIdAndUpdate(invested_fund,
            { $push: { 
              "limitedpartners": Limited_partnersresponse._id, 
            } },
            { new: true, useFindAndModify: false }
          );
          // "funds_holdings.funds_investments": invested_fund
          transaction.limited_partner = Limited_partnersresponse._id;
          transaction.save()
    
        } else {
          dataLimited.capital_deploy.amount += amount;
          dataLimited.save();
    
          // await Funds.findByIdAndUpdate(
          //   fundInvestment.funds,
          //   { $push: { investments: fundInvestment._id,} },
          //   { new: true, useFindAndModify: false }
          // );
        }
    
    
    
    
      } else {

        const partners =  await Limited_partners.findOne({user: transaction.investor,  fund: transaction.funds})

        if(partners){
          partners.capital_deploy.amount -= transaction.capital_deploy.amount;
          partners.save();
        }



        await Non_Institutional_Investor.findByIdAndUpdate(
          transaction.investor,
          { $pull: {transactions: transaction._id, funds: transaction.funds } },
          { new: true, useFindAndModify: false }
        );
    
transaction.isVerify = true,
transaction.investor = investorId,
transaction.company = response.user,
transaction.transaction_type = "funds",
transaction.funds = invested_fund,
transaction.name = response.name,
transaction.status = "Success",
transaction.paid.amount = amount
transaction.paid.currency = currency
          
transaction.property_amount.amount =  capital_committed.amount, 
transaction.property_amount.currency =  capital_committed.currency, 
transaction.payment_status = payment_status,
transaction.description = description,
transaction.paymentDate = paymentDate
transaction.save()
       
    
    
await Non_Institutional_Investor.findByIdAndUpdate(
  transaction.investor,
  { $push: {transactions: transaction._id, funds: transaction.funds } },
  { new: true, useFindAndModify: false }
);
        

    
        const dataLimited_partners =  await Limited_partners.findOne({user: investorId,  fund:invested_fund})
    
        if(!dataLimited_partners){
          const Limited_partnersresponse =  await Limited_partners.create({user: investorId,  fund:invested_fund, capital_committed:{amount:capital_committed.amount,currency: capital_committed.currency}, capital_deploy:{amount,currency} })
        
      
          await Funds.findByIdAndUpdate(
            txnProperty.funds,
            { $push: { investments: transaction._id , limitedpartners: Limited_partnersresponse._id} },
            { new: true, useFindAndModify: false }
          );
    
        } else {
          dataLimited_partners.capital_deploy.amount += amount;
          dataLimited_partners.save();
    
          await Funds.findByIdAndUpdate(
            transaction.funds,
            { $push: { investments: transaction._id} },
            { new: true, useFindAndModify: false }
          );
    
        }
    
    
      }
    
      return res.status(200).json({ status: "success"});
    
      

    }



  return res.status(200).json({ status: "success"});

  } catch (error) {
    // next(errorHandler(500, "network error"));
    next(error)
  }



  
}






