const express = require("express");


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

module.exports = route;
