const { ObjectId } = require("mongodb");
const properties = require("../../model/developer/properties");
const { errorHandler } = require("../../utils/error");

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
          foreignField: "property",
          as: "activities",
        },
      },
    ];

    const myAggregate = await properties.aggregate(query);

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

    // return res.status(200).json({status:"success", data: txn})
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
