// Import necessary dependencies and modules
import { SupportEntity, SupportModel } from "@domain/support/entities/support";
import { SupportRepository } from "@domain/support/repositories/support-repository";
import { SupportDataSource } from "@data/support/datasources/support-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Implement the SupportRepository interface with SupportRepositoryImpl class
export class SupportRepositoryImpl implements SupportRepository {
  // Define a private member "dataSource" of type SupportDataSource
  private readonly dataSource: SupportDataSource;

  // Constructor that accepts a "dataSource" parameter and sets it as a member
  constructor(dataSource: SupportDataSource) {
    this.dataSource = dataSource;
  }

  // Implement the "createSupport" method defined in the SupportRepository interface
  async createSupport(
    support: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      // Create a new support entity using the "dataSource" and return it as a Right Either
      const i = await this.dataSource.create(support);
      return Right<ErrorClass, SupportEntity>(i);
    } catch (error: any) {
      console.log(error);

      // Handle error cases:
      // If the error is an unauthorized ApiError with a status code of 401, return it as Left
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, SupportEntity>(ApiError.unAuthorized());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deleteSupport" method defined in the SupportRepository interface
  async deleteSupport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the support with the given ID using the "dataSource" and return success as Right
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Implement the "updateSupport" method defined in the SupportRepository interface
  async updateSupport(
    id: string,
    data: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      // Update the support with the given ID and data using the "dataSource" and return the updated support as Right
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, SupportEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getSupports" method defined in the SupportRepository interface
  async getSupports(): Promise<Either<ErrorClass, SupportEntity[]>> {
    try {
      // Retrieve all supports using the "dataSource" and return them as Right
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, SupportEntity[]>(response);
    } catch (error: any) {
      // Handle error cases:
      // If the error is a not-found ApiError with a status code of 404, return it as Left
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, SupportEntity[]>(ApiError.notFound());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SupportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getSupportById" method defined in the SupportRepository interface
  async getSupportById(id: string): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      // Retrieve the support with the given ID using the "dataSource"
      const response = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (response === null) {
        return Left<ErrorClass, SupportEntity>(ApiError.notFound());
      }

      // Otherwise, return the support as Right
      return Right<ErrorClass, SupportEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
