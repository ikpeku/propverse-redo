const Due_Deligence = require("../../../model/developer/due_deligence")
const Developers = require("../../../model/user");
const { errorHandler } = require("../../../utils/error");

exports.get_Developers = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;

    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;

  const { userId } = req.params;

//   const { userId: payloadUserId, status } = req.payload;

  const options = {
    page,
    limit,
  };

  try {
    
    const myAggregate = Developers.aggregate([

        {
            $match: {
                $and: [
                    {account_type: "Developer"},
                   {"username":{ $regex:'.*' + searchText + '.*',$options: 'i' }},
                ]
            }},
        {
            $project: {
                username: 1,
                country: 1,
                email:1,
                createdAt : 1,
                _id: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }

        }
    ]);

    const paginationResult = await  Developers
      .aggregatePaginate(myAggregate, options)

    return res.status(200).json({ status: "success", data: paginationResult });
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};


exports.get_Due_Deligence = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const searchText = req?.query?.searchText;
    
  const { userId } = req.params;

  const { userId: payloadUserId, status } = req.payload;

  const options = {
    page,
    limit,
  };

  try {
   

    const myAggregate = Due_Deligence.aggregate([

       
        {
            $lookup:{
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "lookup_user"
            }
        },
        {
            $addFields: {
                user_detail: {
                    $arrayElemAt: ["$lookup_user", 0]
                }
               
            }
        },
        {
            $project: {
                "user_detail.username": 1,
                "user_detail.country": 1,
                isAdminAproved: 1,
                createdAt : 1,
                "user_detail._id": 1
            }
        },
{
    $match: {
        $or: [
           {"user_detail.username":{ $regex:'.*' + searchText + '.*',$options: 'i' } },
        ]
    }},
        {
            $sort: {
                createdAt: -1
            }

        }
    ]);

 const paginationResult = await  Due_Deligence
      .aggregatePaginate(myAggregate, options)

    return res.status(200).json({ status: "success", data: paginationResult });


  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};
