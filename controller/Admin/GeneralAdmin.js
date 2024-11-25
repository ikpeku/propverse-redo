
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
    // const funddays = parseInt(req?.query?.funddays) || 356;

    

    const numberOfWeeks = Math.floor(days/7); 
    // const funddays_numberOfWeeks = Math.floor(funddays/7); 
    

    const addWeeksToDate = (dateObj,numberOfWeeks) => {
      dateObj.setDate(dateObj.getDate() - numberOfWeeks * 7);
      return dateObj;
    }

   
    // console.log(addWeeksToDate(new Date(), numberOfWeeks).toISOString());
 
const activity_days = addWeeksToDate(new Date(), numberOfWeeks);
// const graph_days = addWeeksToDate(new Date(), funddays_numberOfWeeks);






    try {

      const admindashbroad = await User.aggregate([
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
          // All_Investor: [
          //   // {$match: {account_type: "Institutional Investor"}},
          //   {$count: "count"}
          // ],
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
          Institutional_Investor_percentage:  {
            percentage: {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },

          developers_percentage: {
            percentage:  {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Developer.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },

          Non_Institutional_Investor_percentage:  {
            percentage: {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Non_Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },


          developers: { $arrayElemAt: ['$Developer.count', 0] },
          private_investors: { $arrayElemAt: ['$Non_Institutional_Investor.count', 0] },
         
         },


        activities: {
          // number_of_investors: { $arrayElemAt: ['$All_Investor.count', 0] },
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
      //   table: [
      //     {
      //       $set: {
      //         addedDate: "$createdAt"
      //       }
      //     },
      //     {$match:{addedDate: {$gte: graph_days}}},
       
      //   { 
      //     $group: {
      //         // _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
      //         _id: {month: {$month: "$createdAt"}},
      //         cumulative_capital_committed: { $sum: "$capital_committed.amount" },
      //         cumulative_capital_raise: { $sum: "$capital_deploy.amount" }
      //     }
      // },
      //   {
      //     $project: {
      //       cumulative_capital_committed: 1,
      //       cumulative_capital_raise: 1,
      //       // createdAt: {$month: "$createdAt"}
      //     }
      //    }
         
      //   ],
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
        funds: {
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
        }
      
        // table: 1
      },
    },
  ]);

  const properties = await TransactionsPayIn.aggregate([
   
    {
      $match: { transaction_type: "property" }
    },
    {
      $facet: {
        all_txn: [
              {
                $project: {
                   revenue: "$paid.amount"
                  }
              },
               ],
        developers: [
             {
           $lookup: {
             from: "properties",
             localField: "property",
             foreignField: "_id",
             as: "property_detail",
           },
         },
     
         {
           $addFields: {
             investedproperty: {
               $arrayElemAt: ["$property_detail", 0]
             }
           }
          },

          {$unwind: "$property_detail"},

          {
            $group: {
              _id:  "$property_detail.user",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              developer_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }


        ],
        project_investors: [
          {
            $match: {
              $or: [
                { funder: null },
                { funder: undefined },
                { funder: "" },
              ]
            }
          },
          {
            $group: {
              _id:  "$investor",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              investor_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }
        ],
        insitutional_investors: [

          {
            $match: {
              funder: { $ne: null, $ne: "" , $ne: undefined}  // Match documents where 'funder' is not null or empty
            }
          },
          {
            $group: {
              _id:  "$funder",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              funder_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }
          
        ]
        
           }
    },
  
      {
      $project: {
        property: {
          total_revenue: {$sum: "$all_txn.revenue"},
          developers_that_sold: {$sum: "$developers.developer_count"},
          insitutional_investors_that_paid: {$sum: "$insitutional_investors.funder_count"},
          investors_that_paid: {$sum: "$project_investors.investor_count"},
        }
      }
    },
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
  
  exports.AdminDashbroadActivities = async(req,res,next) => {

    const days = parseInt(req?.query?.days) || 7;
    // const funddays = parseInt(req?.query?.funddays) || 356;

    

    const numberOfWeeks = Math.floor(days/7); 
    // const funddays_numberOfWeeks = Math.floor(funddays/7); 
    

    const addWeeksToDate = (dateObj,numberOfWeeks) => {
      dateObj.setDate(dateObj.getDate() - numberOfWeeks * 7);
      return dateObj;
    }

   
    // console.log(addWeeksToDate(new Date(), numberOfWeeks).toISOString());
 
const activity_days = addWeeksToDate(new Date(), numberOfWeeks);
// const graph_days = addWeeksToDate(new Date(), funddays_numberOfWeeks);






    try {

      const admindashbroad = await User.aggregate([
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
          // All_Investor: [
          //   // {$match: {account_type: "Institutional Investor"}},
          //   {$count: "count"}
          // ],
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
          Institutional_Investor_percentage:  {
            percentage: {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },

          developers_percentage: {
            percentage:  {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Developer.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },

          Non_Institutional_Investor_percentage:  {
            percentage: {$floor: {$multiply: [{$divide : [{ $arrayElemAt: ['$Non_Institutional_Investor.count', 0] }, "$totalUser"]}, 100]}},
            type: "ascending",
          },


          developers: { $arrayElemAt: ['$Developer.count', 0] },
          private_investors: { $arrayElemAt: ['$Non_Institutional_Investor.count', 0] },
         
         },


        activities: {
          // number_of_investors: { $arrayElemAt: ['$All_Investor.count', 0] },
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
      //   table: [
      //     {
      //       $set: {
      //         addedDate: "$createdAt"
      //       }
      //     },
      //     {$match:{addedDate: {$gte: graph_days}}},
       
      //   { 
      //     $group: {
      //         // _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
      //         _id: {month: {$month: "$createdAt"}},
      //         cumulative_capital_committed: { $sum: "$capital_committed.amount" },
      //         cumulative_capital_raise: { $sum: "$capital_deploy.amount" }
      //     }
      // },
      //   {
      //     $project: {
      //       cumulative_capital_committed: 1,
      //       cumulative_capital_raise: 1,
      //       // createdAt: {$month: "$createdAt"}
      //     }
      //    }
         
      //   ],
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
        funds: {
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
        }
      
        // table: 1
      },
    },
  ]);

  const properties = await TransactionsPayIn.aggregate([
   
    {
      $match: { transaction_type: "property" }
    },
    {
      $facet: {
        all_txn: [
              {
                $project: {
                   revenue: "$paid.amount"
                  }
              },
               ],
        developers: [
             {
           $lookup: {
             from: "properties",
             localField: "property",
             foreignField: "_id",
             as: "property_detail",
           },
         },
     
         {
           $addFields: {
             investedproperty: {
               $arrayElemAt: ["$property_detail", 0]
             }
           }
          },

          {$unwind: "$property_detail"},

          {
            $group: {
              _id:  "$property_detail.user",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              developer_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }


        ],
        project_investors: [
          {
            $match: {
              $or: [
                { funder: null },
                { funder: undefined },
                { funder: "" },
              ]
            }
          },
          {
            $group: {
              _id:  "$investor",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              investor_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }
        ],
        insitutional_investors: [

          {
            $match: {
              funder: { $ne: null, $ne: "" , $ne: undefined}  // Match documents where 'funder' is not null or empty
            }
          },
          {
            $group: {
              _id:  "$funder",
              count: { "$first": 1 }
            }
           

          },
          {
            $project: {
              funder_count: "$count",  // Include only the 'funder' field
              _id: 0      // Optionally exclude the '_id' field
            }
          }
          
        ]
        
           }
    },
  
      {
      $project: {
        property: {
          total_revenue: {$sum: "$all_txn.revenue"},
          developers_that_sold: {$sum: "$developers.developer_count"},
          insitutional_investors_that_paid: {$sum: "$insitutional_investors.funder_count"},
          investors_that_paid: {$sum: "$project_investors.investor_count"},
        }
      }
    },
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



  exports.AdminDashbroadChart = async (req, res, next) =>{
    const year = parseInt(req?.query?.year) || new Date().getFullYear();
  
    const query = [
      {
        $lookup: {
          from: "funds",
          localField: "fund",
          foreignField: "_id",
          pipeline: [

          {
          $lookup: {
            from: "transactions",
            localField: "investments",
            foreignField: "_id",
            pipeline: [

              {
                $lookup: {
                  from: "properties",
                  localField: "property",
                  foreignField: "_id",
                  as: "property_detail",
                },
              },
          
              {
                $addFields: {
                  investedproperty: {
                    $arrayElemAt: ["$property_detail", 0]
                  }
                }
               },
  
              {
                 $project: {
                  investor: 1,
                  // property_amount: "$investedproperty.property_detail.property_overview.price",
                  property_amount: {$ifNull : ["$investedproperty.property_detail.property_overview.price",null]},
                  paymentDate: 1,
                  paid: 1
                 }
              }
           ] ,
            as: "investmenttxn",
          },
        },
       
            {
              $project: {
                transaction_items: "$investmenttxn"
              }
            }
          ],
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
          $project: {
            transactions: "$fund_detail.transaction_items",
          }
        }
    ]
  
    
    try {
      const data = await Limited_partners.aggregate(query);
  
      
      const chartData = data[0].transactions.reduce(function(total, item) {
  
       
  
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const d = new Date(item.paymentDate);
  
        const month = monthNames[d.getMonth()];
  
        if(year == d.getFullYear()){
  
          if(total[month]){
            total[month].amount_raised += item.paid.amount;
            total[month].currency = item.paid.currency;

            if(item?.property_amount){
              total[month].property_paid_for = item.property_amount.amount;
              total[month].property_paid_for_currency = item.property_amount.currency;
            }
         }
  
        }
        
        return total;
  }, {
    January :{
      date: 'Jan',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    February :{
      ate: 'Feb',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    March :{
      date: 'Mar',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    April :{
      date: 'Apr',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    May :{
      date: 'May',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    June :{
      date: 'Jun',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    July :{
      date: 'Jul',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    August :{
      date: 'Aug',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    September :{
      date: 'Sep',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    October :{
      date: 'Oct',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    November : {
      date: 'Nov',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    },
    December : {
      date: 'Dec',
      amount_raised: 0,
      property_paid_for_currency: "$",
      property_paid_for: 0,
      currency: "$"
    }
  
  }); 
  
  
      res.status(200).json({
        success: true,
        data: Object.values(chartData) || null,
        // items: data
      });
    } catch (error) {
      next(error)
      // next(errorHandler(500, "server error"));
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