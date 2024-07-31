const { errorHandler } = require('../../utils/error');

exports.checkInstitutionalUser = (req, res, next) => {
  try {
    const { userId, status } = req.payload;

    if (!userId) {
      return next(errorHandler(401, 'Login is required'));
    }

    if (status === 'Institutional Investor') {
      req.userId = userId;
      next();
    } else {
      return next(
        errorHandler(
          403,
          'Access denied. Only institutional investors can create funds'
        )
      );
    }
  } catch (error) {
    console.error('Middleware Error:', error);
    return next(
      errorHandler(500, 'An error occurred while processing the request')
    );
  }
};
