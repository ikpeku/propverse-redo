const { ObjectId } = require("mongodb");
const properties = require("../../model/developer/properties");
const { errorHandler } = require("../../utils/error");
const Due_Deligence = require("../../model/developer/due_deligence");
const Activities = require("../../model/developer/property_activities");
const PayInTransaction = require("../../model/transaction/transactions");

exports.DeveloperDashbroad = async(req, res, next) => {

  try {

    let cumulativequery = [
      {
        $match: {
          user : new ObjectId(req.payload.userId) 
        }
      },
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $project: {
          propertyId: "$_id",
          property_location: "$property_detail.property_location",
          property_type: "$property_detail.property_overview.property_type",

          thumbnail: "$property_detail.property_images",
          property_name: "$property_detail.property_overview.property_name",
          property_progress: "$property_progress",

          property_amount: "$property_detail.property_overview.price",
          property_dates: "$property_detail.property_overview.date",
         
          company: "$company.company_information.name" || ""
        }
      }


    ];

    let query = [
      {
        $match: {
          user : new ObjectId(req.payload.userId) ,
          investment_status: "Available",
          isSubmitted: true,
          isAdminAproved: "Approved"

        }
      },
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $project: {
          propertyId: "$_id",
          property_location: "$property_detail.property_location",
          property_type: "$property_detail.property_overview.property_type",

          thumbnail: "$property_detail.property_images",
          property_name: "$property_detail.property_overview.property_name",
          property_progress: "$property_progress",

          property_amount: "$property_detail.property_overview.price",
          property_dates: "$property_detail.property_overview.date",
         
          company: "$company.company_information.name" || ""
        }
      }


    ];


    let allquery = [
      {
        $match: {
          user : new ObjectId(req.payload.userId) ,
        }
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transactions",
          foreignField: "_id",
          as: "transactionuser",
        }
      },
      {
        $unwind: "$transactionuser"
      },
      {
        $addFields: {
          capital_invested: {
          "$sum": {$sum: "$transactionuser.paid.amount"}
          }

        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
     

      {
        $project: {
          propertyId: "$_id",
          property_type: "$property_detail.property_overview.property_type",
          "invested_amount": {$sum: "$capital_invested"},
          property_amount: "$property_detail.property_overview.price",
        }
      }


    ];
    let investorsquery = [
      {
        $match: {
          user : new ObjectId(req.payload.userId) ,
        }
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transactions",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "investor",
                foreignField: "_id",
                as: "transactionuser",
              },
            },
            {
        $addFields: {
          transaction_user: {
            $arrayElemAt: ["$transactionuser", 0]
          }
        }
            },
            {
              $project: {
                transaction_user: 1,
                paid: 1
              }
            }

          ],
          as: "transactionuser",
        }
      },
      {
        $unwind: "$transactionuser"
      },

      {
        $addFields: {
          capital_invested: {
          "$sum": {$sum: "$transactionuser.paid.amount"}
          }

        },
      },

      {
        $group:{
          _id: "$transactionuser.transaction_user._id",
          investor_name: {$first: "$transactionuser.transaction_user.username"},
          invested_amount: {$sum: "$capital_invested"},
          currency: {$first: "$transactionuser.paid.currency"}
        }
      },
      
      {
        $sort: {
          invested_amount: -1,
        },
      },

    ];

    const project = await properties.aggregate(query);
    const cumulativeproject = await properties.aggregate(cumulativequery);

    const allProject = await properties.aggregate(allquery);

    const top_Investors = await properties.aggregate(investorsquery);

    const property_type = cumulativeproject.reduce(function(total, item) {
      
          if(total[item.property_type] ){
             ++total[item.property_type]
          }else {
           total[item.property_type] = 1;
          }
          return total;
    }, {
      Residential: 0,
      Commercial: 0,
      Industrial: 0
    }); 

    const total_paid_by_investors = allProject.reduce(function(total, item) {
      return total + item.invested_amount
    }, 0); 
    const total_amount_revenue = allProject.reduce(function(total, item) {
      return total + item.property_amount.amount
    }, 0); 

    const percentagevalue = () => {

      if(total_paid_by_investors < total_amount_revenue) {
        return {
          type: "ascending",
          percentage: (total_paid_by_investors / total_amount_revenue) * 100 || 0
        }
      } else {
        return {
          type: "decending",
          percentage: ( total_amount_revenue / total_paid_by_investors) * 100 || 0
        }
      }


      
    }


    return res.status(200).json({status:"success", data: {
      ongoing_project: project,
      property_type,
      totalProject: cumulativeproject.length,
      total_paid_by_investors,
      total_amount_revenue,
      percentage: percentagevalue(),
      top_Investors
      
    }})
    
  } catch (error) {
    
    
  }

   
}


exports.isSubmmited = (req, res, next) => {
  req.body.isSubmitted = true;
  next();
};

exports.isNotSubmmited = (req, res, next) => {
  req.body.isSubmitted = false;
  next();
};

exports.isNew = (req, res, next) => {
    // req.body.property_state = "new"
    req.body.investment_status = "Available",
    next()
}

exports.isOld = (req, res, next) => {
    // req.body.property_state = "old"
    req.body.investment_status = "Sold",
    next()
}

exports.createProperty = async (req, res, next) => {
  const {
    _id,
    property_state,
    isSubmitted,
    isDetail_lock,

    property_overview
    // : {
    //   property_type,
    //   property_name,
    //   unit_number,
    //   room_configuration,
    //   location,
    //   price: { amount, currency },
    //   size,
    //   date: { starting_date, closing_date },
    //   property_description: { description, amenities ,useramenities},
    // }
    ,
    property_images,
    special_facility,
    payment_plan,
    property_documents,
    property_location
    // : { country, state, city, address }
    ,
    property_units,
  } = req.body;


  if (!req.payload.userId) return next(errorHandler(401, "forbidden"));


  try {
    const response = await properties.findById(_id);

    if (!response) {
      await properties.create({
        _id,
        user: req.payload.userId,
        company: req.payload.userId,

"isAdminAproved": "Not Approve",
...isSubmitted && {"isSubmitted": isSubmitted},
...property_state && {"investment_status": property_state == "new" ? "Available" : "Sold"},
...isDetail_lock && { "isDetail_lock": isDetail_lock},

...property_overview?.property_type && {"property_detail.property_overview.property_type" : property_overview.property_type},
...property_overview?.property_name && {"property_detail.property_overview.property_name" : property_overview.property_name},
...property_overview?.unit_number && {"property_detail.property_overview.unit_number" : property_overview.unit_number},
...property_overview?.room_configuration && {"property_detail.property_overview.room_configuration" : property_overview.room_configuration},
...property_overview?.location && {"property_detail.property_overview.location" : property_overview.location},
...property_overview?.price?.amount && {"property_detail.property_overview.price.amount" : property_overview.price.amount},
...property_overview?.price?.currency && {"property_detail.property_overview.price.currency" : property_overview.price.currency},
...property_overview?.size && {"property_detail.property_overview.size" : property_overview.size},
...property_overview?.date?.starting_date && {"property_detail.property_overview.date.starting_date" : property_overview.date.starting_date},
...property_overview?.date?.closing_date && {"property_detail.property_overview.date.closing_date" : property_overview.date.closing_date},
...property_overview?.property_description?.description && {"property_detail.property_overview.property_description.description" : property_overview.property_description.description},
...property_overview?.property_description?.amenities && {"property_detail.property_overview.property_description.amenities" : property_overview.property_description.amenities},
...property_overview?.property_description?.useramenities && {"property_detail.property_overview.property_description.useramenities" : property_overview.property_description.useramenities},

...property_images && {"property_detail.property_images": property_images},
...special_facility && {"property_detail.special_facility": special_facility},
...payment_plan && {"property_detail.payment_plan": payment_plan},
...property_documents && {"property_detail.property_documents": property_documents},
...property_location?.country && {"property_detail.property_location.country": property_location.country},
...property_location?.state && {"property_detail.property_location.state": property_location.state},
...property_location?.city && {"property_detail.property_location.city": property_location.city},
...property_location?.address && {"property_detail.property_location.address": property_location.address},
...property_units && {"property_detail.property_units": property_units},

      });
    } else {
      await properties.findByIdAndUpdate(_id, 
        {$set:{
        "isAdminAproved": "Not Approve",
        ...isSubmitted && {"isSubmitted": isSubmitted},
        ...property_state && {"investment_status": property_state == "new" ? "Available" : "Sold"},
       ...isDetail_lock && { "isDetail_lock": isDetail_lock},

...property_overview?.property_type && {"property_detail.property_overview.property_type" : property_overview.property_type},
...property_overview?.property_name && {"property_detail.property_overview.property_name" : property_overview.property_name},
...property_overview?.unit_number && {"property_detail.property_overview.unit_number" : property_overview.unit_number},
...property_overview?.room_configuration && {"property_detail.property_overview.room_configuration" : property_overview.room_configuration},
...property_overview?.location && {"property_detail.property_overview.location" : property_overview.location},
...property_overview?.price?.amount && {"property_detail.property_overview.price.amount" : property_overview.price.amount},
...property_overview?.price?.currency && {"property_detail.property_overview.price.currency" : property_overview.price.currency},
...property_overview?.size && {"property_detail.property_overview.size" : property_overview.size},
...property_overview?.date?.starting_date && {"property_detail.property_overview.date.starting_date" : property_overview.date.starting_date},
...property_overview?.date?.closing_date && {"property_detail.property_overview.date.closing_date" : property_overview.date.closing_date},
...property_overview?.property_description?.description && {"property_detail.property_overview.property_description.description" : property_overview.property_description.description},
...property_overview?.property_description?.amenities && {"property_detail.property_overview.property_description.amenities" : property_overview.property_description.amenities},
...property_overview?.property_description?.useramenities && {"property_detail.property_overview.property_description.useramenities" : property_overview.property_description.useramenities},

...property_images && {"property_detail.property_images": property_images},
...special_facility && {"property_detail.special_facility": special_facility},
...payment_plan && {"property_detail.payment_plan": payment_plan},
...property_documents && {"property_detail.property_documents": property_documents},
...property_location?.country && {"property_detail.property_location.country": property_location.country},
...property_location?.state && {"property_detail.property_location.state": property_location.state},
...property_location?.city && {"property_detail.property_location.city": property_location.city},
...property_location?.address && {"property_detail.property_location.address": property_location.address},
...property_units && {"property_detail.property_units": property_units},

      }
    }
    );
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    // next(errorHandler(500, "failed"))
    next(error);
  }
};


exports.updatePropertyProgress = async (req, res, next) => {
  const { prodId } = req.params;
  const {property_progress} = req.body;


  try {
    if(!property_progress) return

    const response = await properties.findById(prodId);

    if (!response) {
      return next(errorHandler(401, "invalid property"));
    } 
    
    if(req.payload.status === "Admin") {
      response.property_progress = property_progress;
      response.save()
      return res.status(200).json({ status: "success" });
    }

    if(req.payload.userId === response.user.toString()) {
     
      response.property_progress = property_progress;
      response.save()
    } else {
      return next(errorHandler(401, "forbidden"));
    }


    return res.status(200).json({ status: "success" });
  } catch (error) {
    // next(errorHandler(500, "failed"))
    next(error);
  }
};


exports.updateProperty = async (req, res, next) => {
  const { prodId } = req.params;
  const {
    property_overview: {
      property_type,
      property_name,
      unit_number,
      room_configuration,
      location,
      price: { amount, currency },
      size,
      date: { starting_date, closing_date },
      property_description: { description, amenities },
    },
    property_images,
    special_facility,
    payment_plan,
    property_documents,
    property_location: { country, state, city, address },
    property_units,
  } = req.body;

  if (!req.payload.userId) return next(errorHandler(401, "forbidden"));

  try {
    const response = await properties.findById(prodId);

    if (!response) {
      return next(errorHandler(401, "invalid property"));
    } else {
      await properties.findByIdAndUpdate(prodId, {
        isAdminAproved: "Not Approve",

        property_detail: {
          property_overview: {
            property_type,
            property_name,
            unit_number,
            room_configuration,
            location,
            price: {
              amount,
              currency,
            },
            size,
            date: {
              starting_date,
              closing_date,
            },
            property_description: {
              description,
              amenities,
            },
          },

          property_images,

          special_facility,
          payment_plan,
          property_documents,
          property_location: {
            country,
            state,
            city,
            address,
          },

          property_units,
        },
      });
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    // next(errorHandler(500, "failed"))
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { prodId } = req.params;


  try {
    let query = [
      {
        $match: { _id: prodId },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unset: ["user.password"] },
      {
        $unwind: "$user",
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
          from: "due_deligences",
          localField: "company",
          foreignField: "user",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $lookup: {
          from: "property_activities",
          localField: "activities",
          foreignField: "_id",
          as: "activities",
        },
      },
    ];

    const myAggregate = await properties.aggregate(query);


    const project  = await properties.findById(prodId);


    const due_deligence  = await Due_Deligence.findById(project.user);

    myAggregate[0].company_information = due_deligence?.company_information;
    myAggregate[0].verify =   due_deligence?.isAdminAproved;


    const current_project = await properties.find({user: project.user, isAdminAproved: "Approved", investment_status: "Available"}).select("property_detail investment_status")
   const past_project = await properties.find({user: project.user, isAdminAproved: "Approved", investment_status: "Sold"}).select("property_detail investment_status")
   myAggregate[0].pastProject  = past_project.length;
   myAggregate[0].currentProject  = current_project.length;
   myAggregate[0].totalProject  = project.length;

    //       let transactionQeury = [
    //         {
    //           $match: {_id: prodId}
    //         },
    //         {
    //           $lookup: {
    //             from: "transactions",
    //             localField: "transactions",
    //             foreignField: "_id",
    //             as: "transaction",
    //           },
    //         },
    //         {
    // $unwind: "$transaction"
    //         },
    //            {
    //                 $group: {
    //                   _id:  "$transaction.payment_status",
    //                   status: {$first: "$transaction.payment_status"},
    //                   amount:{$sum: "$transaction.paid.amount"},
    //                   created: { $last:"$transaction.createdAt"},
    //                   data: { $push: "$$ROOT" },
    //                 }
    //                },
    //                {
    //                 $unwind: "$data",
    //               },
    //               {
    //                 $replaceRoot: { newRoot: "$data" },
    //               },

    //       ]

    //      const txn = await properties.aggregate(transactionQeury);

    //  myAggregate[0].
    return res.status(200).json({ status: "success", data: myAggregate[0] });

  } catch (error) {
    next(error);
    // next("failed to return data")
  }
};

exports.isPropertyCurrent = (req, res, next) => {
  req.body = {
    // "property_detail.property_overview.date.closing_date" : {$gte: new Date()},
    investment_status: "Available",
    isAdminAproved: "Approved",
  };
  next();
};

exports.isUser = (req, res, next) => {
  const { userId } = req.params;
  req.body.user = new ObjectId(userId);
  next();
};

exports.getUserProperties = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;

  const options = {
    page,
    limit,
  };


  let query = [
    {
      $match: { ...req.body },
    },
    {
      $lookup: {
        from: "due_deligences",
        localField: "company",
        foreignField: "user",
        as: "company",
      },
    },
    {
      $addFields: {
        company: {
          $arrayElemAt: ["$company", 0],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  if (searchText) {
    query.push({
      $match: {
        $or: [
          {
            "property_detail.property_overview.property_type": {
              $regex: ".*" + searchText + ".*",
              $options: "i",
            },
          },
          {
            "property_detail.property_overview.property_name": {
              $regex: ".*" + searchText + ".*",
              $options: "i",
            },
          },
          {
            "property_detail.property_overview.location": {
              $regex: ".*" + searchText + ".*",
              $options: "i",
            },
          },
          {
            "property_detail.property_overview.property_description.description":
              {
                $regex: ".*" + searchText + ".*",
                $options: "i",
              },
          },
          {
            "property_detail.property_overview.property_description.amenities":
              {
                $regex: ".*" + searchText + ".*",
                $options: "i",
              },
          },
        ],
      },
    });
  }

  try {
    const myAggregate = properties.aggregate(query);

    const paginationResult = await properties.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });


  } catch (error) {
    next(error);

  }
};



exports.uploadActivities = async(req,res,next) => {
  const {title,activity, documents} = req.body;
  const {prodId} = req.params;


  try {
    if (!req.payload.userId) return next(errorHandler(401, "forbidden"));
    if (!title) return next(errorHandler(401, "title is required"));
    if (!activity) return next(errorHandler(401, "activity is required"));

    const project  = await properties.findById(prodId);

    if(!project){
      return next(errorHandler(401, "invalid project"))
    }



if(req.payload.status === "Admin") {

 const productActivity = await Activities.create({
    property:prodId,
    title,
    activity,
    documents,
})

const isPropery =   await properties.findByIdAndUpdate(
  prodId,
  { $push: { activities: productActivity._id } },
  { new: true, useFindAndModify: false }
);

if(isPropery){

}


return  res.status(200).json({
  message: "success"
})
 
} 

if(req.payload.userId !== project.user.toString()){
  return next(errorHandler(401, "forbidden"));
}

  const productActivity = await Activities.create({
    property:prodId,
    title,
    activity,
    documents,
});


const isPropery =   await properties.findByIdAndUpdate(
  prodId,
  { $push: { activities: productActivity._id } },
  { new: true, useFindAndModify: false }
);

if(isPropery){

}


return  res.status(200).json({
  message: "success"
})

  } catch (error) {
    next(error)
      // next(errorHandler(400, "operation failed"))
      
  }

}

exports.getPropertyInvestors = async (req, res, next) => {
  const { prodId } = req.params;


  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;

  const myCustomLabels = {
    docs: 'data',
  };

  const options = {
    page,
    limit,
    customLabels: myCustomLabels
  };


  try {
    

    const query = [
      {
        $match: {transaction_type: "property", property: prodId}
      },
      {
        $lookup: {
          from: "users",
          localField: "investor",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user_detail: {
            $arrayElemAt: ["$user", 0]
          }
        }
       },
       {
        $project: {
          investor_name: "$user_detail.username",
          email: "$user_detail.email",
          property_amount: "$property_amount",
          paid: "$paid",
          status: "$status",
          paymentDate: "$paymentDate",
          investorId: "$user_detail._id",
          // txnId: "$_id"
          
        }
       }
  
      ]

    const myAggregate =  PayInTransaction.aggregate(query);
    const project = await  PayInTransaction.aggregate(query);


  const paginationResult = await PayInTransaction.aggregatePaginate(
    myAggregate,
    options
  );

  const total_paid_by_investors = project.reduce(function(total, item) {
    return total + item.paid.amount
  }, 0); 

   
    return res.status(200).json({ status: "success", data: { 
      investors : project.length,
      total_paid_by_investors : total_paid_by_investors,
       ...paginationResult
      } });


  } catch (error) {
    next(error);
    // next("failed to return data")
  }
};

exports.getPropertyInvestorbyId = async (req, res, next) => {
  const { txnId } = req.params;


  try {

    const userDetail = await  PayInTransaction.aggregate([
      {
        $match: {_id: new ObjectId(txnId)}
      },
      {
        $lookup: {
          from: "users",
          localField: "investor",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user_detail: {
            $arrayElemAt: ["$user", 0]
          }
        }
       },

      //  {
      //   $lookup: {
      //     from: "properties",
      //     localField: "property",
      //     foreignField: "_id",
      //     as: "property_detail",
      //   },
      // },
  
      
       {
        $lookup: {
             from: "properties",
             localField: "property",
             foreignField: "_id",
             pipeline: [
              {
               $lookup: {
                //  from: "due_deligences",
                //  localField: "company",
                  from: "transactions",
                  localField: "transactions",
                 foreignField: "_id",
                 let: {invertorId : "$user_detail._id"},
                 pipeline: [
                  // {
                  //   $match: {investor: "$$invertorId"}
                  // }
                ],

                 as: "transactions",
               }},
              //  {
              //    "$unwind": "$company"
              //  },
               
             ],
             as: "property_detail",
           },
           
           
           
         },
         {
          $addFields: {
            investedproperty: {
              $arrayElemAt: ["$property_detail", 0]
            }
          }
         },

        {
        $addFields: {
          amount_invested: {
            $sum: { $sum: "$investedproperty.transactions.paid.amount" },
          },
        },
      },
       {
        $project: {
          // root: "$$ROOT",
          avatar: "$user_detail.avatar",
          verify_account: "$user_detail.verify_account",
          username: "$user_detail.username",
          country: "$user_detail.country",
          userhag: { $substr: [ "$user_detail.password", 0, 5 ] },
          registrationDtate: "$user_detail.createdAt",
          email: "$user_detail.createdAt",
          phonenumber: "$user_detail.phone_number",
          status: "Accredited",
          investorId: "$investor",
          propertyId: "$investedproperty._id",

          payment:{
            property_amount: "$property_amount",
            paid: "$paid",
            amount_remaining: {$subtract: ["$property_amount.amount", "$amount_invested"]},

          numbers_of_units: "$investedproperty.property_detail.property_overview.unit_number",
          property_configuration: "$investedproperty.property_detail.property_overview.room_configuration"


          }          
        }
       }
  
  
      ]);
   

    const myAggregate = await  PayInTransaction.aggregate([
    {
      $match: {investor: userDetail[0].investorId, property: userDetail[0].propertyId}
    },
    {
      $lookup: {
           from: "properties",
           localField: "property",
           foreignField: "_id",
           pipeline: [{
             $lookup: {
              //  from: "due_deligences",
              //  localField: "company",
                from: "transactions",
                localField: "transactions",
               foreignField: "_id",
              //  let: {invertorId : "$user_detail._id"},
               pipeline: [
                // {
                //   $match: {investor: "$$invertorId"}
                // }
              ],

               as: "transactions",
             }},
            //  {
            //    "$unwind": "$company"
            //  },
             
           ],
           as: "property_detail",
         },
         
         
         
       },
       {
        $addFields: {
          investedproperty: {
            $arrayElemAt: ["$property_detail", 0]
          }
        }
       },

      {
      $addFields: {
        amount_invested: {
          $sum: { $sum: "$investedproperty.transactions.paid.amount" },
        },
      },
    },
     {
      $project: {
        description: 1,
        paid: 1,
        intial_amount: {$subtract: ["$amount_invested", "$paid.amount"]},
        paymentDate: 1,
        status: 1,
      }
     }
    ]);
 

   
    return res.status(200).json({ status: "success", data: {
      payment_timeline: myAggregate,
      userDetail: userDetail[0]
    }});


  } catch (error) {
    next(error);
    // next("failed to return data")
  }
};


exports.getDevelopersInvestors = async (req, res, next) => {

  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;

  const myCustomLabels = {
    docs: 'data',
  };

  const options = {
    page,
    limit,
    customLabels: myCustomLabels
  };


  try {
  
    if(!req.payload.userId) {
        return next(errorHandler(401,"user is not login"))
      }

    const query =   [
      {
        $match: {user:  new ObjectId(req.payload.userId)}
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transactions",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "investor",
                foreignField: "_id",
                as: "transactionuser",
              },
            },
            {
        $addFields: {
          transaction_user: {
            $arrayElemAt: ["$transactionuser", 0]
          }
        }
            },
            {
              $project: {
                transaction_user: 1,
                paid: 1
              }
            }
        //     {
        //       $lookup: {
        //         from: "properties",
        //         localField: "property",
        //         foreignField: "_id",
        //         as: "investedproperty",
        //       },
        //     },
        //     {
        // $addFields: {
        //   invested_property: {
        //     $arrayElemAt: ["$investedproperty", 0]
        //   }
        // }
        //     },
          ],
          as: "transactions",
        },
      },
      {
        $unwind: "$transactions"
      },
     
      {
        "$group": {
          "_id": "$transactions.transaction_user._id",
          "investor_name": {"$first" : "$transactions.transaction_user.username"},
          "property_name": {"$first" : "$property_detail.property_overview.property_name"},
          "property_type": {"$first" : "$property_detail.property_overview.property_type"},
          "invested_amount": {$sum: "$transactions.paid.amount"},
          "status": {"$first" : "$investment_status"},
        }
      }
      ]

    const myAggregate =  properties.aggregate(query);
    const project =  await properties.aggregate(query);


  const paginationResult = await properties.aggregatePaginate(
    myAggregate,
    options
  );

  const total_paid_by_investors = project.reduce(function(total, item) {
    return total + item.invested_amount
  }, 0); 


   
    return res.status(200).json({ status: "success", 
      number_of_investors : project.length || 0,
      total_paid_by_investors,
       ...paginationResult
    });


  } catch (error) {
    next(error);
    // next("failed to return data")
  }

};


exports.getPropertyFinances = async (req, res, next) => {
  const { prodId } = req.params;

  try {
    

    const query = [
      {
        $match: {transaction_type: "property", property: prodId}
      },
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                 from: "transactions",
                 localField: "transactions",
                foreignField: "_id",
              
                as: "transactions",
              }},

              // {
              //   $group: {

              //   }
              // }
          ],
          as: "property_detail",
        },
      },
  
      {
        $addFields: {
          investedproperty: {
            $arrayElemAt: ["$property_detail", 0]
          }
        }
       },
       {
        $project: {
          // root: "$$ROOT",
          paid: "$paid",
          paymentDate: "$paymentDate",
          number_of_investors: {$ifNull : ["$user_detail", 1]}
          
        }
       }
  
      ]

    const project = await  PayInTransaction.aggregate(query);

  const total_paid_by_investors = project.reduce(function(total, item) {
    return total + item.paid.amount
  }, 0); 


  const chartData = project.reduce(function(total, item) {
  
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const d = new Date(item.paymentDate);

    const month = monthNames[d.getMonth()];

      if(total[month]){
        total[month].amount_raised += item.paid.amount;
        total[month].currency = item.paid.currency;
     };
    
    return total;
}, {
January :{
  date: 'Jan',
  amount_raised: 0,
  currency: "$",
},
February :{
  ate: 'Feb',
  amount_raised: 0,
  currency: "$",
},
March :{
  date: 'Mar',
  amount_raised: 0,
  currency: "$",
},
April :{
  date: 'Apr',
  amount_raised: 0,
  currency: "$",
},
May :{
  date: 'May',
  amount_raised: 0,
  currency: "$",
},
June :{
  date: 'Jun',
  amount_raised: 0,
  currency: "$",
},
July :{
  date: 'Jul',
  amount_raised: 0,
  currency: "$",
},
August :{
  date: 'Aug',
  amount_raised: 0,
  currency: "$",
},
September :{
  date: 'Sep',
  amount_raised: 0,
  currency: "$",
},
October :{
  date: 'Oct',
  amount_raised: 0,
  currency: "$",
},
November : {
  date: 'Nov',
  amount_raised: 0,
  currency: "$",
},
December : {
  date: 'Dec',
  amount_raised: 0,
  currency: "$",
}

}); 



   
    return res.status(200).json({ status: "success", data: { 
      total_paid_by_investors : total_paid_by_investors,
      project,
      chart:  Object.values(chartData) || null,
      } });


  } catch (error) {
    next(error);
    // next("failed to return data")
  }
};


