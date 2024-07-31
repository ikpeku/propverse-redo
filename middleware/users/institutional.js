require('dotenv').config();
const User = require('../../model/user');
const { errorHandler } = require('../../utils/error');

const authInstitutionalUser = async (req, res, next) => {
  try {
    const id = req.id;
    if (id) {
      const user = await User.findById(id);

      if (!user) {
        throw errorHandler(404, 'Account not found!');
      }

      if (!user.account_type === 'Institutional Investor') {
        throw errorHandler(403, 'Account is not an Institutional Investor!'); 
      }

      next();
    } else {
      throw errorHandler(401, 'Please login!'); 
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authInstitutionalUser };
