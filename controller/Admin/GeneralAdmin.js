
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");
const Kyc = require("../../model/compliance/kyc");
const TransactionsPayIn = require("../../model/transaction/transactions")
const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
const Property = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");
const Limited_partners = require("../../model/institutional/limitedpartners");


const Compliance = require("../../model/compliance/accreditation");
const { mailerController } = require("../../utils/mailer");
const { GeneralMailOption } = require("../../middleware/sendMail");


exports.suspendUserAccount = async(req,res,next) => {
    const {userId} = req.params
  
    try {
     const response = await User.findById(userId);
  
     response.isSuspended = !response.isSuspended
     response.save()

     res.status(200).json({
        message: "success"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }

  
exports.kycVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason, isRejected} = req.body
  
    try {
     const response = await Kyc.findById(userId).populate("user");

     if(!response) {
      return next(errorHandler(401,"user not found"))
    }
  
    if(isRejected) {
      response.isApproved = false
    } else {
      response.isApproved = true
    }

     response.save()


     if(isRejected) {
      mailerController(
        GeneralMailOption({
          email: response?.user?.email,
          text: rejectreason,
          title: "Propsverse Kyc Rejection",
        })
      );
  
    }

     res.status(200).json({
        message: "success",
        data: isRejected ? "kyc rejected successfully" : "kyv approved successfully"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  
exports.complianceVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason,isRejected} = req.body
    
    try {
      const response = await Compliance.findById(userId).populate("user");

      if(!response) {
        return next(errorHandler(401,"user not found"))
      }
  

  await Compliance.findByIdAndUpdate(userId, {$set: {status: isRejected ? "rejected" : "verified" }})


  if(isRejected) {
    mailerController(
      GeneralMailOption({
        email: response?.user?.email,
        text: rejectreason,
        title: "Propsverse compliance Rejection",
      })
    );

  }

     res.status(200).json({
        message: "success",
        data: isRejected ? "compliance rejected successfully" : "compliance approved successfully",
     })
      
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  


exports.VerifyPayIn = async(req,res,next) => {
    const {txnId, type} = req.params;
    const {rejectreason} = req.body;
  
  
    try {
     const response = await TransactionsPayIn.findById(txnId).populate("investor");

     if(!response) {
      return next(errorHandler(401,"invalid transaction"))
    }

  
     response.isVerify = true

     if(type === "reject"){
      response.status = "Failed"
      if(response.transaction_type == "property purchase"){
         
        await Non_Institutional_Investor.findByIdAndUpdate(
         response.investor,
         { $pull: { transactions: response._id, properties: response.property } },
         { new: true, useFindAndModify: false }
       );
     
       await Property.findByIdAndUpdate(
       response.property,
         { $push: { transactions: response._id } },
         { new: true, useFindAndModify: false }
       );

      }
      if(response.transaction_type == "funds"){
       await Non_Institutional_Investor.findByIdAndUpdate(
         response.investor,
         { $pull: { transactions: response._id, funds: response.funds } },
         { new: true, useFindAndModify: false }
       );
       
       await Funds.findByIdAndUpdate(
         response.funds,
         { $pull: { investments: response._id } },
         { new: true, useFindAndModify: false }
       );

      }


      mailerController(
        GeneralMailOption({
          email: response?.investor?.email,
          text: rejectreason,
          title: "Propsverse transaction Rejection",
        })
      );
     } 
     
     if(type === "approve") {
         response.status = "Success"

         if(response.transaction_type == "property purchase"){
         
           await Non_Institutional_Investor.findByIdAndUpdate(
            response.investor,
            { $push: { transactions: response._id, properties: response.property } },
            { new: true, useFindAndModify: false }
          );
        
          await Property.findByIdAndUpdate(
          response.property,
            { $push: { transactions: response._id } },
            { new: true, useFindAndModify: false }
          );

         }
         if(response.transaction_type == "funds"){
          await Non_Institutional_Investor.findByIdAndUpdate(
            response.investor,
            { $push: { transactions: response._id, funds: response.funds } },
            { new: true, useFindAndModify: false }
          );
          
          await Funds.findByIdAndUpdate(
            response.funds,
            { $push: { investments: response._id } },
            { new: true, useFindAndModify: false }
          );

         }

      


     }

     response.save()
  

     res.status(200).json({
        message: type !== "approve" ? "Rejected successfully" : "Approved successfully"
     })
      
    } catch (error) {
      next(errorHandler(500, "operation failed"));   
    }
  
  }


  exports.AdminDashbroad = async(req,res,next) => {

    const days = parseInt(req?.query?.days) || 7;
    const funddays = parseInt(req?.query?.funddays) || 356;

    

    const numberOfWeeks = Math.floor(days/7); 
    const funddays_numberOfWeeks = Math.floor(funddays/7); 
    

    const addWeeksToDate = (dateObj,numberOfWeeks) => {
      dateObj.setDate(dateObj.getDate() - numberOfWeeks * 7);
      return dateObj;
    }

   
    // console.log(addWeeksToDate(new Date(), numberOfWeeks).toISOString());
 
const activity_days = addWeeksToDate(new Date(), numberOfWeeks);
const graph_days = addWeeksToDate(new Date(), funddays_numberOfWeeks);






    try {

      const admindashbroad = await User.aggregate(
        
        [
        // {
        //   $group: {
        //     _id: "$account_type",
        //     numbersOfUsers: {
        //       $count: {}
        //     },
        //     date: {
        //       $addToSet: "$createdAt"
        //     },
        //   },
        //   $sort: {
        //     date: -1
        //   },
        // },
      //   {
      //     $setWindowFields: {
      //       sortBy: { day: 1 },
      //       output: {
      //         thirtyDaysAgoDate: {
      //           $last: "$date",
      //           window: { range: [30 * 24, 31 * 24], unit: 'hour' }
      //         },
      //         thirtyDaysAgoValue: {
      //           $last: "$expencel",
      //           window: { range: [30 * 24, 31 * 24], unit: 'hour' }
      //         }
      //       }
      //     }
      //   },
      // {
      //   $set: {thirtyDayChange: {$divide: [{$subtract: ['$totalValue','$thirtyDaysAgoValue']}, '$totalValue']}}
      // }

      // 'Institutional Investor',
      //   'Developer',
      //   'Non-Institutional Investor',
      //   'Admin',

      {
        $match: { verify_account: true, isSuspended: false }
      },
      {
        $set: {
          addedDate: "$createdAt"
        }
      },
      

      {
        $facet: {
          Institutional_Investor: [
            {$match: {account_type: "Institutional Investor"}},
            {$count: "count"}
          ],
          Developer: [
            {$match: {account_type: "Developer"}},
            {$count: "count"}
          ],
          Non_Institutional_Investor: [
            {$match: {account_type: "Non-Institutional Investor"}},
            {$count: "count"}
          ],
          Institutional_Investor_Activity: [
            {$match: {account_type: "Institutional Investor", addedDate: {$gte: activity_days}}},
            {$count: "count"}
          ],
          Developer_Activity: [
            {$match: {account_type: "Developer", addedDate: {$gte: activity_days}}},
            {$count: "count"}
          ],
          Non_Institutional_Investor_Activity: [
            {$match: {account_type: "Non-Institutional Investor", addedDate: {$gte: activity_days}}},
            // {$match: {createdAt: {$gte: activity_days}}},
            {$count: "count"}
          ],
          

        }
      },


      {
        $addFields: {
          totalUser: {$add: [{$arrayElemAt: ['$Institutional_Investor.count', 0]},{ $arrayElemAt: ['$Developer.count', 0] }, { $arrayElemAt: ['$Non_Institutional_Investor.count', 0] } ]}
        }
      },
      {
        $addFields: {
          totalUser_Activity: {$add: [{$arrayElemAt: ['$Institutional_Investor_Activity.count', 0]},{ $arrayElemAt: ['$Developer_Activity.count', 0] }, { $arrayElemAt: ['$Non_Institutional_Investor_Activity.count', 0] } ]}
        }
      },

      {
        $project: {
         investor_data: {
          Institutional_Investor: { $arrayElemAt: ['$Institutional_Investor.count', 0] },
          Institutional_Investor_percentage:  {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
          developers_percentage:  {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Developer.count', 0] }, "$totalUser"]}, 100]}},
          Non_Institutional_Investor_percentage:  {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Non_Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
          developers: { $arrayElemAt: ['$Developer.count', 0] },
          private_investors: { $arrayElemAt: ['$Non_Institutional_Investor.count', 0] },
         },


        activities: {
          Institutional_Investor: {$ifNull: [{ $arrayElemAt: ['$Institutional_Investor_Activity.count', 0] }, 0]},
          Institutional_Investor_percentage:  {$ifNull: [{$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Institutional_Investor_Activity.count', 0] }, "$totalUser_Activity"]}, 100]}}, 0]},
          developers_percentage:  {$ifNull: [{$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Developer_Activity.count', 0] }, "$totalUser_Activity"]}, 100]}}, 0]},
          Non_Institutional_Investor_percentage:  {$ifNull: [{$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Non_Institutional_Investor_Activity.count', 0] }, "$totalUser_Activity"]}, 100]}}, 0]},
        developers: {$ifNull: [{ $arrayElemAt: ['$Developer_Activity.count', 0] }, 0]},
        private_investors: {$ifNull: [{ $arrayElemAt: ['$Non_Institutional_Investor_Activity.count', 0] }, 0]},
        }





        }
    }]
  )


  const funds = await Limited_partners.aggregate([
    {
      $lookup: {
        from: "funds",
        localField: "fund",
        foreignField: "_id",
        as: "fund",
      },
    },
    

    {
      $facet: {
        table: [
          {
            $set: {
              addedDate: "$createdAt"
            }
          },
          {$match:{addedDate: {$gte: graph_days}}},
        //   {
        //     $setWindowFields: {
        //        partitionBy: { $month: "$createdAt" },
        //        sortBy: { updateAt: -1 },
        //        output: {
        //           cumulative_capital_committed: {
        //              $sum: "$capital_committed.amount",
        //              window: {
        //                 documents: [ "unbounded", "current" ]
        //              }
        //           },
        //           cumulative_capital_raise: {
        //              $sum: "$capital_deploy.amount",
        //              window: {
        //               documents: [ "unbounded", "current" ]
        //              }
        //           }
        //        }
        //     }
        //  },
        { 
          $group: {
              // _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
              _id: {month: {$month: "$createdAt"}},
              cumulative_capital_committed: { $sum: "$capital_committed.amount" },
              cumulative_capital_raise: { $sum: "$capital_deploy.amount" }
          }
      },
        {
          $project: {
            cumulative_capital_committed: 1,
            cumulative_capital_raise: 1,
            // createdAt: {$month: "$createdAt"}
          }
         }
         
        ],
        account: [
          {
            $project: {
              fund_raise: { $sum: "$capital_deploy.amount" },
              funds_committed: { $sum: "$capital_committed.amount" },
            },
          },
        ],
        Institutional_Investor: [
          {
            $unwind: "$fund",
          },
          {
            $group: {
              _id: "$fund.user",
            }
          }
        ],
        Investor: [
          {
            $group: {
              _id: "$user",
            }
          }
        ],
        
      },
    },

    {
      $project: {
        Institutional_Investor_that_raise: {
          $size: "$Institutional_Investor",
        },
        Institutional_Investor_that_committed: {
          $size: "$Investor",
        },

        fund_raise: {
          $sum: "$account.fund_raise",
        },
        funds_committed: {
          $sum: "$account.funds_committed",
        },
        table: 1
      },
    },
  ]);

  const properties = await Property.aggregate([
    // {
    //   // $match: { isSubmitted: true, isAdminAproved: "Approved" }
    // }
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    // { $unset: ["user.password"] },
    // {
    //   $unwind: "$user",
    // },
    {
      $lookup: {
        from: "transactions",
        localField: "transactions",
        foreignField: "_id",
        as: "transaction_invested",
      },
    },
    {
      $addFields: {
        amount_invested: {
          $sum: { $sum: "$transaction_invested.paid.amount" },
        },
      },
    },

    {
      $project: {
        total_revenue: {$sum: "$amount_invested"}
      }
    }
  ]);

      res.status(200).json({
        data: {
          ...admindashbroad[0],
           ...funds[0],
          ...properties[0]
          }
      })
      
    } catch (error) {
      next(error)
      
    }

  }
  

  /**
   * return all property without pagination
   */

  exports.AllProperties = async(req,res,next) => {

    try {
    const data =  await Property.find({ isAdminAproved: "Approved", }).select("_id property_detail.property_overview.property_name")
    res.status(200).json({
      data
    })
    } catch (error) {
      next(error)
      
    }
  }

  exports.AllFunds = async(req,res,next) => {
  
    try {
    const data =  await Funds.find({ isAdmin_Approved: "approved"}).select("_id name")
    res.status(200).json({
      data
    })
    } catch (error) {
      next(error)
      
    }
  }

  exports.AllUsers = async(req,res,next) => {
  
    try {
    const data =  await User.find({verify_account: true}).select("_id username")
    res.status(200).json({
      data
    })
    } catch (error) {
      next(error)
      
    }
  }