const Fund = require('../../model/institutional/fund');
const InstitutionalUser = require('../../model/institutional/primaryContactDetails');
const { errorHandler } = require('../../utils/error');
const { ObjectId } = require("mongodb");
const Limited_partners = require("../../model/institutional/limitedpartners");

exports.submitFund = async (req, res, next) => {
  req.body.isSubmitted = true
  next()

}
exports.draftFund = async (req, res, next) => {
  req.body.isSubmitted = false
  next()
}

exports.createFund = async (req, res) => {
  const {fundId} = req.params

  const {
    isSubmitted,
    name,
description,
    thumbnails,
    property_type,
    investment_structure,
    location,
    raise_goal,
    minimum_investment,
    mininmum_hold_period,
    distribution_period,
    number_of_investors,
    loan_to_cost,
    annual_yield,
      deadline,

    // Fund Pitch
    pitch_deck_desc,
    pitch_deck_image,
    // name_of_current_fund_investment,
    current_fund_investment,
    key_fund_highlights,
    investment_strategy,

    //   FUNDS TERMS
    fund_terms,

    primary_target_market,

    distribution_and_fees,

    closing,

    reporting,

    // Fund Investment Team

    team_members,

    funds_documents,

    lock_fund,

    shareable_link,
  } = req.body
  try {

    // Check if the user's primary contail details is complete
    const institutionalUser = await InstitutionalUser.findOne({ user: req.payload.userId });

    if (!institutionalUser || !institutionalUser.isAccountComplete) {
      return res.status(400).json({
        success: false,
        message: 'Institutional user account is not complete. Please complete your account to create a fund.',
      });
    }



    const FundItem = await Fund.findById(fundId)
       
    if(!FundItem) {
      const newFund = new Fund({
        _id: fundId,
      //  ...req.body,
       user: req.payload.userId,
       ...isSubmitted && {isSubmitted},
       ...name && {name},
       ...description && {description},
           ...thumbnails && {thumbnails},
           ...property_type && {property_type},
           ...investment_structure && {investment_structure},
           ...location && {location},
           ...raise_goal?.amount && {"raise_goal.amount": raise_goal?.amount},
           ...raise_goal?.currency && {"raise_goal.currency": raise_goal?.currency},
           ...minimum_investment?.amount && {"minimum_investment.amount": minimum_investment?.amount},
           ...minimum_investment?.currency && {"minimum_investment.currency": minimum_investment?.currency},
        
           ...mininmum_hold_period && {mininmum_hold_period},
           ...distribution_period && {distribution_period},
           ...number_of_investors && {number_of_investors},
           ...loan_to_cost && {loan_to_cost},
           ...annual_yield && {annual_yield},
           ...deadline && {deadline},
       
           // Fund Pitch
           ...pitch_deck_desc && {pitch_deck_desc},
         ...pitch_deck_image && {pitch_deck_image},
         ...current_fund_investment && {current_fund_investment},
         ...key_fund_highlights && {key_fund_highlights},
           ...investment_strategy && {investment_strategy},
       
           ...fund_terms && {fund_terms},
          ...primary_target_market && {primary_target_market},
          ...distribution_and_fees && {distribution_and_fees},
          ...closing && {closing},
          ...reporting && {reporting},
       
           ...team_members && {team_members},
           ...funds_documents && {funds_documents},
           ...lock_fund && {lock_fund},
           ...shareable_link && {shareable_link: shareable_link}
     });
     
     // Save the fund
     const savedFund = await newFund.save();
  
     res.status(201).json({
       success: true,
       data: savedFund,
       message: 'Fund created successfully',
     });

    } else {
   
     // Save the fund
     const savedFund = await Fund.findByIdAndUpdate(fundId, {$set: {
      ...{isAdmin_Approved: "pending"},
      ...isSubmitted && {isSubmitted},
      ...name && {name},
      ...description && {description},
          ...thumbnails && {thumbnails},
          ...property_type && {property_type},
          ...investment_structure && {investment_structure},
          ...location && {location},
          ...raise_goal?.amount && {"raise_goal.amount": raise_goal?.amount},
          ...raise_goal?.currency && {"raise_goal.currency": raise_goal?.currency},
          ...minimum_investment?.amount && {"minimum_investment.amount": minimum_investment?.amount},
          ...minimum_investment?.currency && {"minimum_investment.currency": minimum_investment?.currency},
       
          ...mininmum_hold_period && {mininmum_hold_period},
          ...distribution_period && {distribution_period},
          ...number_of_investors && {number_of_investors},
          ...loan_to_cost && {loan_to_cost},
          ...annual_yield && {annual_yield},
          ...deadline && {deadline},
      
          // Fund Pitch
          ...pitch_deck_desc && {pitch_deck_desc},
        ...pitch_deck_image && {pitch_deck_image},
        ...current_fund_investment && {current_fund_investment},
        ...key_fund_highlights && {key_fund_highlights},
          ...investment_strategy && {investment_strategy},
      
          ...fund_terms && {fund_terms},
         ...primary_target_market && {primary_target_market},
         ...distribution_and_fees && {distribution_and_fees},
         ...closing && {closing},
         ...reporting && {reporting},
      
          ...team_members && {team_members},
          ...funds_documents && {funds_documents},
          ...lock_fund && {lock_fund},
          ...shareable_link && {shareable_link: shareable_link}
     }},{new: true});

 
  
     res.status(201).json({
       success: true,
       data: savedFund,
       message: 'Fund draft successfully',
     });

    }




  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.AllApprovedFunds = async (req, res, next) => {
   req.body.isAdmin_Approved = "approved";
   req.body.funding_state = "Ongoing";
   next()
}

exports.AllUserSubmitFunds = async (req, res, next) => {
  req.query.user = req.payload.userId;
  req.body.isSubmitted = true;
  next()
}
exports.AllUserDraftFunds = async (req, res, next) => {
  req.query.user = req.payload.userId;
  req.body.isSubmitted = false;
  next()
}

exports.AllUserFunds = async (req, res, next) => {
  req.query.user = req.payload.userId;
  next()
}


exports.getAllFunds = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  const country = req?.query?.country;
  const status = req?.query?.status;
  const name = req?.query?.name;


  // console.log("data: ",req.body)
  // console.log("user: ",req.query.user)
  // console.log("payload: ",req.payload)


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
      $match: {...req.body}
    },
    {
      $sort: {
        updatedAt: -1
      }
    }
  ]


if(req?.query?.user){
  query.unshift({
    $match: {user: new ObjectId(req?.query?.user)}
  })
}



  
  try {
    const allFunds = Fund.aggregate(query);

    const paginationResult = await Fund.aggregatePaginate(
      allFunds,
      options
    );

    res.status(200).json({
      success: true,
      count: allFunds.length,
       ...paginationResult,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }


};

exports.getSingleFund = async (req, res,next ) => {
  try {
    const fund = await Fund.findById(req.params.id);

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    res.status(200).json({
      success: true,
      data: fund,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(errorHandler(400, "Invalid Fund ID"));
    }
    next(errorHandler(500, "Server Error"));
  }
};


exports.fundtransationdatail = async(req, res) => {


  try {
    const fund = await Fund.findById(req.params.fundId);

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    res.status(200).json({
      success: true,
      data: fund,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(errorHandler(400, "Invalid Fund ID"));
    }
    next(errorHandler(500, "Server Error"));
  }

}


exports.getFundOverview = async (req, res, next) => {
  const {fundId} = req.params;


  const query = [
    {
      $match: {_id: fundId}
    },

    {
      $lookup: {
           from: "transactions",
           localField: "investments",
           foreignField: "_id",
           as: "payin",
         },
       },
       {
         $addFields: {
           fund_size: {
           "$sum": { $sum: "$payin.paid.amount"}
           }

         },
       },
    {
      $lookup: {
           from: "transactions",
           localField: "payout",
           foreignField: "_id",
           as: "payout",
         },
       },
       {
         $addFields: {
           capital_invested: {
           "$sum": { $sum: "$payout.paid.amount"}
           }

         },
       },

       {
        $addFields: {
          number_of_properties: "$funds_holdings.project_investments"
        }
       },
      //  {
      //   $addFields: {
      //     number_of_properties: {$count: "$funds_holdings.project_investments"} 
      //   }
      //  },

      {
        $project: {
          fund_size: 1,
          capital_invested: 1,
          // number_of_properties: {$count: {"$number_of_properties"}}
        },
      },

    {
      $sort: {
        updatedAt: -1
      }
    }
  ]


// if(req?.query?.user){
//   query.unshift({
//     $match: {user: new ObjectId(req?.query?.user)}
//   })
// }



  
  try {
    const data = await Fund.aggregate(query);

    // const paginationResult = await Fund.aggregatePaginate(
    //   allFunds,
    //   options
    // );

    res.status(200).json({
      success: true,
      data
      // count: allFunds.length,
      //  ...paginationResult,
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }


};

exports.getHoldingsProject = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;
  const {fundId} = req.params;

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
    const allFunds = Fund.aggregate([
      {

        $match: {_id: fundId}
      },

      {
        $lookup: {
             from: "properties",
             localField: "funds_holdings.project_investments",
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

    const paginationResult = await Fund.aggregatePaginate(
      allFunds,
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


exports.userHoldingFunds = async (req, res, next) => {
  req.query.type = "userHolding"
  next()

}





exports.fundHoldingFunds = async (req, res, next) => {
  req.query.type = "fundHolding"
  next()
}


exports.getHoldingsFunds = async (req, res, next) => {
const {fundId} = req.params
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


  const query = []

  if(req.query.type == "fundHolding"){
    query.push(
      {
        $match: {fund: fundId}
      },
    )
  }

  if(req.query.type = "userHolding"){
    query.push(
      {
        $match: { user:  new ObjectId(req.payload.userId)}
      },
    )
  }

 
  query.push(
    {
      $lookup: {
        from: "funds",
        localField: "fund",
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
    {
      $addFields: {
        invested_capital_diff: { $divide: ["$capital_deploy.amount", "$capital_deploy.amount"] }
      }
    },
    
    {
      $project: {
        fundname: "$fund.name",
        property_type: "$fund.property_type",
        invested_capital: "$capital_deploy",
        current_fund_value: "$capital_deploy.amount",
        annual_yield: "$fund.annual_yield",
        investment_date: "$updatedAt",
        fundId: "$fund._id",
        userId: "$fund.user",
        thumbnails: "$fund.thumbnails",
        invested_capital_percentage: {$multiply :["$invested_capital_diff", 0.1]},
      },
    },
  )


  
  try {
    const limitedPartners =  Limited_partners.aggregate(query);

    const paginationResult = await Limited_partners.aggregatePaginate(
      limitedPartners,
      options
    );

    res.status(200).json({
      success: true,
     ...paginationResult,     
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }
}


exports.getFundPortfolio = async (req, res, next) => {
  const {fundId} = req.params;


  const query = [
    {
      $match: {_id: fundId}
    },

    {
      $lookup: {
           from: "transactions",
           localField: "investments",
           foreignField: "_id",
           as: "payin",
         },
       },
       {$unwind: "$payin"},

       {
        $group: {
          _id: "$payin.name",
          accumulated_price: { $sum: "$payin.paid.amount"}
        }
       }
  ]

  
  try {
    const data = await Fund.aggregate(query);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(errorHandler(500, "server error"));
  }


};

exports.userIvestmentFundById = async (req, res, next) =>{
  const {partnerId} = req.params;


  const query = [
    {
      $match: {_id: new ObjectId(partnerId)}
    },
    {
      $lookup: {
        from: "funds",
        localField: "fund",
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

    // {
    //   $lookup: {
    //        from: "transactions",
    //        localField: "investments",
    //        foreignField: "_id",
    //        as: "payin",
    //      },
    //    },

      //  {$unwind: "$payin"},





      //  {
      //   $addFields: {
      //     year_diff: {$substract: [{$year: "$createdAt"}, {$year: new Date()}]}
      //   }
      //  },
       {
        $addFields: {
          current_year:{$year: new Date()}
        }
       },


       {
        $addFields: {
          investment_increase_percentage:{$multiply:  [{ $divide: ["$fund_detail.annual_yield", 100]}, {$divide : ["$capital_deploy.amount", 100]} ]}
        }
       },



      {
        $project: {
          // root: "$$ROOT",
          // year_diff: 1,
          // current_year: 1,
          "property.name": "$fund_detail.name",
          "property.property_type": "$fund_detail.property_type",
          funds_documents: "$fund_detail.funds_documents",
          "property.distribution_period": "$fund_detail.distribution_period",
          "property.investment_date": "$updatedAt",
          "earnings.annual_yield": "$fund_detail.annual_yield",
          "earnings.capital_invested": "$capital_deploy",
          "earnings.current_value": { $add: ["$investment_increase_percentage", "$capital_deploy.amount"]}
        }
      }
  ]

  
  try {
    const data = await Limited_partners.aggregate(query);

    res.status(200).json({
      success: true,
      data: data[0] || null
    });
  } catch (error) {
    next(error);
    // next(errorHandler(500, "server error"));
  }
}