const InstitutionalUser = require("../../../model/institutional/primaryContactDetails");
const { errorHandler } = require("../../../utils/error");
const { ObjectId } = require("mongodb");
const Funds = require("../../../model/institutional/fund");
const Kyc = require("../../../model/compliance/kyc");
const Limited_partners = require("../../../model/institutional/limitedpartners");

exports.get_All_Institutional = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
  
    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;

    const status = req?.query?.status;


  const customLabels = {
    docs: 'data',
  };
    const options = {
      page,
      limit,
      customLabels
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
                $unwind: "$user"
            },
        {
           $lookup: {
                from: "transactions",
                localField: "fundsRaise",
                foreignField: "_id",
                as: "property_invested",
              },
            },
            {
              $addFields:{
                fundSize: {
                 "$sum": { $sum: "$property_invested.paid.amount"}
                }
              }
            },
            {
                $lookup: {
                     from: "users",
                     localField: "limitedPartners",
                     foreignField: "_id",
                     as: "limitedPartners",
                   },
                 },
                

     {
            $project: {
              username: "$user.username",
              country:"$user.country",
              dateJoined:"$user.createdAt",
              fundSize: "$fundSize",
              limitedPartners: { $cond: { if: { $isArray: "$limitedPartners" }, then: { $size: "$limitedPartners" }, else: "NA"} },
              status: {
                $cond: { if: { $gte: [ "$user.verify_account", true ] }, then: "Verified", else: "Not Verified" }
              },
              _id: "$user._id",
              
            },
          },
          {
            $sort: {
                updatedAt: -1,
            },
          },

      ]



      if(searchText){

        query.push({
          $match: {
            $or: [
              { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { country: { $regex: ".*" + searchText + ".*", $options: "i" } },
              { status: searchText},
              { fundSize: { $regex: ".*" + searchText + ".*", $options: "i" } },
            ]
          }
        })

    }

        
      if(status){
        query.push({
          $match: {status}
        })
      }
 


    try {
      const myAggregate = InstitutionalUser.aggregate(query);

  
  
      const paginationResult = await InstitutionalUser.aggregatePaginate(
        myAggregate,
        options
      );
   
  
      return res.status(200).json({ ...paginationResult });
    } catch (error) {

      next(errorHandler(500, "network error"));      
    }
  }


exports.get_Institutional = async (req, res, next) => {
    const {userId} = req.params

  let query =  [
    {
      $match: { user:  new ObjectId(userId)}
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
                $unwind: "$user"
            },
        {
           $lookup: {
                from: "transactions",
                localField: "fundsRaise",
                foreignField: "_id",
                as: "property_invested",
              },
            },
            {
              $addFields:{
                fundSize: {
                 "$sum": { $sum: "$property_invested.paid.amount"}
                }
              }
            },
            {
                $lookup: {
                     from: "users",
                     localField: "limitedPartners",
                     foreignField: "_id",
                     as: "limitedPartners",
                   },
                 },
               

     {
            $project: {
              username: "$user.username",
              avatar: "$user.avatar",
              email: "$user.email",
              contact: "$user.phone_number",
              country:"$user.country",
              dateJoined:"$user.createdAt",
              isSuspended:"$user.isSuspended",
              fundSize: "$fundSize",
              limitedPartners: { $cond: { if: { $isArray: "$limitedPartners" }, then: { $size: "$limitedPartners" }, else: "NA"} },
              status: {
                $cond: { if: { $gte: [ "$user.verify_account", true ] }, then: "Verified", else: "Not Verified" }
              },
              _id: "$user._id",
              
            },
          },
          {
            $sort: {
              updatedAt: -1,
            },
          },

      ]



    try {


        const OngoingFund = await Funds.aggregate([
            {
$match: {user:  new ObjectId(userId), funding_state: "Ongoing", isAdmin_Approved: "approved"}

            },

                      {
            $sort: {
              updatedAt: -1,
            },
          },
        ])
        const isVerify = await Kyc.findById(userId).select("isApproved")
      const data = await InstitutionalUser.aggregate(query);


      return res.status(200).json({ ...data[0],isVerify:isVerify?.isApproved ,OngoingFund });
  


    } catch (error) {

      next(errorHandler(500, "network error"));      
    }
  }


  exports.userFundById = async (req, res, next) =>{
    const {fundId} = req.params;
  
  
    const query = [
      {
        $match: { fund:  fundId}
      },
     
      {
        $lookup: {
          from: "funds",
          localField: "fund",
          foreignField: "_id",
          let: {userId: "$user"},
          pipeline: [
  
            {
              $set: {userId: "$$userId"}
            },
  
          {
          $lookup: {
            from: "transactions",
            localField: "investments",
            foreignField: "_id",
            pipeline: [
              {
                 $project: {
                  investor: 1,
                  description: 1,
                  paymentDate: 1,
                  // funder: 1,
                  paid:1
                 }
              }
           ] ,
            as: "investmenttxn",
          },
        },
       
            {
              $project: {
                name: 1,
                property_type: 1,
                distribution_period: 1,
                funds_documents: 1,
                transaction_items: {
                  $filter: {
                     input: "$investmenttxn",
                     as: "investmentitem",
                     cond: { $eq: ["$$investmentitem.investor", "$userId" ] }
                  }
               }
              }
            }
          ],
          as: "fund",
        },
      },
      {
        $addFields: {
          fund_detail: {
            $arrayElemAt: ["$fund", 0]
          }
        }
      },
  
         {
          $addFields: {
            invest_year: {$year: "$createdAt"}
          }
         },
         {
          $addFields: {
            current_year:{$year: new Date()}
          }
         },
         {
          $addFields: {
            nos_invested_year: {$subtract: ["$current_year", "$invest_year"]}
          }
         },
         {
          $addFields: {
            investment_increase_percentage:{$multiply:  [{ $divide: ["$fund_detail.annual_yield", 100]}, {$divide : ["$capital_deploy.amount", 100]} ]}
          }
         },
  
  
  
        {
          $project: {
            transactions: "$fund_detail.transaction_items",
            "property.name": "$fund_detail.name",
            "property.property_type": "$fund_detail.property_type",
            "funds_documents": "$fund_detail.funds_documents",
            "property.distribution_period": "$fund_detail.distribution_period",
            "property.investment_date": "$updatedAt",
            "earnings.annual_yield": "$fund_detail.annual_yield",
            "earnings.capital_invested": "$capital_deploy",
            "earnings.current_value": {$cond:  [{$eq: ["$nos_invested_year", 0]}, "$capital_deploy.amount",   { $add: [{$multiply:  ["$investment_increase_percentage", "$nos_invested_year"]}, "$capital_deploy.amount"]} ]}
         
          }
        }
    ]
  
    
    try {
      const data = await Limited_partners.aggregate(query);
  
      res.status(200).json({
        success: true,
        data: data[0] || null
      });
    } catch (error) {
      next(error);
      // next(errorHandler(500, "server error"));
    }
  }

  exports.userFundById_graph = async (req, res, next) =>{
    const {fundId} = req.params
    const year = parseInt(req?.query?.year) || new Date().getFullYear();
  
    const query = [
      {
        $match: { fund:  fundId}
      },
     
      {
        $lookup: {
          from: "funds",
          localField: "fund",
          foreignField: "_id",
          let: {userId: "$user"},
          pipeline: [
  
            {
              $set: {userId: "$$userId"}
            },
  
          {
          $lookup: {
            from: "transactions",
            localField: "investments",
            foreignField: "_id",
            pipeline: [
  
              {
                 $project: {
                  investor: 1,
                  paymentDate: 1,
                  paid: 1
                 }
              }
           ] ,
            as: "investmenttxn",
          },
        },
       
            {
              $project: {
                transaction_items: {
                  $filter: {
                     input: "$investmenttxn",
                     as: "investmentitem",
                     cond: { $eq: ["$$investmentitem.investor", "$userId" ] }
                  }
               }
              }
            }
          ],
          as: "fund",
        },
      },
      {
        $addFields: {
          fund_detail: {
            $arrayElemAt: ["$fund", 0]
          }
        }
      },
  
        {
          $project: {
            transactions: "$fund_detail.transaction_items",
          }
        }
    ]
  
    
    try {
      const data = await Limited_partners.aggregate(query);
  
      
      const chartData = data[0].transactions.reduce(function(total, item) {
  
       
  
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const d = new Date(item.paymentDate);
  
        const month = monthNames[d.getMonth()];
  
  
        if(year == d.getFullYear()){
  
          if(total[month]){
            total[month].amount += item.paid.amount
            total[month].currency = item.paid.currency
         }
  
        }
        
        return total;
  }, {
    January :{
      amount: 0,
      currency: "$"
    },
    February :{
      amount: 0,
      currency: "$"
    },
    March :{
      amount: 0,
      currency: "$"
    },
    April :{
      amount: 0,
      currency: "$"
    },
    May :{
      amount: 0,
      currency: "$"
    },
    June :{
      amount: 0,
      currency: "$"
    },
    July :{
      amount: 0,
      currency: "$"
    },
    August :{
      amount: 0,
      currency: "$"
    },
    September :{
      amount: 0,
      currency: "$"
    },
    October :{
      amount: 0,
      currency: "$"
    },
    November : {
      amount: 0,
      currency: "$"
    },
    December : {
      amount: 0,
      currency: "$"
    }
  
  }); 
  
  
  
  
      res.status(200).json({
        success: true,
        data: chartData || null
      });
    } catch (error) {
      next(errorHandler(500, "server error"));
    }
  }