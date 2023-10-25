// Import necessary dependencies and modules
import {
    NotInterestedEntity,
    NotInterestedModel,
  } from "@domain/notInterested/entities/notInterested_entities";
  import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";
  import { NotInterestedDataSource } from "@data/notInterested/datasources/notInterested-datasource";
  import { Either, Left, Right } from "monet";
  import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
  import * as HttpStatus from "@presentation/error-handling/http-status";
  
  // Implement the NotInterestedRepository interface with NotInterestedRepositoryImpl class
  export class NotInterestedRepositoryImpl implements NotInterestedRepository {
    // Define a private member "dataSource" of type NotInterestedDataSource
    private readonly dataSource: NotInterestedDataSource;
  
    // Constructor that accepts a "dataSource" parameter and sets it as a member
    constructor(dataSource: NotInterestedDataSource) {
      this.dataSource = dataSource;
    }
  
    // Implement the "createNotInterested" method defined in the NotInterestedRepository interface
    async createNotInterested(
      notInterested: NotInterestedModel
    ): Promise<Either<ErrorClass, NotInterestedEntity>> {
      try {
        // Create a new saved job using the "dataSource" and return it as a Right Either
        const i = await this.dataSource.create(notInterested);
        return Right<ErrorClass, NotInterestedEntity>(i);
      } catch (error: any) {
        console.log(error);
  
        // Handle error cases:
        // If the error is an unauthorized ApiError with a status code of 401, return it as Left
        if (error instanceof ApiError && error.status === 401) {
          return Left<ErrorClass, NotInterestedEntity>(ApiError.unAuthorized());
        }
  
        // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, NotInterestedEntity>(
          ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
        );
      }
    }
  
    // Implement the "deleteNotInterested" method defined in the NotInterestedRepository interface
    async deleteNotInterested(id: string): Promise<Either<ErrorClass, void>> {
      try {
        // Delete the saved job with the given ID using the "dataSource" and return success as Right
        const res = await this.dataSource.delete(id);
        return Right<ErrorClass, void>(res);
      } catch (error: any) {
        // Return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, void>(
          ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
        );
      }
    }
  
    // Implement the "updateNotInterested" method defined in the NotInterestedRepository interface
    async updateNotInterested(
      id: string,
      data: NotInterestedModel
    ): Promise<Either<ErrorClass, NotInterestedEntity>> {
      try {
        // Update the saved job with the given ID using the "dataSource" and return the updated job as Right
        const response = await this.dataSource.update(id, data);
        return Right<ErrorClass, NotInterestedEntity>(response);
      } catch (error: any) {
        // Return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, NotInterestedEntity>(
          ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
        );
      }
    }
  
    // Implement the "getNotInteresteds" method defined in the NotInterestedRepository interface
    async getNotInteresteds(): Promise<Either<ErrorClass, NotInterestedEntity[]>> {
      try {
        // Retrieve all saved jobs using the "dataSource" and return them as Right
        const response = await this.dataSource.getAll();
        return Right<ErrorClass, NotInterestedEntity[]>(response);
      } catch (error: any) {
        // Handle error cases:
        // If the error is a not-found ApiError with a status code of 404, return it as Left
        if (error instanceof ApiError && error.status === 404) {
          return Left<ErrorClass, NotInterestedEntity[]>(ApiError.notFound());
        }
  
        // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, NotInterestedEntity[]>(
          ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
        );
      }
    }
  
    // Implement the "getNotInterestedById" method defined in the NotInterestedRepository interface
    async getNotInterestedById(
      id: string
    ): Promise<Either<ErrorClass, NotInterestedEntity>> {
      try {
        // Retrieve the saved job with the given ID using the "dataSource"
        const response = await this.dataSource.read(id);
  
        // If the response is null, return a not-found ApiError as Left
        if (response === null) {
          return Left<ErrorClass, NotInterestedEntity>(ApiError.notFound());
        }
  
        // Otherwise, return the saved job as Right
        return Right<ErrorClass, NotInterestedEntity>(response);
      } catch (error: any) {
        // Return a custom error with a BAD_REQUEST status and the error message as Left
        return Left<ErrorClass, NotInterestedEntity>(
          ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
        );
      }
    }
  }