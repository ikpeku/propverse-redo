// const Investment = require("../../model/developer/property_investment")
const Transactions = require("../../model/transaction/transactions");
const Property = require("../../model/developer/properties");
const Funds = require("../../model/institutional/fund");

const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
const { errorHandler } = require("../../utils/error");


exports.makeInvestmentOnproperty = async (req, res, next) => {
  const { userId } = req.params;
  const {
    prodId,
    paid: { amount, currency },
    proof_of_payment: { location, originalname, mimetype, size, key },
    payment_status,
    description,
    investmentType,
  } = req.body;

  try {
    const response = await Property.findById(prodId);

    if (!response) {
      return next(errorHandler(400, "confirm transact failed"));
    }

    const investment = await Transactions.create({
      investor: userId,
      company: response.user,
      transaction_type: "property purchase",
      property: prodId,
      name: response.property_detail.property_overview.property_name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.property_detail.property_overview.price.amount,
        currency: response.property_detail.property_overview.price.currency,
      },
      proof_of_payment: {
        location,
        originalname,
        mimetype,
        size,
        key,
      },
      payment_method: "bank  transfer",
      payment_status,
      description
    });


    if (investmentType === "property") {

      await Non_Institutional_Investor.findByIdAndUpdate(
        userId,
        { $push: { transactions: investment._id, properties: prodId } },
        { new: true, useFindAndModify: false }
      );
      await Property.findByIdAndUpdate(
        userId,
        { $push: { transactions: investment._id } },
        { new: true, useFindAndModify: false }
      );



    }

    return res
      .status(200)
      .json({
        status: "success",
        message: "congratulations record taken awaiting confirmation",
        // response,
      });
  } catch (error) {
    next(error);
    // next(errorHandler(400,"confirm transaction failed"))
  }
};

exports.makeInvestmentFunds = async (req, res, next) => {
  const { userId } = req.params;
  const {
    prodId,
    paid: { amount, currency },
    proof_of_payment: { location, originalname, mimetype, size, key },
    investmentType,
    description
  } = req.body;

  // console.log(req.body)
  // console.log(req.params)

  try {
    const response = await Funds.findById(prodId);

    if (!response) {
      return next(errorHandler(400, "confirm transact failed"));
    }

    const investment = await Transactions.create({
      investor: userId,
      transaction_type: "funds",
      funds: prodId,
      name: response.name,
      status: "Success",
      paid: {
        amount,
        currency,
      },
      property_amount: {
        amount: response.raise_goal.amount,
        currency: response.raise_goal.currency,
      },
      proof_of_payment: {
        location,
        originalname,
        mimetype,
        size,
        key,
      },

      payment_method: "bank  transfer",
      description
    });

    if (investmentType === "funds") {
      await Non_Institutional_Investor.findByIdAndUpdate(
        userId,
        { $push: { transactions: investment._id, funds: prodId } },
        { new: true, useFindAndModify: false }
      );
      
      await Funds.findByIdAndUpdate(
        userId,
        { $push: { investments: investment._id } },
        { new: true, useFindAndModify: false }
      );

    }

    return res
      .status(200)
      .json({
        status: "success",
        message: "congratulations record taken awaiting confirmation",
        // response,
      });
  } catch (error) {
    next(error);
    // next(errorHandler(400,"confirm transaction failed"))
  }
};

exports.getUserInvestment = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const data = await Transactions.find({ investor: userId }).populate(
      "property fund"
    );
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    next(errorHandler(400, "failed"));
  }
};

exports.getInvestmentById = async (req, res, next) => {
  const { prodId } = req.params;
  try {
    // populate("property")
    const data = await Transactions.findById(prodId);
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    next(errorHandler(400, "failed"));
  }
};
