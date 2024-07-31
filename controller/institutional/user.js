const InstitutionalUser = require('../../model/institutional/user');
const User = require('../models/user');

exports.updateUserToInstitutionalUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      funds,
      fund_purpose_inquiry,
      investor_accreditation_status,
      location_of_investment_region,
      capital_already_secured,
    } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new InstitutionalUser document
    const institutionalUser = new InstitutionalUser({
      user: userId,
      funds,
      fund_purpose_inquiry,
      investor_accreditation_status,
      location_of_investment_region,
      capital_already_secured,
    });

    await institutionalUser.save();

    await user.save();

    res
      .status(201)
      .json({ message: 'User updated to institutional investor successfully' });
  } catch (error) {
    console.error('Error updating user to institutional investor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
