import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { RealtorDataSource } from "@data/realtors/datasources/realtor-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import env from "../../../main/config/env";

dotenv.config();

export class RealtorRepositoryImpl implements RealtorRepository {
  private readonly dataSource: RealtorDataSource;

  constructor(dataSource: RealtorDataSource) {
    this.dataSource = dataSource;
  }

  async createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    // return await this.dataSource.create(realtor);
    try {
      let i = await this.dataSource.create(realtor);
      return Right<ErrorClass, RealtorEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "conflict"){
        return Left<ErrorClass, RealtorEntity>(ApiError.emailExist());
      }
      return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
    }
  }

  async getRealtors(): Promise<Either<ErrorClass, RealtorEntity[]>> {
    // return await this.dataSource.getAllRealtors();
    try {
      let i = await this.dataSource.getAllRealtors();
      return Right<ErrorClass, RealtorEntity[]>(i);
    } catch {
      return Left<ErrorClass, RealtorEntity[]>(ApiError.badRequest());
    }
  }

  async getRealtorById(id: string): Promise<Either<ErrorClass, RealtorEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, RealtorEntity | null>(i);
    } catch {
      return Left<ErrorClass, RealtorEntity | null>(ApiError.badRequest());
    }
  }

  async updateRealtor(id: string, data: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, RealtorEntity>(i);
    } catch {
      return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
    }
  }

  async deleteRealtor(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

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

// export class MediaDataSourceImpl implements MediaDataSource {
  
// }

