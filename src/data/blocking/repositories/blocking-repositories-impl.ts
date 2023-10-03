import { BlockingModel, BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { BlockingDataSource } from "@data/blocking/datasources/blocking-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import env from "../../../main/config/env";

dotenv.config();

export class BlockingRepositoryImpl implements BlockingRepository {
  private readonly blockingDataSource: BlockingDataSource;
  constructor(blockingDataSource: BlockingDataSource) {
      this.blockingDataSource = blockingDataSource;
  }

  async createBlocking(blocking: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
      try {
          const blockings = await this.blockingDataSource.create(blocking); // Use the blocking data source
          return Right<ErrorClass, BlockingEntity>(blockings);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "badRequest") {
              return Left<ErrorClass, BlockingEntity>(ApiError.badRequest());
          }
          return Left<ErrorClass, BlockingEntity>(ApiError.customError(400, error.message));
      }
  }

  async getBlockings(): Promise<Either<ErrorClass, BlockingEntity[]>> {
      try {
          const blockings = await this.blockingDataSource.getAllBlockings(); // Use the tag blocking data source
          return Right<ErrorClass, BlockingEntity[]>(blockings);
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, BlockingEntity[]>(ApiError.notFound());
          }
          return Left<ErrorClass, BlockingEntity[]>(ApiError.badRequest());
      }
  }
}

