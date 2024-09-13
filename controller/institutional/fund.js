const Fund = require('../../model/institutional/fund');
const InstitutionalUser = require('../../model/institutional/primaryContactDetails');
const { errorHandler } = require('../../utils/error');


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
    name_of_current_fund_investment,
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
       ...req.body,
       user: req.payload.userId
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
      ...isSubmitted,
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
        ...name_of_current_fund_investment && {name_of_current_fund_investment},
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

exports.getAllFunds = async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  const country = req?.query?.country;
  const status = req?.query?.status;
  const name = req?.query?.name;


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
        $match: {isAdmin_Approved: "approved", funding_state: "Ongoing"}
      },
      {
        $sort: {
          updatedAt: -1
        }
      }
    ]);

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

exports.getSingleFund = async (req, res) => {
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





