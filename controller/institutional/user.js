const InstitutionalUser = require('../../model/institutional/user');

exports.fundPurposeInquiry = async (req, res) => {
  try {
    console.log("req.payload", req.payload)

    const { userId } = req.payload;

    const {
      fund_purpose_inquiry,
      investor_accreditation_status,
      location_of_investment_region,
      capital_already_secured,
    } = req.body;

    let institutionalUser = await InstitutionalUser.findOne({ user: userId });

    if (institutionalUser) {
      return res.status(400).json({
        success: false,
        message: 'Funds purpose inquiry already exists',
      });
    }

    institutionalUser = new InstitutionalUser({
      user: userId,
      fund_purpose_inquiry,
      investor_accreditation_status,
      location_of_investment_region,
      capital_already_secured,
    });
    await institutionalUser.save();

    res.status(201).json({
      success: true,
      data: institutionalUser,
      message: 'Funds purpose inquiry added successfully',
    });
  } catch (error) {
    console.error('Error in addInstitutionalUserInfo:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
