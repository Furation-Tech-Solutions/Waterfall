// Import necessary modules and dependencies
import {
  BlockingModel,
  BlockingEntity,
} from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import {
  BlockQuery,
  BlockingDataSource,
} from "@data/blocking/datasources/blocking-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

// Define a class for BlockingRepository implementation
export class BlockingRepositoryImpl implements BlockingRepository {
  private readonly blockingDataSource: BlockingDataSource;

  // Constructor to initialize the BlockingRepository with a BlockingDataSource
  constructor(blockingDataSource: BlockingDataSource) {
    this.blockingDataSource = blockingDataSource;
  }

  // Create a blocking entry
  async createBlocking(
    blocking: BlockingModel
  ): Promise<Either<ErrorClass, BlockingEntity>> {
    try {
      const blockings = await this.blockingDataSource.create(blocking); // Use the blocking data source
      return Right<ErrorClass, BlockingEntity>(blockings);
    } catch (error: any) {
      // Handle specific API error for blocked ID conflict
      if (error instanceof ApiError && error.name === "idBlocked_conflict") {
        return Left<ErrorClass, BlockingEntity>(ApiError.idBlocked());
      }
      // Handle other errors with a generic bad request error
      return Left<ErrorClass, BlockingEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  // Retrieve all blocking entries
  async getBlockings(
    query: BlockQuery
  ): Promise<Either<ErrorClass, BlockingEntity[]>> {
    try {
      const blockings = await this.blockingDataSource.getAllBlockings(query); // Use the tag blocking data source
      return Right<ErrorClass, BlockingEntity[]>(blockings);
    } catch (e) {
      // Handle specific API error for not found
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, BlockingEntity[]>(ApiError.notFound());
      }
      // Handle other errors with a generic bad request error
      return Left<ErrorClass, BlockingEntity[]>(ApiError.badRequest());
    }
  }

  // Retrieve a blocking entry by its ID
  async getBlockingById(
    id: string
  ): Promise<Either<ErrorClass, BlockingEntity>> {
    try {
      const blocking = await this.blockingDataSource.read(id); // Use the tag blocking data source
      return blocking
        ? Right<ErrorClass, BlockingEntity>(blocking)
        : Left<ErrorClass, BlockingEntity>(ApiError.notFound());
    } catch (e) {
      // Handle specific API error for not found
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, BlockingEntity>(ApiError.notFound());
      }
      // Handle other errors with a generic bad request error
      return Left<ErrorClass, BlockingEntity>(ApiError.badRequest());
    }
  }

  // Update a blocking entry by ID
  async updateBlocking(
    id: string,
    data: BlockingModel
  ): Promise<Either<ErrorClass, BlockingEntity>> {
    try {
      const updatedBlocking = await this.blockingDataSource.update(id, data); // Use the tag blocking data source
      return Right<ErrorClass, BlockingEntity>(updatedBlocking);
    } catch (e) {
      // Handle specific API error for conflict
      if (e instanceof ApiError && e.name === "conflict") {
        return Left<ErrorClass, BlockingEntity>(ApiError.emailExist());
      }
      // Handle other errors with a generic bad request error
      return Left<ErrorClass, BlockingEntity>(ApiError.badRequest());
    }
  }

  // Delete a blocking entry by ID
  async deleteBlocking(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.blockingDataSource.delete(id); // Use the tag blocking data source
      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e) {
      // Handle specific API error for not found
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      // Handle other errors with a generic bad request error
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }
}
