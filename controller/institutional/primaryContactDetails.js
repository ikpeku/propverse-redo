const InstitutionalUser = require('../../model/institutional/primaryContactDetails');

exports.fundPurposeInquiry = async (req, res) => {
  try {
    const { userId } = req.payload;
    
    const { body } = req;

    let institutionalUser = await InstitutionalUser.findOne({ user: userId });

    institutionalUser = new InstitutionalUser({
      ...body,
      user: userId,
      isAccountComplete: true,
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
