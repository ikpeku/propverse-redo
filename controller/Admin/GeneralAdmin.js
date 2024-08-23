
const { errorHandler } = require("../../utils/error")
const User = require("../../model/user");
const Kyc = require("../../model/compliance/kyc");
const PayInTransaction = require("../../model/transaction/transactions");
const Compliance = require("../../model/compliance/accreditation");
const { mailerController } = require("../../utils/mailer");
const { GeneralMailOption } = require("../../middleware/sendMail");


exports.suspendUserAccount = async(req,res,next) => {
    const {userId} = req.params
  
    try {
     const response = await User.findById(userId);
  
     response.isSuspended = !response.isSuspended
     response.save()

     res.status(200).json({
        message: "success"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }

  
exports.kycVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason, isRejected} = req.body
  
    try {
     const response = await Kyc.findById(userId).populate("user");

     if(!response) {
      return next(errorHandler(401,"user not found"))
    }
  
    if(isRejected) {
      response.isApproved = false
    } else {
      response.isApproved = true
    }

     response.save()


     if(isRejected) {
      mailerController(
        GeneralMailOption({
          email: response?.user?.email,
          text: rejectreason,
          title: "Propsverse Kyc Rejection",
        })
      );
  
    }

     res.status(200).json({
        message: "success",
        data: isRejected ? "kyc rejected successfully" : "kyv approved successfully"
     })
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  
exports.complianceVerification = async(req,res,next) => {
    const {userId} = req.params
    const {rejectreason,isRejected} = req.body
    
    try {
      const response = await Compliance.findById(userId).populate("user");

      if(!response) {
        return next(errorHandler(401,"user not found"))
      }
  

  await Compliance.findByIdAndUpdate(userId, {$set: {status: isRejected ? "rejected" : "verified" }})


  if(isRejected) {
    mailerController(
      GeneralMailOption({
        email: response?.user?.email,
        text: rejectreason,
        title: "Propsverse compliance Rejection",
      })
    );

  }

     res.status(200).json({
        message: "success",
        data: isRejected ? "compliance rejected successfully" : "compliance approved successfully",
     })
      
      
    } catch (error) {
      next(errorHandler("operation failed"))
      
    }
  
  }
  

  exports.get_Transactions = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
  
    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;
    const country = req?.query?.country;
    const status = req?.query?.status;
    const name = req?.query?.name;

  
  
  
    const options = {
      page,
      limit,
    };
  
  
  
    let query =  []
    // 'Institutional Investor',
    // 'Developer',
    // 'Non-Institutional Investor',
    // 'Admin',
     
      if(req.payload.status == 'Non-Institutional Investor'){
         query.push(
        {
            $project: {
              name: 1,
              description: 1,
              paid: 1,
              transaction_type: 1,
              createdAt: 1,
              status: 1,
              _id: 1
            },
          }
      )
      }





  
  
      if(searchText){
  
        query.push({
          $match: {
            $or: [
              { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { verify_type: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { status: searchText}
            ]
          }
        })
  
        
      }
      
      if(country){
        query.push({
          $match: { country: { $regex: ".*" + country + ".*", $options: "i" } }
        })
      }
      if(status){
        query.push({
          $match: {status}
        })
      }
      if(name){
        query.push({
          $match: {username: { $regex: name, $options: "i" } }
        })
      }
  
      // console.log(req.payload)

       query.push(
       
          {
            $sort: {
              updatedAt: -1,
            },
          },
      )
  
    try {
      const myAggregate =  PayInTransaction.aggregate(query);
  
      const paginationResult = await PayInTransaction.aggregatePaginate(
        myAggregate,
        options
      );
  
      return res.status(200).json({ status: "success", data: paginationResult });
    } catch (error) {
      // next(errorHandler(500, "network error"));
      next(errorHandler(500, error));
      
    }
  }
  
  