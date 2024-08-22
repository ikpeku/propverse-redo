
const { ObjectId } = require("mongodb");
const properties = require("../../model/developer/properties");
const { errorHandler } = require("../../utils/error");


exports.isSubmmited = (req, res, next) => {
    req.body.isSubmitted = true
    next()
}

exports.isNotSubmmited = (req, res, next) => {
    req.body.isSubmitted = false
    next()
}

exports.isNew = (req, res, next) => {
    req.body.property_state = "new"
    next()
}

exports.isOld = (req, res, next) => {
    req.body.property_state = "old"
    next()
}




exports.createProperty = async(req, res, next) => {

    const {
        _id,
        property_state,
        isSubmitted,
        isDetail_lock,
    
            property_overview: {
            property_type,
                property_name,
                unit_number,
                room_configuration,
                location,
                price: {
                    amount,
                    currency
                },
                size,
                date: {
                    starting_date,
                    closing_date
                },
                property_description: {
                    description,
                    amenities
                }
            },
            property_images,
            special_facility,
            payment_plan,
            property_documents,
            property_location: {
                country,
                state,
                city,
                address
            },
            property_units

    } = req.body;

    // console.log(req.payload)
    if(!req.payload.userId) return next(errorHandler(401, "forbidden"))
   

    try {

       const response = await properties.findById(_id)
        
       if(!response) {
           await properties.create({
               _id,
               user: req.payload.userId,
               company: req.payload.userId,
               activities: _id,
               isSubmitted,
               property_state,
               isDetail_lock,
               
                 property_detail : {
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
                       property_description:{
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
                         address
                     },
                 
                     property_units
               
                 }
               
       
           })
       } else {
        await properties.findByIdAndUpdate(_id, {
            
isAdminAproved:"Not Approve",
isSubmitted,
                property_state,
                isDetail_lock,
                
                  property_detail : {
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
                        property_description:{
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
                          address
                      },
                  
                      property_units
                
                  }
                
        })
       }

       return res.status(200).json({status:"success"})
        
    } catch (error) {
        // next(errorHandler(500, "failed"))
        next(error)
    }

}


exports.updateProperty = async(req, res, next) => {
    const {prodId} = req.params
    const {
            property_overview: {
            property_type,
                property_name,
                unit_number,
                room_configuration,
                location,
                price: {
                    amount,
                    currency
                },
                size,
                date: {
                    starting_date,
                    closing_date
                },
                property_description: {
                    description,
                    amenities
                }
            },
            property_images,
            special_facility,
            payment_plan,
            property_documents,
            property_location: {
                country,
                state,
                city,
                address
            },
            property_units

    } = req.body;

    if(!req.payload.userId) return next(errorHandler(401, "forbidden"))
   

    try {

       const response = await properties.findById(prodId)
        
       if(!response) {
        return next(errorHandler(401, "invalid property"))
       } else {
        await properties.findByIdAndUpdate(prodId, {
            
isAdminAproved:"Not Approve",

                  property_detail : {
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
                        property_description:{
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
                          address
                      },
                  
                      property_units
                
                  }
                
        })
       }

       return res.status(200).json({status:"success"})
        
    } catch (error) {
        // next(errorHandler(500, "failed"))
        next(error)
    }

}


exports.getPropertyById = async(req, res, next) => {
    const {prodId} = req.params
    try {
        
      //  const data = await properties.findById(prodId).populate("company user transactions")

      //  delete data.user.password;

      //  return res.status(200).json({status:"success", data})

      let query = [
        {
          $match: {_id: prodId}
        },
        {
          $lookup: {
               from: "users",
               localField: "user",
               foreignField: "_id",
               as: "user",
             },
           },
           { $unset: [  "user.password",  ] },
           {
            $unwind: "$user"
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
              $unwind: "$company"
             },
            //  {
            //   $addFields: {
            //     company: {
            //       $arrayElemAt: ["$company", 0],
            //     },
            //   },
            // },
      ]

      const myAggregate = await properties.aggregate(query);

      return res.status(200).json({status:"success", data: myAggregate[0]})

    } catch (error) {
      next(error)
        // next("failed to return data")
    }

}


// created_date : 
//                   {$gte:{$date:'2012-09-01T04:00:00Z'}, 
//                   $lt:  {date:'2012-10-01T04:00:00Z'} 
//                   }}
exports.isPropertyCurrent = (req, res, next) => {
    req.body = {
        "property_detail.property_overview.date.closing_date" : {$gte: new Date()},
        isAdminAproved : "Approved"
    }
    next()
}

exports.isUser = (req, res, next) => {
    const {userId} = req.params
    req.body.user = new ObjectId(userId) 
    next()
}

exports.getUserProperties = async(req, res, next) => {
   

    const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;


  const options = {
    page,
    limit,
  };


  let query = [
    {
      $match: { ...req.body},
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]

  if(searchText) {
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
              "property_detail.property_overview.property_description.description": {
                $regex: ".*" + searchText + ".*",
                $options: "i",
              },
            },
            {
              "property_detail.property_overview.property_description.amenities": {
                $regex: ".*" + searchText + ".*",
                $options: "i",
              },
            },
          ],
        },
      })
  }

 


    try {

        const myAggregate = properties.aggregate(query);
      
          const paginationResult = await properties.aggregatePaginate(
            myAggregate,
            options
          );
      
          return res.status(200).json({ status: "success", data: paginationResult });

        
    //    const data = await .find({user: userId, ...req.body}).select("-user isSubmitted")

    //    return res.status(200).json({status:"success", data})
    } catch (error) {
        next(error)
        // next("failed to return data")
    }



}





