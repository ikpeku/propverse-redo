const { GeneralMailOption } = require("../../../middleware/sendMail");
const Due_Deligence = require("../../../model/developer/due_deligence")
const Developers = require("../../../model/user");
const { errorHandler } = require("../../../utils/error");
const { mailerController } = require("../../../utils/mailer");

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
    
//   const { userId } = req.params;

//   const { userId: payloadUserId, status } = req.payload;

  const options = {
    page,
    limit,
  };

  try {
   

    const myAggregate = Due_Deligence.aggregate([

       {
        $match: {isSubmited: true}
       },
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




exports.approveDueDeligence = async(req,res,next) => {
    req.body.isAdminAproved = "Verified"
    next()
}
exports.rejectDueDeligence = async(req,res,next) => {
    req.body.isAdminAproved = "Rejected"
    next()
}
exports.statusDueDeligence = async(req,res,next) => {
    const {userId} = req.params
    const {isAdminAproved, rejection_reason} = req.body

    try {
        // console.log(userId, isAdminAproved)

      const data = await Due_Deligence.findByIdAndUpdate(userId, {
            isAdminAproved
        }, {new:true}).populate("user");
        
        if(!data) {

           return next(errorHandler(500, "updated fail"))
        }

        if(isAdminAproved === "Rejected") {
// console.log(rejection_reason, data.user.email)

     mailerController(GeneralMailOption({email: data.user.email, text: rejection_reason, title: "Propsverse Due Deligence Rejection"}))

        }

        return res.status(200).json({ status: "success", data: data});
        
    } catch (error) {
        next(errorHandler(500, "updated fail"))
    }
}
