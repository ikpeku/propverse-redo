
const Investment = require("../../model/developer/property_investment")
const Property = require("../../model/developer/properties");
const Non_Institutional_Investor = require("../../model/non_institional/non_institutional");
const { errorHandler } = require("../../utils/error");


exports.makeInvestment = async(req,res,next) => {
    const {userId} = req.params;
    const {
      prodId,
   paid: {
      amount,
      currency
      },
    proof_of_payment: {
      location,
      originalname,
      mimetype,
      size,
      key
      }
    } = req.body;


    try {
      
        const response = await Property.findById(prodId)

        if(!response){
            return next(errorHandler(400,"confirm transact failed"))
        }


       const investment = await Investment.create({
            investor:userId,
            company: response.user,
            property: prodId,
            status: "Success",
            paid: {
                    amount,
                    currency
                  },
                  proof_of_payment: {
                    location,
                    originalname,
                    mimetype,
                    size,
                    key
                  }

        })

       

        
      const tran = await Non_Institutional_Investor.findByIdAndUpdate(
           userId,
            { $push: { transactions: investment._id, properties: prodId } },
            { new: true, useFindAndModify: false }
          );
          
    
    
     return res.status(200).json({status:"success", message: "congratulations record taken awaiting confirmation"});
       
    } catch (error) {
next(error)
        // next(errorHandler(400,"confirm transaction failed"))
    }

}

exports.getUserInvestment = async(req,res,next) => {
    const {userId} = req.params;
    try {
        
        const data = await Investment.find({investor:userId}).populate("property")
        return res.status(200).json({status:"success", data});
    } catch (error) {
        next(errorHandler(400,"failed"))
    }

}


exports.getInvestmentById = async(req,res,next) => {
    const {prodId} = req.params;
    try {
        // populate("property")
        const data = await Investment.findById(prodId)
        return res.status(200).json({status:"success", data});
    } catch (error) {
        next(errorHandler(400,"failed"))
    }

}