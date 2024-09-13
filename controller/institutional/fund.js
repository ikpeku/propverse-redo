const Fund = require('../../model/institutional/fund');
const InstitutionalUser = require('../../model/institutional/primaryContactDetails');
const { errorHandler } = require('../../utils/error');

exports.createFund = async (req, res) => {
  try {

    // Check if the user's primary contail details is complete
    const institutionalUser = await InstitutionalUser.findOne({ user: req.payload.userId });

    if (!institutionalUser || !institutionalUser.isAccountComplete) {
      return res.status(400).json({
        success: false,
        message: 'Institutional user account is not complete. Please complete your account to create a fund.',
      });
    }

     const newFund = new Fund({
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
