import { ScrapperEntity, ScrapperModel } from "@domain/scrapping/entities/scrapper";
import { ScrapperRepository } from "@domain/scrapping/repositories/scrapper-repository";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either, Left, Right } from "monet";
import { ScrapperDataSource } from "../datasource/scrapper-data-source";
import * as HttpStatus from "@presentation/error-handling/http-status";


// Implement the SupportRepository interface with SupportRepositoryImpl class
export class ScrapperRepositoryImpl implements ScrapperRepository {
    // Define a private member "dataSource" of type SupportDataSource
    private readonly dataSource: ScrapperDataSource;
  
    // Constructor that accepts a "dataSource" parameter and sets it as a member
    constructor(dataSource: ScrapperDataSource) {
      this.dataSource = dataSource;
    }
  
    // Implement the "createSupport" method defined in the SupportRepository interface
    async getScrapper(
      scrapper: ScrapperModel
    ): Promise<Either<ErrorClass, ScrapperEntity>> {

      try {
        // Create a new support entity using the "dataSource" and return it as a Right Either
        const i = await this.dataSource.create(scrapper);
        return Right<ErrorClass, ScrapperEntity>(i);
      } catch (error: any) {
        // Handle error cases:
        // If the error is an unauthorized ApiError with a status code of 401, return it as Left
        if (error instanceof ApiError && error.status === 401) {
          return Left<ErrorClass, ScrapperEntity>(ApiError.unAuthorized());
        }
  
        // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, ScrapperEntity>(
          ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
        );
      }
    }
}
  