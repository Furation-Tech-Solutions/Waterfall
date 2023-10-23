// Import necessary modules and dependencies
import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { RealtorDataSource } from "@data/realtors/datasources/realtor-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import env from "../../../main/config/env";

// Load environment variables from a .env file
dotenv.config();

// Define the implementation of the RealtorRepository interface
export class RealtorRepositoryImpl implements RealtorRepository {
  private readonly realtorDataSource: RealtorDataSource;

  constructor(realtorDataSource: RealtorDataSource) {
      this.realtorDataSource = realtorDataSource;
  }

  // Create a new Realtor entity
  async createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
      try {
          const realtors = await this.realtorDataSource.create(realtor); // Use the realtor data source
          return Right<ErrorClass, RealtorEntity>(realtors);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "realtor_conflict") {
              return Left<ErrorClass, RealtorEntity>(ApiError.realtorExist());
          }
          return Left<ErrorClass, RealtorEntity>(ApiError.customError(400, error.message));
      }
  }

  // Get all Realtor entities
  async getRealtors(q: string): Promise<Either<ErrorClass, RealtorEntity[]>> {
      try {
          const realtors = await this.realtorDataSource.getAllRealtors(q); // Use the tag realtor data source
          return Right<ErrorClass, RealtorEntity[]>(realtors);
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, RealtorEntity[]>(ApiError.notFound());
          }
          return Left<ErrorClass, RealtorEntity[]>(ApiError.badRequest());
      }
  }

  // Get a Realtor entity by ID
  async getRealtorById(id: string): Promise<Either<ErrorClass, RealtorEntity>> {
      try {
          const realtor = await this.realtorDataSource.read(id); // Use the tag realtor data source
          return realtor
              ? Right<ErrorClass, RealtorEntity>(realtor)
              : Left<ErrorClass, RealtorEntity>(ApiError.notFound());
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, RealtorEntity>(ApiError.notFound());
          }
          return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
      }
  }

  // Update a Realtor entity by ID
  async updateRealtor(id: string, data: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
      try {
          const updatedRealtor = await this.realtorDataSource.update(id, data); // Use the tag realtor data source
          return Right<ErrorClass, RealtorEntity>(updatedRealtor);
      } catch (e) {
          if (e instanceof ApiError && e.name === "conflict") {
              return Left<ErrorClass, RealtorEntity>(ApiError.emailExist());
          }
          return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
      }
  }

  // Delete a Realtor entity by ID
  async deleteRealtor(id: string): Promise<Either<ErrorClass, void>> {
      try {
          const result = await this.realtorDataSource.delete(id); // Use the tag realtor data source
          return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, void>(ApiError.notFound());
          }
          return Left<ErrorClass, void>(ApiError.badRequest());
      }
  }

  // Get a presigned URL for AWS S3 to upload media
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
