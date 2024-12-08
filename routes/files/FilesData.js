const express = require("express");
const DataUriParser = require('datauri/parser');
const path = require("path");
const cloudinary = require("cloudinary").v2;

const Photos = require("../../model/photos");

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString()

  return parser.format(extName, file.buffer);
}

const route = express.Router();
// const Aws = require("@aws-sdk");

const {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  // getSignedUrl,
  // S3RequestPresigner,
  getSignedUrl
} = require("@aws-sdk/s3-request-presigner");
// } = require("@aws-sdk/credential-provider-http/");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { errorHandler } = require("../../utils/error");


const s3 = new S3Client();

const storage = multer.memoryStorage();
const uploadMulter = multer({storage}).array();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        contentDisposition: "attachment",
        contentType: file.mimetype,
      });
    },
    key: function (req, file, cb) {
      cb(null, `${new Date()}+${file.originalname}`);
    },
  }),
});

route.post(
  "/upload/:userId",
  upload.any("file"),
  async function (req, res, next) {
    const { userId } = req.params;
   
    if (userId !== req?.payload?.userId)
      next(errorHandler(403, "route forbidden"));

    const response = await req?.files.map((file) => {
      const createdAt = file.key.split("+")[0];

      return {
        location: file.location,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        key: file.key,
        createdAt,
      };
    });

    return res.status(200).json({
      message: "file uploaded successfully.",
      status: "success",
      data: response,
    });
  }
);

route.get(
  "/list/:userId",
  async (req, res) => {
    const { userId } = req.params;
    if (userId !== req?.payload?.userId)
      next(errorHandler(403, "route forbidden"));
    try {
      let r = await s3.send(new ListObjectsCommand({ Bucket: BUCKET_NAME }));
      // let response = r.Contents.map(item => item.Key);

      return res.status(200).json({
        message: "file listed successfully.",
        status: "success",
        data: r,
      });
    } catch (error) {
      // console.error(error);
      return next(errorHandler(500, "Internal Server Error"));
    }
  }
);

route.get(
  "/download/:userId/:filename",
  async (req, res, next) => {
    // if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"))
    const filename = req.params.filename;

    const input = {
      Bucket: BUCKET_NAME.toString(),
      Key: filename.toString(),
      //   "Range": "bytes=0-9"
    };

    try {
      res.setHeader("Content-disposition", `attachment; filename=${filename}`);
      
      res.attachment(filename);

      const command = await s3.send(new GetObjectCommand(input));

      if (!command) {
        return next(errorHandler(404, "download failed."));
      }

      const response = command.Body;

      response.pipe(res);

    } catch (error) {
      return next(errorHandler(404, "download failed."));
    }
  }
);

route.get(
  "/downloads3/:filename",
  // developerInfoValidator,
  async (req, res, next) => {
    // if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"))
    const filename = req.params.filename;

    const input = {
      Bucket: BUCKET_NAME.toString(),
      Key: filename.toString(),
      Expires: 3600
      //   "Range": "bytes=0-9"
    };
    // AWS_REGION

    const s3 = new S3Client({ region: process.env.AWS_REGION , s3_host_name: `s3-${process.env.AWS_REGION}.amazonaws.com`, })
  
    const command = new GetObjectCommand(input);

    try {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
           return res.status(200).json({
        message: "File downloaded Successfully.",
        status: "success",
        data: signedUrl,
      });
    } catch (err) {
        next(errorHandler(404, "download failed."));
    }
    
  }
);

route.delete(
  "/delete/:userId/:filename",
  async (req, res) => {
    const filename = req.params.filename;
    try {
      await s3.send(
        new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename })
      );

      return res.status(200).json({
        message: "File Deleted Successfully.",
        status: "success",
      });
    } catch (error) {
      // console.error(error);
      return next(errorHandler(500, "Internal Server Error"));
    }
  }
);




route.post("/fileupload",uploadMulter, async(req,res, next) => {

  // const userId = req.payload.userId;
  if (!req?.payload?.userId) return next(errorHandler(403, "route forbidden"));
   
    try {

        let images = [];

       for await (const img of req.files) {
       
          const file =  getDataUri(img);

          const result = await cloudinary.uploader.upload(file.content, {folder: "propsversePhotos",});
          // display_name:  img.originalname

          if(result){
           
            const url =  cloudinary.url(result.public_id, {
              transformation: [
                  {
                      quality: "auto",
                      fetch_format: "auto",
                  },
                  {
                      width: 500,
                      height: 500,
                      crop: "fill",
                      gravity: "auto"
                  }
              ]
            });
  
        const photoResponse =    await Photos.create({
              user: req?.payload?.userId,
          
              location: url,
              originalname: result.display_name,
              mimetype: result.format,
              size: result.bytes,
              key: result.public_id

            });

            const {user,__v,updatedAt,_id, ...rest} = photoResponse._doc
             images.push(rest)
          } 
        }

    return res.status(200).json({
      message: "file uploaded successfully.",
      status: "success",
      data: images,
    });

    } catch (error) {
       return errorHandler(res, 400, "photo upload failed");
    }


});


route.delete(
  "/filedelete/:originalname",
  async (req, res, next) => {
    const originalname = req.params.originalname;

    try {

      const photoResponse =    await Photos.findOne({originalname});

      if(!photoResponse) {
        return next(errorHandler(400, "invalid image "));
      }


      if(photoResponse?.user?.toString() !== req?.payload?.userId || req?.payload?.status !== "Admin" ) {
        return next(errorHandler(401, "unauthorise"));
      }
       

      const isAvatar = await cloudinary.api.resource(photoResponse.key).then(result=>{
        return result

       }).catch(() => {
       return null
       })


   if(isAvatar) {
    await cloudinary.uploader.destroy(photoResponse.key);
    await Photos.deleteOne({_id: photoResponse._id})
       } else {
        return next(errorHandler(400, "invalid image "));
       }



      return res.status(200).json({
        message: "File Deleted Successfully.",
        status: "success",
      });


    } catch (error) {
      next(errorHandler(500, "Internal Server Error"));
    }
  }
);

route.get(
  "/image/:originalname",
  async (req, res, next) => {
    const originalname = req.params.originalname;

    try {

      const photoResponse =    await Photos.findOne({originalname});

      if(!photoResponse) {
        return next(errorHandler(400, "invalid image "));
      }


      const isAvatar = await cloudinary.api.resource(photoResponse.key).then(result=>{
        return result

       }).catch(() => {
       return null
       })


   if(isAvatar) {
           
      const url =  cloudinary.url(photoResponse.key, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto",
            },
            {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "auto"
            }
        ]
      });

      return res.status(200).json({
        status: "success",
        data: url
      });


       } else {
        return next(errorHandler(400, "invalid image "));
       }



    


    } catch (error) {
      next(errorHandler(500, "Internal Server Error"));
    }
  }
);





module.exports = route;
