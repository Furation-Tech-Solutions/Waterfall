import ApiError from "@presentation/error-handling/api-error";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import env from "../../../main/config/env";

dotenv.config();

export interface MediaDataSource {
  getPresignedUrl(media: string): Promise<string>;
  // deleteBrandLogo(): Promise<string>;
  // updateUrl(key:string):Promise<string>
}

export class MediaDataSourceImpl implements MediaDataSource {
  async getPresignedUrl(media: string): Promise<string> {
    try {
      const s3 = new AWS.S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: env.accessKeyId,
          secretAccessKey: env.secretAccessKey,
        },
      });

      console.log("media in datasource", media);

      const params = {
        Bucket: "sikkaplay.com-assets",
        Key: `assets/Avtar/${media}`,
        Expires: 3600,
      };
      return await s3.getSignedUrlPromise("putObject", params);
    } catch (error) {
      throw ApiError.awsPresigningError();
    }
  }
}