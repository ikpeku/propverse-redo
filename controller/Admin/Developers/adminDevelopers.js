const Due_Deligence = require("../../../model/developer/due_deligence")
const Developers = require("../../../model/user");
const { errorHandler } = require("../../../utils/error");

exports.get_Developers = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;
  const { userId } = req.params;

  const { userId: payloadUserId, status } = req.payload;

  try {
    if (userId === payloadUserId && status === "Admin") {
      const data = await Developers.paginate(
        { account_type: "Developer", verify_account: true },
        { page }
      );

      let docs = [];

      if (data) {
        data.docs.forEach((object) => {
          docs.push({
            userId: object._id,
            username: object.username,
            country: object.country,
            email: object.email,
            createdAt: object.createdAt,
          });
        });
      }
      delete data.docs;

      data.docs = docs;

      return res.status(200).json({ status: "success", data });
    }

    return next(errorHandler(400, "Unauthorise"));
  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};


exports.get_Due_Deligence = async (req, res, next) => {
  const page = parseInt(req?.query?.page) || 1;

  const limit = parseInt(req?.query?.limit) || 10;
  const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    
  const { userId } = req.params;

  const { userId: payloadUserId, status } = req.payload;

  const options = {
    page: 1,
    limit: 10,
  };

  try {
    // if (userId === payloadUserId && status === "Admin") {
    //   const data = await Due_Deligence.paginate({ }, { page });

   

    //   const dataNumber = await Due_Deligence.find().countDocuments().exec();

    //   let response = await Due_Deligence
    //     .find()
    //     .populate("user", "username country email")
    //     .select("isAdminAproved updatedAt")
    //     .sort("field -updatedAt")
    //     .limit(limit)
    //     .skip(startIndex)
    //     .exec();

  

    //   let requestMetaData = {
    //     total_requests: dataNumber,
    //     total_pages: Math.ceil(dataNumber / limit),
    //     current_page: page,
    //     next_page: lastIndex < dataNumber ? page + 1 : null,
    //     prev_page: startIndex > 0 ? page - 1 : null,
    //   };


    //   (requestMetaData.current_request = response?.length),
    //     (requestMetaData.next_available =
    //       response?.length === limit ? true : false);

    //   paginationResult = { requestMetaData, results: response };

    //   return res.status(200).json({ status: "success", data: paginationResult });

    // }

    // return next(errorHandler(400, "Unauthorise"));

    const myAggregate = Due_Deligence.aggregate([
        {
            $match: {isSubmited: false}
        }
    ]);
 const paginationResult = await  Due_Deligence
      .aggregatePaginate(myAggregate, options)

    //   .then(function (results) {
    //     console.log(results);
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });

    return res.status(200).json({ status: "success", data: paginationResult });


  } catch (error) {
    next(errorHandler(500, "bad request"));
  }
};
