const InstitutionalUser = require("../../../model/institutional/primaryContactDetails");
const { errorHandler } = require("../../../utils/error");
const { ObjectId } = require("mongodb");
const Funds = require("../../../model/institutional/fund");
const Kyc = require("../../../model/compliance/kyc");

exports.get_All_Institutional = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
  
    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;

    const status = req?.query?.status;


  const customLabels = {
    docs: 'data',
  };
    const options = {
      page,
      limit,
      customLabels
    };



    let query =  [
        {
           $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
                $unwind: "$user"
            },
        {
           $lookup: {
                from: "transactions",
                localField: "fundsRaise",
                foreignField: "_id",
                as: "property_invested",
              },
            },
            {
              $addFields:{
                fundSize: {
                 "$sum": { $sum: "$property_invested.paid.amount"}
                }
              }
            },
            {
                $lookup: {
                     from: "users",
                     localField: "limitedPartners",
                     foreignField: "_id",
                     as: "limitedPartners",
                   },
                 },
                

     {
            $project: {
              username: "$user.username",
              country:"$user.country",
              dateJoined:"$user.createdAt",
              fundSize: "$fundSize",
              limitedPartners: { $cond: { if: { $isArray: "$limitedPartners" }, then: { $size: "$limitedPartners" }, else: "NA"} },
              status: {
                $cond: { if: { $gte: [ "$user.verify_account", true ] }, then: "Verified", else: "Not Verified" }
              },
              _id: "$user._id",
              
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },

      ]



      if(searchText){

        query.push({
          $match: {
            $or: [
              { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { status: searchText},
              { fundSize: { $regex: ".*" + searchText + ".*", $options: "i" } },
            ]
          }
        })

    }

        
      if(status){
        query.push({
          $match: {status}
        })
      }
 


    try {
      const myAggregate = InstitutionalUser.aggregate(query);

  
  
      const paginationResult = await InstitutionalUser.aggregatePaginate(
        myAggregate,
        options
      );
   
  
      return res.status(200).json({ ...paginationResult });
    } catch (error) {

      next(errorHandler(500, "network error"));      
    }
  }


exports.get_Institutional = async (req, res, next) => {
    const {userId} = req.params

  let query =  [
    {
      $match: { user:  new ObjectId(userId)}
    },
        {
           $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
                $unwind: "$user"
            },
        {
           $lookup: {
                from: "transactions",
                localField: "fundsRaise",
                foreignField: "_id",
                as: "property_invested",
              },
            },
            {
              $addFields:{
                fundSize: {
                 "$sum": { $sum: "$property_invested.paid.amount"}
                }
              }
            },
            {
                $lookup: {
                     from: "users",
                     localField: "limitedPartners",
                     foreignField: "_id",
                     as: "limitedPartners",
                   },
                 },
               

     {
            $project: {
              username: "$user.username",
              avatar: "$user.avatar",
              email: "$user.email",
              contact: "$user.phone_number",
              country:"$user.country",
              dateJoined:"$user.createdAt",
              isSuspended:"$user.isSuspended",
              fundSize: "$fundSize",
              limitedPartners: { $cond: { if: { $isArray: "$limitedPartners" }, then: { $size: "$limitedPartners" }, else: "NA"} },
              status: {
                $cond: { if: { $gte: [ "$user.verify_account", true ] }, then: "Verified", else: "Not Verified" }
              },
              _id: "$user._id",
              
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },

      ]



    try {

        const OngoingFund = await Funds.find({funding_state : "Ongoing"})
        const isVerify = await Kyc.findById(userId).select("isApproved")
      const data = await InstitutionalUser.aggregate(query);


      return res.status(200).json({ ...data[0],isVerify:isVerify?.isApproved ,OngoingFund });


    } catch (error) {

      next(errorHandler(500, "network error"));      
    }
  }
