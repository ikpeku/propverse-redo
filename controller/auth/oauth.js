const { validationResult } = require("express-validator");
const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid")

const authToken = require("../../middleware/refreshToken");

exports.googleAuth = async (req, res, next) => {
  const errors = validationResult(req);
  const authTokenInit = new authToken();
  const { email, userName, account_type, avatar, refId } = req.body;


  const maxAge = 1000 * 60 * 60 * 24 * 7;

  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    const userdata = await User.findOne({ email }).select("-password");

    let devInfo = {};
    // let userInfo = {}
    let status = "";

    // if (account_type === "Project manager") {
    //   status = "Developer";
    // }

    if (userdata) {

      // const token = jwt.sign(
      //   { email, userId: userdata._id.toString() },
      //   process.env.JWT_SIGN,
      //   { expiresIn: maxAge }
      // );
      const token = await authTokenInit.createToken(userdata);

      // const expiredTokenDate = new Date(Date.now() + 3600000);

      // if (userdata.account_type === "Project manager") {
      //   // const info = await User.findByIdAndUpdate(userdata._id, { status: "Developer" });
      //   const res = await Developer.findOne({ _id: userdata._id });
      //   devInfo = res;
      //   // userInfo = info
      // }


      // const rest = devInfo?._doc
      // let devData = {}
      // if (userdata?.account_type === "Project manager") {
      //   const { _id, _v: v, ...restdata } = rest;

      //   devData = restdata

      // }


      // const { _v, ...restInfo } = userdata?._doc;
      // // _id: id,
      // let userData = { ...restInfo, ...devData };

      res
        // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
        .status(200)
        .json({
          message: "Login you successful",
          data: userData,
          token: token.token,
          expiresIn: token.expiredAt,
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      const name = userName;

      const referralId = uuidv4().split("-")[1]

      const data = await User.create({
        username: name,
        password: hashedPassword,
        email,
        account_type,
        phone_number: "08 XXX XXXX",
        verify_account: true,
        avatar,
        status,
        referral:{referralId}
      });


      if(refId) {
        
        const refdata = await User.findOne({verify_account: true}).where('referral.referralId').equals(refId).exec()

        if(refdata) {
          refdata.referral.award += 10;
          refdata.referral.number_of_referral += 1;

          refdata.save()
          
        }

      }


    //   // let devInfo = {}
    //   if (data.account_type === "Project manager") {
    //     // const info = await User.findByIdAndUpdate(data._id, { status: "Developer" });
    //     const res = await Developer.create({ _id: data._id });
    //     devInfo = res;
    //   } else {
    //     await KYC.create({ _id: data._id, user: data._id });
    //   }

    //   if(data.account_type === "Institutional Investor"){
    //     const res = await InstitutionalInvestorDetail.create({ _id: userId , user: userId})
    //     devInfo = res
    // }


      // const token = jwt.sign(
      //   { email: data.email, userId: data._id.toString() },
      //   process.env.JWT_SIGN,
      //   { expiresIn: maxAge }
      // );

      const token = await authTokenInit.createToken(data);

      // const expiredTokenDate = new Date(Date.now() + 3600000);


      // const rest = devInfo?._doc
      // let devData = {}
      // if (data.account_type === "Project manager" || data.account_type === "Institutional Investor") {
      //   const { _id, _v: v, ...restdata } = rest;

      //   devData = restdata

      // }

      // const { _v, password, ...restInfo } = data?._doc;

      // let userData = { ...restInfo, ...devData };

      // const  expiredTokenDate = new Date(maxAge)

      // return res
      //     .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
      res.status(200).json({
        success: true,
        message: "user signup successfully",
        data: userData,
        token: token.token,
        expiresIn: token.expiredAt,
      });
    }
  } catch (error) {
    next(error);
  }
};
