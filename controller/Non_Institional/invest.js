// const Investment = require("../../model/developer/property_investment")
// const Transactions = require("../../model/transaction/transactions");
const Property = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");
const Non_Institiutional_Investor = require("../../model/non_institional/non_institutional");
const { ObjectId } = require("mongodb");
const Limited_partners = require("../../model/institutional/limitedpartners");


const { errorHandler } = require("../../utils/error");



exports.dashbroad_Non_Institutional = async (req, res, next) => {

  // const year = parseInt(req?.query?.year) || new Date().getFullYear();

  const query = [
    {
      $match: { user : new ObjectId(req.payload.userId)}
    },
   
    //      {
    //     $lookup: {
    //       from: "transactions",
    //       localField: "investments",
    //       foreignField: "_id",
    // as: "investmenttxn",
    //     }},

    //   {
    //     $project: {
    //       transactions: {$sum: "$investmenttxn.paid.amount"},
    //       investment_structure: 1,
    //       updatedAt: 1
    //     }
    //   }
    {
      $lookup: {
        from: "funds",
        localField: "funds",
        foreignField: "_id",
        as: "fund",
      },
    },
    {
      $unwind: "$fund",
    },
     {
      $sort: {
        updatedAt: -1
      }
    },

    // {
    //   $addFields: {
    //     invested_capital_diff: { $divide: ["$capital_deploy.amount", "$capital_deploy.amount"] }
    //   }
    // },

    {
      $lookup: {
           from: "properties",
           localField: "properties",
           foreignField: "_id",
           pipeline: [{
             $lookup: {
               from: "due_deligences",
               localField: "company",
               foreignField: "user",
               as: "company",
             }},
             {
               "$unwind": "$company"
             },

              {
      $project: {
          property_location:  {$ifNull: ["$property_detail.property_location", ""]},
          property_type:  {$ifNull: ["$property_detail.property_overview.property_type", ""]},

          thumbnail:  {$ifNull: ["$property_detail.property_images", ""]},
          property_name:  {$ifNull: ["$property_detail.property_overview.property_name", ""]},
          property_progress:  {$ifNull: ["$property_progress", ""]},

          property_amount:  {$ifNull: ["$property_detail.property_overview.price", ""]},
          property_dates:  {$ifNull: ["$property_detail.property_overview.date", ""]},
         
          company:  {$ifNull: ["$company.company_information.name", ""]}
      },
    },
            
           ],
           as: "project_investments",
         },
                  
       },

    {
      $project: {
        funds: {
          fundname: {$ifNull: ["$fund.name", ""]},
          property_type: {$ifNull: ["$fund.property_type", ""]},
          invested_capital: {$ifNull: ["$capital_deploy", ""]},
          current_fund_value: {$ifNull: ["$capital_deploy.amount", ""]},
          annual_yield: {$ifNull: ["$fund.annual_yield", ""]},
          investment_date: {$ifNull: ["$updatedAt", ""]},
          fundId: {$ifNull: ["$fund._id", ""]},
          userId: {$ifNull: ["$fund.user", ""]},
          thumbnails: {$ifNull: ["$fund.thumbnails", ""]},
          // invested_capital_percentage: {$multiply :["$invested_capital_diff", 0.1]},
        },
        property: "$project_investments"

      },
    },
  ]

  
  try {
    const data = await Non_Institiutional_Investor.aggregate(query);

  



    res.status(200).json({
      success: true,
      data: {
        ongoing_investment: data[0] || null,
      }
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }
}


exports.dashbroad_Non_Institutional_FundChart = async (req, res, next) =>{

  const year = parseInt(req?.query?.year) || new Date().getFullYear();

  const query = [
    // limitedpartners
    {
      $match: { user : new ObjectId(req.payload.userId)}
    },
   
         {
        $lookup: {
          from: "transactions",
          localField: "investments",
          foreignField: "_id",
    as: "investmenttxn",
        }},

      {
        $project: {
          transactions: {$sum: "$investmenttxn.paid.amount"},
          investment_structure: 1,
          updatedAt: 1
        }
      }
  ]

  
  try {
    const data = await Funds.aggregate(query);

    
    const chartData = data.reduce(function(total, item) {

      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const d = new Date(item.updatedAt);

      const month = monthNames[d.getMonth()];


      if(year == d.getFullYear()){

        if(total[month]){
          if(total[month][item.investment_structure]){
            total[month][item.investment_structure].amount += item.transactions

          }
          // total[month].currency = item.paid.currency
       }

      }
      
      return total;
}, {
  January :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  February :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  March :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  April :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  May :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  June :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  July :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  August :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  September :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  October :{
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  November : {
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  },
  December : {
    residential: {
      amount: 0,
      currency: "$",
    },
    reit: {
      amount: 0,
      currency: "$",
    },
    commercial: {
      amount: 0,
      currency: "$",
    },
    industrial: {
      amount: 0,
      currency: "$",
    },
  }

}); 




    res.status(200).json({
      success: true,
      data: chartData || null,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }
}





// exports.makeInvestmentOnproperty = async (req, res, next) => {
//   const { userId } = req.params;
//   const {
//     prodId,
//     paid: { amount, currency },
//     proof_of_payment: { location, originalname, mimetype, size, key },
//     payment_status,
//     description,
//     investmentType,
//   } = req.body;

//   try {
//     const response = await Property.findById(prodId);

//     if (!response) {
//       return next(errorHandler(400, "confirm transact failed"));
//     }

//     const investment = await Transactions.create({
//       investor: userId,
//       company: response.user,
//       transaction_type: "property purchase",
//       property: prodId,
//       name: response.property_detail.property_overview.property_name,
//       status: "Pending",
//       paid: {
//         amount,
//         currency,
//       },
//       property_amount: {
//         amount: response.property_detail.property_overview.price.amount,
//         currency: response.property_detail.property_overview.price.currency,
//       },
//       proof_of_payment: {
//         location,
//         originalname,
//         mimetype,
//         size,
//         key,
//       },
//       payment_method: "bank  transfer",
//       payment_status,
//       description
//     });


//     // if (investmentType === "property") {

//     //   await Non_Institutional_Investor.findByIdAndUpdate(
//     //     userId,
//     //     { $push: { transactions: investment._id, properties: prodId } },
//     //     { new: true, useFindAndModify: false }
//     //   );
    
//     //   await Property.findByIdAndUpdate(
//     //   prodId,
//     //     { $push: { transactions: investment._id } },
//     //     { new: true, useFindAndModify: false }
//     //   );

//     // }

//     return res
//       .status(200)
//       .json({
//         status: "success",
//         message: "congratulations record taken awaiting confirmation",
//         // response,
//       });
//   } catch (error) {
//     next(error);
//     // next(errorHandler(400,"confirm transaction failed"))
//   }
// };

// exports.makeInvestmentFunds = async (req, res, next) => {
//   const { userId } = req.params;
//   const {
//     prodId,
//     paid: { amount, currency },
//     proof_of_payment: { location, originalname, mimetype, size, key },
//     investmentType,
//     description
//   } = req.body;


//   try {
//     const response = await Funds.findById(prodId);

//     if (!response) {
//       return next(errorHandler(400, "confirm transact failed"));
//     }

//     const investment = await Transactions.create({
//       investor: userId,
//       transaction_type: "funds",
//       funds: prodId,
//       name: response.name,
//       status: "Pending",
//       paid: {
//         amount,
//         currency,
//       },
//       property_amount: {
//         amount: response.raise_goal.amount,
//         currency: response.raise_goal.currency,
//       },
//       proof_of_payment: {
//         location,
//         originalname,
//         mimetype,
//         size,
//         key,
//       },

//       payment_method: "bank  transfer",
//       description
//     });

//     // if (investmentType === "funds") {
//     //   await Non_Institutional_Investor.findByIdAndUpdate(
//     //     userId,
//     //     { $push: { transactions: investment._id, funds: prodId } },
//     //     { new: true, useFindAndModify: false }
//     //   );
      
//     //   await Funds.findByIdAndUpdate(
//     //     prodId,
//     //     { $push: { investments: investment._id } },
//     //     { new: true, useFindAndModify: false }
//     //   );

//     // }

//     return res
//       .status(200)
//       .json({
//         status: "success",
//         message: "congratulations record taken awaiting confirmation",
//         // response,
//       });
//   } catch (error) {
//     next(error);
//     // next(errorHandler(400,"confirm transaction failed"))
//   }
// };

exports.getUserInvestment = async (req, res, next) => {
  const { userId } = req.params;
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
 
  const myCustomLabels = {
    docs: 'data',
  };

  const options = {
    page,
    limit,
    customLabels: myCustomLabels
  };


  
  try {
    const investor = Non_Institiutional_Investor.aggregate([
      {

        $match: {_id: new ObjectId(userId)}
      },

      {
        $lookup: {
             from: "properties",
             localField: "properties",
             foreignField: "_id",
             pipeline: [{
               $lookup: {
                 from: "due_deligences",
                 localField: "company",
                 foreignField: "user",
                 as: "company",
               }},
               {
                 "$unwind": "$company"
               },
              
             ],
             as: "project_investments",
           },
                    
         },
  
         {
          $unwind: "$project_investments"
         },
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $project: {
          // product: "$company",
          propertyId: "$project_investments._id",
          property_location: "$project_investments.property_detail.property_location",
          property_type: "$project_investments.property_detail.property_overview.property_type",

          thumbnail: "$project_investments.property_detail.property_images",
          property_name: "$project_investments.property_detail.property_overview.property_name",
          property_progress: "$project_investments.property_progress",

          property_amount: "$project_investments.property_detail.property_overview.price",
          property_dates: "$project_investments.property_detail.property_overview.date",
         
          company: "$project_investments.company.company_information.name" || ""
        },
      },
    ]);

    const paginationResult = await Non_Institiutional_Investor.aggregatePaginate(
      investor,
      options
    );

    res.status(200).json({
      success: true,
      // count: allFunds.length,
       ...paginationResult,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }




};

exports.getInvestmentById = async (req, res, next) => {
  const { prodId } = req.params;
  
  try {
    const investoredProperty = await Property.aggregate([
      {

        $match: {_id: prodId}
      },
      {
        $lookup: {
          from: "due_deligences",
          localField: "company",
          foreignField: "user",
          as: "company",
        }},
        {
          "$unwind": "$company"
        },

        {
          $lookup: {
               from: "transactions",
               localField: "transactions",
               foreignField: "_id",
               pipeline: [
                { $project : {paid:1 , description: 1, paymentDate: {$ifNull: ["$paymentDate", "$createdAt"]}} }
               ],
               as: "property_invested",
             },
           },
        {
          $lookup: {
               from: "property_activities",
               localField: "activities",
               foreignField: "_id",
              //  pipeline: [
              //   { $project : {paid:1 , description: 1, paymentDate: {$ifNull: ["$paymentDate", "$createdAt"]}} }
              //  ],
               as: "property_activities",
             },
           },
           {
            $addFields: {
              number_of_bathroom: {
                $sum: { $sum: "$property_detail.property_units.number_of_bathroom" },
              },
            },
          },
           {
            $addFields: {
              number_of_bedroom: {
                $sum: { $sum: "$property_detail.property_units.number_of_bedroom" },
              },
            },
          },
  
      {
        $sort: {
          updatedAt: -1
        }
      },

      {
        $project: {
          // product: "$$ROOT",
          thumbnail: "$property_detail.property_images",
          company: "$company.company_information.name",
          property_name: "$property_detail.property_overview.property_name",
          property_location: "$property_detail.property_location",
          property_type: "$property_detail.property_overview.property_type",
          property_progress: {$ifNull:["$property_progress", 0]} ,
          property_amount: "$property_detail.property_overview.price",
          property_dates: "$property_detail.property_overview.date",
          // room_configuration: "$property_detail.property_overview.room_configuration",
          room_configuration: "$number_of_bedroom",
          bathrooms_configuration: "$number_of_bathroom",
          // bathrooms_configuration: "$property_detail.property_overview.room_configuration",
          property_size: "$property_detail.property_overview.size",
          property_document: "$property_detail.property_documents",
          payment_update : "$property_invested",
          activities_update : "$property_activities"

        },
      },
    ]);
    //
    //
    res.status(200).json({
      success: true,
      data: investoredProperty[0] || null,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }

};



