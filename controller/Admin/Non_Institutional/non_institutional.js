const Activities = require("../../../model/developer/property_activities")
const { errorHandler } = require("../../../utils/error")
const User = require("../../../model/user");
const Non_Institiutional_Investor = require("../../../model/non_institional/non_institutional");
const { ObjectId } = require("mongodb");

exports.uploadActivities = async(req,res,next) => {
    const {title,activity, documents} = req.body
    const {propId} = req.params

    // console.log(req.params)
    // console.log(req.body)

    try {
        await Activities.create({
            property:propId,
            title,
            activity,
            documents_type: documents[0].mimetype || ""
        })
    } catch (error) {
        next(errorHandler(400, "operation failed"))
        
    }

}



exports.get_All_Non_Institutional = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
  
    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;
  
    // const { userId } = req.params;
  
    //   const { userId: payloadUserId, status } = req.payload;
  
    const options = {
      page,
      limit,
    };



    let query =  [
        // {
        //   $match: { account_type: "Non-Institutional Investor" }
        // },
        {
           $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
        {
           $lookup: {
                from: "accreditations",
                localField: "accreditation",
                foreignField: "users",
                as: "accreditation",
              },
            },
            {
              $addFields: {
                user_detail: {
                  $arrayElemAt: ["$user", 0],
                },
              },
            },
            {
              $addFields: {
                accreditation_status: {
                  $arrayElemAt: ["$accreditation", 0],
                },
              },
            },


      ]


      query.push(
        {
            $project: {
              "user_detail.username": 1,
              "user_detail.country": 1,
              "user_detail.email": 1,
              "user_detail.createdAt": 1,
              "accreditation_status.status": 1,
              _id: 1,
    // ammount_invested: 1
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
      )


      if(searchText){
        query.push({
          $match: { "user_detail.username": { $regex: ".*" + searchText + ".*", $options: "i" } }
        })
      }


      // 
    try {
      const myAggregate = Non_Institiutional_Investor.aggregate(query);
  
      const paginationResult = await Non_Institiutional_Investor.aggregatePaginate(
        myAggregate,
        options
      );
  
      return res.status(200).json({ status: "success", data: paginationResult });
    } catch (error) {
      next(errorHandler(500, "bad request"));
    }
  };


exports.get_Suspended_All_Non_Institutional = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
  
    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;
  
    // const { userId } = req.params;
  
    //   const { userId: payloadUserId, status } = req.payload;
  
    const options = {
      page,
      limit,
    };



    let query =  [
        {
          $match: { account_type: "Non-Institutional Investor" , isSuspended: true}
        },
        {
            $lookup: {
              from: "property_investments",
              localField: "transactions",
              foreignField: "investor",
              as: "transactions_lookup",
            },
          },
          {
            $addFields: {
              ammount_invested: {
                $sum: "$transactions_lookup.paid.amount",
              },
            },
          },
      ]


      if(searchText){
        query.push({
          $match: { username: { $regex: ".*" + searchText + ".*", $options: "i" } }
        })
      }




      query.push(
        {
            $project: {
              username: 1,
              country: 1,
              email: 1,
              createdAt: 1,
              _id: 1,
              isSuspended: 1,
    ammount_invested: 1
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
      )


  
    try {
      const myAggregate = User.aggregate(query);
  
      const paginationResult = await User.aggregatePaginate(
        myAggregate,
        options
      );
  
      return res.status(200).json({ status: "success", data: paginationResult });
    } catch (error) {
      next(errorHandler(500, "bad request"));
    }
  };


exports.get_Non_Institutional = async (req, res, next) => {
  const {userId} = req.params


 
  let query =  [
    {
      $match: { _id:  new ObjectId(userId)}
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
       $lookup: {
            from: "accreditations",
            localField: "accreditation",
            foreignField: "users",
            as: "accreditation",
          },
        },
    {
       $lookup: {
            from: "funds",
            localField: "fund",
            foreignField: "_id",
            as: "funds",
          },
        },
    {
       $lookup: {
            from: "properties",
            localField: "properties",
            foreignField: "_id",
            as: "properties",
          },
        },
    {
       $lookup: {
            from: "property_investments",
            localField: "transactions",
            foreignField: "_id",
            as: "transactions",
          },
        },

        
        {
          $addFields: {
            user_detail: {
              $arrayElemAt: ["$user", 0],
            },
          },
        },
        {
          $addFields: {
            accreditation_status: {
              $arrayElemAt: ["$accreditation", 0],
            },
          },
        },


  ]


//   query.push(
//     {
//         $project: {
//           "user_detail.username": 1,
//           "user_detail.country": 1,
//           "user_detail.email": 1,
//           "user_detail.createdAt": 1,
//           "user_detail.phone_number": 1,
//           "accreditation_status.status": 1,
//           transactions: 1,
//           properties: 1,
//           funds: 1,
//           _id: 1,
//           // user_detail: 1
// // ammount_invested: 1
//         },
//       },
//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//   )




  try {


    const user = await Non_Institiutional_Investor.aggregate(query);

    // const user = await Non_Institiutional_Investor.findById(userId).populate("user transactions properties funds accreditation")

    res.status(200).json({
      data: user
    })
    
  } catch (error) {
    next(errorHandler(500, "failed"))
  }

}








// exports.get_All_Non_Institutional = async (req, res, next) => {
//     const page = parseInt(req?.query?.page) || 1;
  
//     const limit = parseInt(req?.query?.limit) || 10;
//     const searchText = req?.query?.searchText;
  
//     const { userId } = req.params;
  
//     //   const { userId: payloadUserId, status } = req.payload;
  
//     const options = {
//       page,
//       limit,
//     };



//     let query =  [
//         {
//           $match: { account_type: "Non-Institutional Investor" }
//         },
//         {
//             $lookup: {
//               from: "property_investments",
//               localField: "transactions",
//               foreignField: "investor",
//               as: "transactions_lookup",
//             },
//           },
//           {
//             $addFields: {
//               ammount_invested: {
//                 $sum: "$transactions_lookup.paid.amount",
//               },
//             },
//           },
//       ]


//       if(searchText){
//         query.push({ username: { $regex: ".*" + searchText + ".*", $options: "i" } })
//       }




//       query.push(
//         {
//             $project: {
//               username: 1,
//               country: 1,
//               email: 1,
//               createdAt: 1,
//               _id: 1,
//     "accreditation.status": 1,
//     ammount_invested: 1
//             },
//           },
//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },
//       )


  
//     try {
//       const myAggregate = User.aggregate(query);
  
//       const paginationResult = await User.aggregatePaginate(
//         myAggregate,
//         options
//       );
  
//       return res.status(200).json({ status: "success", data: paginationResult });
//     } catch (error) {
//       next(errorHandler(500, "bad request"));
//     }
//   };







// exports.get_Single_Non_Institutional = async(req,res,next) => {
//   const {} = req.params
//   try {
    
//   } catch (error) {
    
//   }
// }




