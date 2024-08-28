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
    const country = req?.query?.country;
    const status = req?.query?.status;
    const name = req?.query?.name;

  
    const options = {
      page,
      limit,
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
           $lookup: {
                from: "transactions",
                localField: "transactions",
                foreignField: "_id",
                as: "property_invested",
              },
            },
            

            {
              $addFields:{
                amount_invested: {
                 "$sum": { $sum: "$property_invested.paid.amount"}
                }
              }
            },

            {
              $addFields: {
                filerItem : {
                 "$arrayElemAt": [ { "$filter" : {
                    "input" : "$property_invested" ,
                    "cond" : { "$eq" : [ "status", "Failed" ] }
                  } } , 0 ]
                }
              }
            },
        {
           $lookup: {
                from: "accreditations",
                localField: "accreditation",
                foreignField: "_id",
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

        // { $unwind: "$property_invested" },
        // { $match: { "property_invested.status": "Failed" } },

        // {
        //   $group: {
        //     _id: "$_id",  // Group by the document's unique identifier
        //     property_invested: { $push: "$property_invested" },  // Rebuild the property_invested array
        //     amount_invested: { $sum: "$property_invested.paid.amount" } , // Calculate the total sum
        //     user_detail: { $push: "$user_detail" } , // Calculate the total sum
        //     accreditation_status: { $push: "$accreditation_status" }  // Calculate the total sum
        //   }
        // },
        {
            $project: {
              username: "$user_detail.username",
              country:"$user_detail.country",
              email:"$user_detail.email",
              createdAt:"$user_detail.createdAt",
              status: "$accreditation_status.status" == "verified" ? "Accredited" : "$accreditation_status.status",
              _id: 1,
               amount_invested: 1,
              
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
          $match: {
            $or: [
              { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { email: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { status: searchText},
              { amount_invested: { $regex: ".*" + searchText + ".*", $options: "i" } },
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


    try {
      const myAggregate = Non_Institiutional_Investor.aggregate(query);
  
      const paginationResult = await Non_Institiutional_Investor.aggregatePaginate(
        myAggregate,
        options
      );
  
      return res.status(200).json({ status: "success", data: paginationResult });
    } catch (error) {
      // next(errorHandler(500, "network error"));
      next(errorHandler(500,error));
      
    }
  }


exports.get_Suspended_All_Non_Institutional= async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
  const country = req?.query?.country;
  const name = req?.query?.name;
  



    const options = {
      page,
      limit,
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
              $lookup: {
                   from: "transactions",
                   localField: "transactions",
                   foreignField: "_id",
                   as: "property_invested",
                 },
               },
               {
                 $addFields: {
                   amount_invested: {
                   "$sum": { $sum: "$property_invested.paid.amount"}
                   }
     
                 },
               },
        {
           $lookup: {
                from: "accreditations",
                localField: "accreditation",
                foreignField: "_id",
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
              username : "$user_detail.username",
              country: "$user_detail.country",
              email: "$user_detail.email",
              createdAt : "$user_detail.createdAt",
              isSuspended: "$user_detail.isSuspended",
              status: "$accreditation_status.status" == "verified" ? "Accredited" : "Non Accredited",
              _id: 1,
               amount_invested: 1
            },
          },
           {
              $match : {isSuspended: true}
            },
          {
            $sort: {
              createdAt: -1,
            },
          },
      )


      if(searchText){

        query.push({
          $match: {
            $or: [
              { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { email: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { amount_invested: { $regex: ".*" + searchText + ".*", $options: "i" } },
            ]
          }
        })

        
      }
      
      if(country){
        query.push({
          $match: { country: { $regex: ".*" + country + ".*", $options: "i" } }
        })
      }
     
      if(name){
        query.push({
          $match: {username: { $regex: name, $options: "i" } }
        })
      }


    try {
      const myAggregate = Non_Institiutional_Investor.aggregate(query);
  
      const paginationResult = await Non_Institiutional_Investor.aggregatePaginate(
        myAggregate,
        options
      );
  
      return res.status(200).json({ status: "success", data: paginationResult });
    } catch (error) {
      next(errorHandler(500, error));
      // next(errorHandler(500, "bad request"));
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
            from: "kycs",
            localField: "kyc",
            foreignField: "_id",
            as: "kyc",
          },
        },
    {
       $lookup: {
            from: "funds",
            localField: "funds",
            foreignField: "_id",
            as: "funds",
          },
        },
    {
       $lookup: {
            from: "properties",
            localField: "properties",
            foreignField: "_id",
            pipeline: [{
              $lookup: {
                from: "due_deligences",
                localField: "company",
                foreignField: "user",
                as: "company",
              }},
              {
                "$unwind": "$company"
              },
              

              // {$project: {
              //         project_name: "$company.company_information.name",
              //         properties: 1
              //         // project_location: "$company.company_information.name",
              //         // project_type: "$company.company_information.name",
              //         // project_group: "$company.company_information.name",
              //         // project_amount: "$company.company_information.name",
              //         // project_open_date: "$company.company_information.name",
              //         // project_close_date: "$company.company_information.name",
              //         // project_progress: "$company.company_information.name",
              //       }}

            ],
            as: "properties",
          },
          
          
          
        },
       
       
        {
          $lookup: {
               from: "transactions",
               localField: "transactions",
               foreignField: "_id",
               as: "property_invested",
             },
           },
           {
             $addFields: {
               amount_invested: {
               "$sum": { $sum: "$property_invested.paid.amount"}
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
        {
          $addFields: {
            kyc_status: {
              $arrayElemAt: ["$kyc", 0],
            },
          },
        },


  ]


  query.push(
    {
        $project: {
          username:"$user_detail.username",
          avatar:"$user_detail.avatar",
          isSuspended:"$user_detail.isSuspended",
          country:"$user_detail.country",
          email: "$user_detail.email",
          date_joined:"$user_detail.createdAt",
          contact:"$user_detail.phone_number",
          status: "$accreditation_status.status" == "verified" ? "Accredited" : "Non Accredited",
          amount_invested: 1,
          properties: 1,
          funds: 1,
          _id: 1,
          funds_Invested: {$size: "$funds"},
          property_Purchased: {$size: "$properties"},
          kyc_status: "$kyc_status.isApproved"
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

    res.status(200).json({
      data: user[0]
    })
    
  } catch (error) {
    next(errorHandler(500, "failed"))
  }

}


exports.get_All_Non_Institutional_Compliance = async (req, res, next) => {
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
              foreignField: "_id",
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
            username: "$user_detail.username",
            country:"$user_detail.country",
            verify_type: "$accreditation_status.verify_method",
            submission_date:"$user_detail.updatedAt",
            status: "$accreditation_status.status",
            _id: 1
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
    )


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


  try {
    const myAggregate = Non_Institiutional_Investor.aggregate(query);

    const paginationResult = await Non_Institiutional_Investor.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}

exports.get_user_Compliance = async (req, res, next) => {
  
  const {userId} = req.params


 
  let query = [
    {
      $match: { _id: new ObjectId(userId) },
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
        from: "transactions",
        localField: "transactions",
        foreignField: "_id",
        as: "transaction_invested",
      },
    },
    {
      $addFields: {
        amount_invested: {
          $sum: { $sum: "$transaction_invested.paid.amount" },
        },
      },
    },
    {
      $lookup: {
        from: "accreditations",
        localField: "accreditation",
        foreignField: "_id",
        as: "accreditation",
      },
    },
    {
      $lookup: {
        from: "kycs",
        localField: "kyc",
        foreignField: "_id",
        as: "kyc_detail",
      },
    },
        {
          $addFields: {
            user_detail: {
              $arrayElemAt: ["$user", 0],
            },
          },
        },
        { $unset: [  "user_detail.password",  ] },
        {
          $addFields: {
            accreditation_status: {
              $arrayElemAt: ["$accreditation", 0],
            },
          },
        },
        {
          $addFields: {
            kyc: {
              $arrayElemAt: ["$kyc_detail", 0],
            },
          },
        },
  ];

    query.push(
      {
          $project: {
            user_detail: 1,
            compliance: "$accreditation_status",
            kyc_info: "$kyc"
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
    )


  try {
    const myAggregate = await Non_Institiutional_Investor.aggregate(query);

    return res.status(200).json({ status: "success", data: myAggregate[0] });
  } catch (error) {
    next(errorHandler(500, "network error"));
    
  }
}











