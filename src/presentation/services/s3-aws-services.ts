import AWS from "aws-sdk";
import { Request, Response } from "express";
import env from '@main/config/env'

class S3MediaUploader {
    private readonly s3Bucket: AWS.S3;
    constructor() {
        this.s3Bucket = new AWS.S3({
            region: "ap-south-1",
            credentials: {
                accessKeyId: env.accessKeyId,
                secretAccessKey: env.secretAccessKey,
            },
        });
    }

    async getPreSignedUrl(req: Request, res: Response) {
        try {
          const fileName: string = req.params.fileName;
          const dataType: string = req.params.dataType;
    
          const uniqueIdentifier = Date.now();
          const fileNameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'));
          const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
    
          let path = "";
          if (dataType === "template") {
            path = `template/${fileNameWithoutExtension}.${fileExtension}`;
          } else {
            path = `${dataType}/${uniqueIdentifier}_${fileNameWithoutExtension}.${fileExtension}`;
          }
          const params = {
            Bucket: "waterfall-general-storage-dev",
            Key: path,
            Expires: 3600,
          };
    
          const presignedUrl = await this.s3Bucket.getSignedUrlPromise("putObject",params);
          
          const mediaUrl = presignedUrl.split('?')[0];
          res.status(200).json({ "presignedurl": presignedUrl, "media_url": mediaUrl });
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
    }

   
}
export default S3MediaUploader;
