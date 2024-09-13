const Funds = require("../../../model/institutional/fund");

const { errorHandler } = require("../../../utils/error");
const { mailerController } = require("../../../utils/mailer");
const { GeneralMailOption } = require("../../../middleware/sendMail");

exports.fundsListedApproval = async (req, res, next) => {
  req.query.queryType = "fundsListedApproval";
  next();
};

exports.currentListed = async (req, res, next) => {
  req.query.queryType = "currentListed";
  next();
};

exports.FundsManagement = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  const country = req?.query?.country;
  const status = req?.query?.status;
  const name = req?.query?.name;

  const fundType = req.query.queryType;

  const options = {
    page,
    limit,
  };

  let query = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },

    {
              $sort: {
                updatedAt: -1,
              },
            }

    // {
    //    $lookup: {
    //         from: "transactions",
    //         localField: "transactions",
    //         foreignField: "_id",
    //         as: "property_invested",
    //       },
    //     },

    //     {
    //       $addFields:{
    //         amount_invested: {
    //          "$sum": { $sum: "$property_invested.paid.amount"}
    //         }
    //       }
    //     },

    //     {
    //       $addFields: {
    //         filerItem : {
    //          "$arrayElemAt": [ { "$filter" : {
    //             "input" : "$property_invested" ,
    //             "cond" : { "$eq" : [ "status", "Failed" ] }
    //           } } , 0 ]
    //         }
    //       }
    //     },
    // {
    //    $lookup: {
    //         from: "accreditations",
    //         localField: "accreditation",
    //         foreignField: "_id",
    //         as: "accreditation",
    //       },
    //     },
    //     {
    //       $addFields: {
    //         user_detail: {
    //           $arrayElemAt: ["$user", 0],
    //         },
    //       },
    //     },
    //     {
    //       $addFields: {
    //         accreditation_status: {
    //           $arrayElemAt: ["$accreditation", 0],
    //         },
    //       },
    //     },
  ];

  if (fundType == "fundsListedApproval") {
  
    query.push(
        {
            $project: {
             fundname: "$name",
              fund_manager_name: "$user.username",
              country:"$user.country",
              listed_date: "$createdAt",
             status: "$isAdmin_Approved",
             _id: 1,
            },
          },
        {
          $sort: {
            createdAt: -1,
          },
        }
      );

     
  }
  if (fundType == "currentListed") {
  
    query.push(
        {
            $project: {
             fundname: "$name",
              fund_manager_name: "$user.username",
              country:"$user.country",
              listed_date: "$createdAt",
              email: "$user.email",
             status: "$funding_state",
             _id: 1,
            },
          },
        {
          $sort: {
            createdAt: -1,
          },
        }
      );

     
  }




//   query.push(
//     // {
//     //     $project: {
//     //       username: "$user_detail.username",
//     //       country:"$user_detail.country",
//     //       email:"$user_detail.email",
//     //       createdAt:"$user_detail.createdAt",
//     //       status: "$accreditation_status.status" == "verified" ? "Accredited" : "$accreditation_status.status",
//     //       _id: 1,
//     //        amount_invested: 1,

//     //     },
//     //   },
//     {
//       $sort: {
//         createdAt: -1,
//       },
//     }
//   );

  if (searchText) {
    query.push({
      $match: {
        $or: [
          { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
          { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
          { email: { $regex: ".*" + searchText + ".*", $options: "i" } },
          { status: searchText },
          {
            amount_invested: {
              $regex: ".*" + searchText + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  if (country) {
    query.push({
      $match: { country: { $regex: ".*" + country + ".*", $options: "i" } },
    });
  }
  if (status) {
    query.push({
      $match: { status },
    });
  }
  if (name) {
    query.push({
      $match: { username: { $regex: name, $options: "i" } },
    });
  }

  try {
    const myAggregate = Funds.aggregate(query);

    const paginationResult = await Funds.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    // next(errorHandler(500, "network error"));
    next(errorHandler(500, error));
  }
};



exports.approveFund = async (req, res, next) => {
    req.body.isAdmin_Approved = "approved";
    next();
  };
  
//   "rejected", "pending", "approved"
  exports.rejectFund = async (req, res, next) => {
    req.body.isAdmin_Approved = "rejected";
    next();
  };

  
exports.unPauseFund = async (req, res, next) => {
    req.body.funding_state = "Ongoing";
    next();
  };
  
//   "rejected", "pending", "approved"
  exports.pauseFund = async (req, res, next) => {
    req.body.funding_state = "Pause";
    next();
  };




  exports.statusFund = async (req, res, next) => {
    const { fundId } = req.params;
    const { isAdmin_Approved, rejection_reason, funding_state , pause_reason} = req.body;
  
    try {

      const data = await Funds.findByIdAndUpdate(
        fundId,
        {
          ...isAdmin_Approved && {isAdmin_Approved},
         ...funding_state && {funding_state}
        },
        { new: true }
      ).populate("user");
  
      if (!data) {
        return next(errorHandler(500, "updated fail"));
      }
  
      if (isAdmin_Approved === "Rejected") {
        mailerController(
          GeneralMailOption({
            email: data.user.email,
            text: rejection_reason,
            title: "Propsverse Fund Rejection",
          })
        );
      }
  
      if (pause_reason) {
        mailerController(
          GeneralMailOption({
            email: data.user.email,
            text: pause_reason,
            title: "Propsverse Fund Pause",
          })
        );
      }
  
      
  
      return res.status(200).json({ status: "success" });
    } catch (error) {
      next(errorHandler(500, "updated fail"));
    }
  };

