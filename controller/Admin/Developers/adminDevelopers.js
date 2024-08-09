const { GeneralMailOption } = require("../../../middleware/sendMail");
const Due_Deligence = require("../../../model/developer/due_deligence");
const User = require("../../../model/user");
const Property = require("../../../model/developer/properties");
const { errorHandler } = require("../../../utils/error");
const { mailerController } = require("../../../utils/mailer");

exports.get_Developers = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;


  const options = {
    page,
    limit,
  };

  let query =  [
    {
      $match: { account_type: "Developer" }
    },
    
  ]

  if(searchText){
    query.push({$match : { username: { $regex: ".*" + searchText + ".*", $options: "i" } }})
  }

  query.push(
    {
        $project: {
          username: 1,
          country: 1,
          email: 1,
          createdAt: 1,
          _id: 1,
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

exports.get_Due_Deligence = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;


  const options = {
    page,
    limit,
  };

  try {
    const myAggregate = Due_Deligence.aggregate([
      {
        $match: { isSubmited: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "lookup_user",
        },
      },
      {
        $addFields: {
          user_detail: {
            $arrayElemAt: ["$lookup_user", 0],
          },
        },
      },
      {
        $project: {
          username:"user_detail.username",
          country:"user_detail.country",
          isAdminAproved: 1,
          createdAt: 1,
          _id:"user_detail._id",
        },
      },
      {
        $match: {
          $or: [
            {
              "user_detail.username": {
                $regex: ".*" + searchText + ".*",
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const paginationResult = await Due_Deligence.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};

exports.approveDueDeligence = async (req, res, next) => {
  req.body.isAdminAproved = "Verified";
  next();
};

exports.rejectDueDeligence = async (req, res, next) => {
  req.body.isAdminAproved = "Rejected";
  next();
};

exports.statusDueDeligence = async (req, res, next) => {
  const { userId } = req.params;
  const { isAdminAproved, rejection_reason } = req.body;

  try {
    // console.log(userId, isAdminAproved)

    const data = await Due_Deligence.findByIdAndUpdate(
      userId,
      {
        isAdminAproved,
      },
      { new: true }
    ).populate("user");

    if (!data) {
      return next(errorHandler(500, "updated fail"));
    }

    if (isAdminAproved === "Rejected") {
      mailerController(
        GeneralMailOption({
          email: data.user.email,
          text: rejection_reason,
          title: "Propsverse Due Deligence Rejection",
        })
      );
    }

    return res.status(200).json({ status: "success", data: data });
  } catch (error) {
    next(errorHandler(500, "updated fail"));
  }
};


/**
 * property approve/rejection
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.approveProperty = async (req, res, next) => {
  req.body.isAdminAproved = "Approved";
  next();
};

exports.rejectProperty = async (req, res, next) => {
  req.body.isAdminAproved = "Rejected";
  next();
};

exports.statusProperty = async (req, res, next) => {
  const { prodId } = req.params;
  const { isAdminAproved, rejection_reason } = req.body;

  try {

    const data = await Property.findByIdAndUpdate(
        prodId,
      {
        isAdminAproved,
      },
      { new: true }
    ).populate("user");


    if (!data) {
      return next(errorHandler(500, "updated fail"));
    }

    if (isAdminAproved === "Rejected") {
      mailerController(
        GeneralMailOption({
          email: data.user.email,
          text: rejection_reason,
          title: "Propsverse Property Rejection",
        })
      );
    }

    delete data.user

    return res.status(200).json({ status: "success", data: data });
  } catch (error) {
   
    next(errorHandler(500, "updated fail"));
  }
};


/**
 * get all properties
 */

exports.get_Properties = async (req, res, next) => {
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
      $lookup: {
           from: "users",
           localField: "user",
           foreignField: "_id",
           as: "user",
         },
       },
       {
        $addFields: {
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $project: {
          username: "user.username",
          country: "property_detail.property_location.country",
          property_type: "property_detail.property_overview.property_type" ,
          property_name: "property_detail.property_overview.property_name" ,
           isAdminAproved: 1,
          // email: 1,
          createdAt: 1,
          _id: 1,
        },
      },
    {
      $sort: {
        createdAt: -1,
      },
    },
    
  ]

  if(searchText){
    query.push({$match : { "property_detail.property_overview.property_name": { $regex: ".*" + searchText + ".*", $options: "i" } }})
  }

  // query.push(
    
  // )

  try {
    const myAggregate = Property.aggregate(query);

    const paginationResult = await Property.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};



exports.get_Properties = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;

  const { userId } = req.params;

  //   const { userId: payloadUserId, status } = req.payload;

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
        $addFields: {
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $project: {
          username: "user.username",
          country: "property_detail.property_location.country",
          property_type: "property_detail.property_overview.property_type",
          property_name: "property_detail.property_overview.property_name",
           isAdminAproved: 1,
          // email: 1,
          createdAt: 1,
          _id: 1,
        },
      },
    {
      $sort: {
        createdAt: -1,
      },
    },
    
  ]

  if(searchText){
    query.push({$match : { "property_detail.property_overview.property_name": { $regex: ".*" + searchText + ".*", $options: "i" } }})
  }

  // query.push(
    
  // )

  try {
    const myAggregate = Property.aggregate(query);

    const paginationResult = await Property.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};



exports.get_Current_Listed_Properties = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;


  const options = {
    page,
    limit,
  };

  let query =  [
    {
      $match: {isAdminAproved: "Approved"}
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
      $lookup: {
           from: "users",
           localField: "user",
           foreignField: "_id",
           as: "user",
         },
       },
       {
        $addFields: {
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $project: {
          name: "company.company_information.name",
          country: "property_detail.property_location.country",
          property_type: "property_detail.property_overview.property_type",
          starting_date: "property_detail.property_overview.date.starting_date",
          closing_date: "property_detail.property_overview.date.closing_date",
           isAdminAproved: 1,
          investment_status: 1,
          _id: 1,
        },
      },
{
$match: { "property_detail.property_overview.date.closing_date" : {$lte:{$date: new Date()}}}
},
    {
      $sort: {
        createdAt: -1,
      },
    },
    
  ]
  // {$gte:{$date:'2012-09-01T04:00:00Z'}, 
  //                   $lt:  {date:'2012-10-01T04:00:00Z'} 
  //                   }}
  if(searchText){
    query.push({$match : { "property_detail.property_overview.property_name": { $regex: ".*" + searchText + ".*", $options: "i" } }})
  }

  // query.push(
    
  // )

  try {
    const myAggregate = Property.aggregate(query);

    const paginationResult = await Property.aggregatePaginate(
      myAggregate,
      options
    );

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};



