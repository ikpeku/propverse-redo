const jwt = require("jsonwebtoken");

class authToken {
  createToken = async function (user) {
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    let expiredAt = new Date().getSeconds() + maxAge;

    let token = jwt.sign(
      { email: user.email, userId: user._id.toString() , status: user.account_type},
      process.env.JWT_SIGN,
      { expiresIn: expiredAt }
    );

    return { token, expiredAt };
  };

  verifyExpiration = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SIGN);

    return decodedToken.exp < new Date().getSeconds();
  };
  //   return authToken;
}

module.exports = authToken;


