const User = require("../../model/user")
const { ObjectId } = require("mongodb");
const Due_Deligence = require("../../model/developer/due_deligence");
const Docs = require("../../model/developer/property_docs");
const { errorHandler } = require("../../utils/error");

exports.get_Due_deligence = async (req, res, next) => {
    const { userId } = req.params

    const {userId: payloadUserId, status} = req.payload
    
    try {

        if((userId === payloadUserId || status === "Admin") ) {
            const data = await Due_Deligence.findById(userId)
       
           return res.status(200).json({status:"success", data})
            
        } 

      

       return next(errorHandler(400, "Unauthorise"))

    } catch (error) {
        next(error)
    }
}


exports.due_Deligence_Submit = (req, res, next) => {
    req.body.isSubmited = true
    next()
}
exports.due_Deligence_Draft = (req, res, next) => {
    req.body.isSubmited = false
    next()
}


exports.update_Due_deligence = async (req, res, next) => {
    const { userId } = req.params

    const {userId: payloadUserId, status} = req.payload

    const     {
        isSubmited,
        company_information,
       
            previous_project_1,
            previous_project_2,
            previous_project_3,
    

            Current_Company_Valuation,
            Valuation_Method_Used,
            Last_Financial_Audit_Date,
            supporting_documents,
           
       
            reference_1,
            reference_2,
            reference_3,
            recognition,
            recognition_documents,
        
        declaration,
       } = req.body
    
    try {

       const userData = await User.findById(payloadUserId)

        if(userData) {
           
            const data = await Due_Deligence.findByIdAndUpdate(payloadUserId, 
                {
                    isSubmited,
             company_information: {
                 ...(company_information.name && {name: company_information.name}),
                 ...(company_information.address && {address: company_information.address}),
                ...({ website: company_information.website}),
                 ...(company_information.phone_number && {phone_number: company_information.phone_number})
                },
             projects: {
                 previous_project_1: {
                     cost: {
                        ...(previous_project_1.cost.amount && { amount: previous_project_1.cost.amount}),
                         ...(previous_project_1.cost.currency && {currency: previous_project_1.cost.currency})
                        },
                     project_partners: {
                         partner_1: {
                             ...(previous_project_1.project_partners.partner_1.name && {name: previous_project_1.project_partners.partner_1.name}),
                             ...(previous_project_1.project_partners.partner_1.contact && {contact: previous_project_1.project_partners.partner_1.contact})
                            },
                         partner_2: {
                             ...(previous_project_1.project_partners.partner_2.name && {name: previous_project_1.project_partners.partner_2.name}),
                             ...(previous_project_1.project_partners.partner_2.contact && {contact: previous_project_1.project_partners.partner_2.contact})
                            }
                        },
                     ...(previous_project_1.name && {name: previous_project_1.name}),
                     ...(previous_project_1.location && {location: previous_project_1.location}),
                     ...(previous_project_1.type && {type: previous_project_1.type}),
                     ...(previous_project_1.documents && {documents: previous_project_1.documents}),
                    },
                 previous_project_2: {
                     cost: {
                        ...(previous_project_2.cost.amount && { amount: previous_project_2.cost.amount}),
                         ...(previous_project_2.cost.currency && {currency: previous_project_2.cost.currency})
                        },
                     project_partners: {
                         partner_1: {
                             ...(previous_project_2.project_partners.partner_1.name && {name: previous_project_2.project_partners.partner_1.name}),
                             ...(previous_project_2.project_partners.partner_1.contact && {contact: previous_project_2.project_partners.partner_1.contact})
                            },
                         partner_2: {
                             ...(previous_project_2.project_partners.partner_2.name && {name: previous_project_2.project_partners.partner_2.name}),
                             ...(previous_project_2.project_partners.partner_2.contact && {contact: previous_project_2.project_partners.partner_2.contact})
                            }
                        },
                     ...(previous_project_2.name && {name: previous_project_2.name}),
                     ...(previous_project_2.location && {location: previous_project_2.location}),
                     ...(previous_project_2.type && {type: previous_project_2.type}),
                     ...(previous_project_2.documents && {documents: previous_project_2.documents}),
                    },
                 previous_project_3: {
                     cost: {
                        ...(previous_project_3.cost.amount && { amount: previous_project_3.cost.amount}),
                         ...(previous_project_3.cost.currency && {currency: previous_project_3.cost.currency})
                        },
                     project_partners: {
                         partner_1: {
                             ...(previous_project_3.project_partners.partner_1.name && {name: previous_project_3.project_partners.partner_1.name}),
                             ...(previous_project_3.project_partners.partner_1.contact && {contact: previous_project_3.project_partners.partner_1.contact})
                            },
                         partner_2: {
                             ...(previous_project_3.project_partners.partner_2.name && {name: previous_project_3.project_partners.partner_2.name}),
                             ...(previous_project_3.project_partners.partner_2.contact && {contact: previous_project_3.project_partners.partner_2.contact})
                            }
                        },
                     ...(previous_project_3.name && {name: previous_project_3.name}),
                     ...(previous_project_3.location && {location: previous_project_3.location}),
                     ...(previous_project_3.type && {type: previous_project_3.type}),
                     ...(previous_project_3.documents && {documents: previous_project_3.documents}),
                    },
                },
             financials: {
                 Current_Company_Valuation: {
                     ...(Current_Company_Valuation.amount && {amount: Current_Company_Valuation.amount}),
                     ...(Current_Company_Valuation.currency && {currency: Current_Company_Valuation.currency})
                    },
                 ...(Valuation_Method_Used && {Valuation_Method_Used}),
                 ...(Last_Financial_Audit_Date && {Last_Financial_Audit_Date}),
                 ...(supporting_documents && {supporting_documents}),
                },


             references_and_recognition: {
                 reference_1: {
                     ...(reference_1.name && {name: reference_1.name}),
                     ...(reference_1.title && {title: reference_1.title}),
                     ...(reference_1.contact && {contact: reference_1.contact}),
                    },
                 reference_2: {
                    ...(reference_2.name && {name: reference_2.name}),
                    ...(reference_2.title && {title: reference_2.title}),
                    ...(reference_2.contact && {contact: reference_2.contact}),
                    },
                 reference_3: {
                    ...(reference_3.name && {name: reference_3.name}),
                    ...(reference_3.title && {title: reference_3.title}),
                    ...(reference_3.contact && {contact: reference_3.contact}),
                    },
                 ...(recognition && {recognition}),
                 ...(recognition_documents && {recognition_documents})
                },
             declaration: {
                ...(declaration.name && { name: declaration.name}),
                ...(declaration.title && { title: declaration.title})
                },
            }, {

                new: true
            }
            )

       
           return res.status(200).json({status:"success", data})
      
        } else {

            return next(errorHandler(400, "Unauthorise"))
        }

      


    } catch (error) {
        next(error)
    }
}

exports.update_Due_deligence_company_profile = async (req, res, next) => {
    const { userId } = req.params

    const {userId: payloadUserId, status} = req.payload

    const     {
        cover_image,
        about,
        logo
       } = req.body
    
    try {
       
        if((userId === payloadUserId || status === "Admin") ) {
           
            const data = await Due_Deligence.findByIdAndUpdate(userId, 
                {
             company_information: {
                 ...(logo && {logo}),
                 ...(about && {about}),
                 ...(cover_image && {cover_image})
                },
            }, {

                new: true
            }
            )

       
           return res.status(200).json({status:"success", data})
            
        } 

      

       return next(errorHandler(400, "Unauthorise"))

    } catch (error) {
        next(error)
    }
}




/**
 * handle developer docs
 */
exports.createDocs = async(req, res,next) => {
    const {investor_name, documents } = req.body
    const {userId} = req.params
    try {

        if(documents?.length === 0){
            return next(errorHandler(400, "No uploaded file"));
        }


        const data = await Docs.create({investor_name, user:userId ,documents, status: "Uploaded"})

        return res.status(200).json({status:"success", data})
       
    } catch (error) {
        next(errorHandler(400, "Unauthorise"))
    }
}

exports.userUploadedDocs = async(req, res,next) => {
   
    const {userId} = req.params

    const page = parseInt(req?.query?.page) || 1;

    const limit = parseInt(req?.query?.limit) || 10;
    const searchText = req?.query?.searchText;
  
  
    const options = {
      page,
      limit,
    };

    let query = [
        {
            $match: {user: new ObjectId(userId)}
        }
    ]

    if(searchText) {
        query.push({
            $match: {
              $or: [
                {
                    investor_name: {
                    $regex: ".*" + searchText + ".*",
                    $options: "i",
                  },
                },
              ],
            },
          })
      }
    
   
    try {

        const myAggregate = Docs.aggregate(query);
      
          const paginationResult = await Docs.aggregatePaginate(
            myAggregate,
            options
          );
      
          return res.status(200).json({ status: "success", data: paginationResult });

       
    } catch (error) {
        next(errorHandler(400, "failed to fetch"))
    }
}


exports.docDetail = async(req, res,next) => {
    const {docId} = req.params
   
    try {
        const data = await Docs.findById(docId)

        return res.status(200).json({status:"success", data})
       
    } catch (error) {
        next(errorHandler(400, "failed to fetch"))
    }
}















