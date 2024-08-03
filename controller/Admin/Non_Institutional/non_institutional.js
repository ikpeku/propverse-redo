const Activities = require("../../../model/developer/property_activities")
const { errorHandler } = require("../../../utils/error")
const User = require("../../../model/user");

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
  
    const { userId } = req.params;
  
    //   const { userId: payloadUserId, status } = req.payload;
  
    const options = {
      page,
      limit,
    };



    let query =  [
        {
          $match: { account_type: "Non-Institutional Investor" }
        },
        {
            $lookup: {
              from: "property_investments",
              localField: "transactions",
              foreignField: "investor",
              as: "transactions_lookup",
            },
          },

        //   {
        //     $group: {
        //         _id: null
        //     }
        //   }
          {
            $addFields: {
              ammount_invested: {
                $sum: "$transactions_lookup.paid.amount",
              },
            },
          },

        // "paid": {
        //     "amount": 200,


      ]


      if(searchText){
        query.push({ username: { $regex: ".*" + searchText + ".*", $options: "i" } })
      }




      query.push(
        {
            $project: {
              username: 1,
              country: 1,
              email: 1,
              createdAt: 1,
              _id: 1,
    "accreditation.status": 1,
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

