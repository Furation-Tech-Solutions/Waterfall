import { FQAModel, FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { FQADataSource } from "@data/fqa/datasources/fqa-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import env from "../../../main/config/env";

dotenv.config();

export class FQARepositoryImpl implements FQARepository {
  private readonly fqaDataSource: FQADataSource;
  constructor(fqaDataSource: FQADataSource) {
      this.fqaDataSource = fqaDataSource;
  }

  async createFQA(fqa: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
      try {
          const fqas = await this.fqaDataSource.create(fqa); // Use the fqa data source
          return Right<ErrorClass, FQAEntity>(fqas);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "badRequest") {
              return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
          }
          return Left<ErrorClass, FQAEntity>(ApiError.customError(400, error.message));
      }
  }
}

