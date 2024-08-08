const Fund = require('../../model/institutional/fund');
const InstitutionalUser = require('../../model/institutional/primaryContactDetails')

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
  try {
    const allFunds = await Fund.find();

    res.status(200).json({
      success: true,
      count: allFunds.length,
      data: allFunds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
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
      return res.status(400).json({
        success: false,
        error: 'Invalid Fund ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
