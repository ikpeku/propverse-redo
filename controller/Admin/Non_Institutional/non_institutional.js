const Activities = require("../../../model/developer/property_activities")
const { errorHandler } = require("../../../utils/error")
const User = require("../../../model/user");
const Property = require("../../../model/developer/properties");
const Non_Institiutional_Investor = require("../../../model/non_institional/non_institutional");
const { ObjectId } = require("mongodb");

exports.uploadActivities = async(req,res,next) => {
    const {title,activity, documents} = req.body
    const {propId} = req.params

    try {
        await Activities.create({
            property:propId,
            title,
            activity,
            documents_type: documents[0].mimetype || ""
        })
        res.status(200).json({
          message: "success"
        })

    } catch (error) {
        next(errorHandler(400, "operation failed"))
        
    }

}

exports.uploadPropertyDoc = async(req, res, next) => {
  const {prodId} = req.params
  const {property_documents} = req.body

  try {

    property_documents.forEach(async(product) => {
      await Property.findByIdAndUpdate(
        prodId,
         { $push: { "property_detail.property_documents": product } },
         { new: true, useFindAndModify: false }
       );
    }) 
     
    res.status(200).json({
      message: "success"
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
                from: "property_investments",
                localField: "transactions",
                foreignField: "_id",
                as: "transaction_invested",
              },
            },
            {
              $addFields: {
                amount_invested: {
                "$sum": { $sum: "$transaction_invested.paid.amount"}
                }
  
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
              username: "user_detail.username",
              country:"user_detail.country",
              email:"user_detail.email",
              createdAt:"user_detail.createdAt",
              status: "$accreditation_status.status",
              _id: 1,
               amount_invested: 1
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
  }

exports.get_Suspended_All_Non_Institutional= async (req, res, next) => {
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
                from: "property_investments",
                localField: "transactions",
                foreignField: "_id",
                as: "transaction_invested",
              },
            },
            {
              $addFields: {
                amount_invested: {
                "$sum": { $sum: "$transaction_invested.paid.amount"}
                }
  
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
            {
              $match : {"user_detail.isSuspended": true}
            }


      ]


      query.push(
        {
            $project: {
              username :"user_detail.username",
              country:"user_detail.country",
              email:"user_detail.email",
              createdAt :"user_detail.createdAt",
              isSuspended:"user_detail.isSuspended",
              _id: 1,
               amount_invested: 1
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
  }


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
            amount_invested: {
            "$sum": { $sum: "$transactions.paid.amount"}
            }

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
          username:"user_detail.username",
          isSuspended:"user_detail.isSuspended",
          country:"user_detail.country",
          email: "user_detail.email",
          createdAt:"user_detail.createdAt",
          phone_number:"user_detail.phone_number",
          status: "$accreditation_status.status",
          amount_invested: 1,
          properties: 1,
          funds: 1,
          _id: 1,
          funds_Invested: {$size: "$funds"},
          property_Purchased: {$size: "$properties"}
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
  )




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






