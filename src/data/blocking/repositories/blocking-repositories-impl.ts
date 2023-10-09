// Import necessary modules and dependencies
import { BlockingModel, BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { BlockingDataSource } from "@data/blocking/datasources/blocking-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

// Define a class for BlockingRepository implementation
export class BlockingRepositoryImpl implements BlockingRepository {
  private readonly blockingDataSource: BlockingDataSource;

  constructor(blockingDataSource: BlockingDataSource) {
      this.blockingDataSource = blockingDataSource;
  }

  // Create a blocking entry
  async createBlocking(blocking: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
      try {
          const blockings = await this.blockingDataSource.create(blocking); // Use the blocking data source
          return Right<ErrorClass, BlockingEntity>(blockings);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "idBlocked_conflict") {
              return Left<ErrorClass, BlockingEntity>(ApiError.idBlocked());
          }
          return Left<ErrorClass, BlockingEntity>(ApiError.customError(400, error.message));
      }
  }

  // Retrieve all blocking entries
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

  // Retrieve a blocking entry by its ID
  async getBlockingById(id: string): Promise<Either<ErrorClass, BlockingEntity>> {
      try {
          const blocking = await this.blockingDataSource.read(id); // Use the tag blocking data source
          return blocking
              ? Right<ErrorClass, BlockingEntity>(blocking)
              : Left<ErrorClass, BlockingEntity>(ApiError.notFound());
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, BlockingEntity>(ApiError.notFound());
          }
          return Left<ErrorClass, BlockingEntity>(ApiError.badRequest());
      }
  }

  // Update a blocking entry by ID
  async updateBlocking(id: string, data: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
      try {
          const updatedBlocking = await this.blockingDataSource.update(id, data); // Use the tag blocking data source
          return Right<ErrorClass, BlockingEntity>(updatedBlocking);
      } catch (e) {
          if (e instanceof ApiError && e.name === "conflict") {
              return Left<ErrorClass, BlockingEntity>(ApiError.emailExist());
          }
          return Left<ErrorClass, BlockingEntity>(ApiError.badRequest());
      }
  }

  // Delete a blocking entry by ID
  async deleteBlocking(id: string): Promise<Either<ErrorClass, void>> {
      try {
          const result = await this.blockingDataSource.delete(id); // Use the tag blocking data source
          return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, void>(ApiError.notFound());
          }
          return Left<ErrorClass, void>(ApiError.badRequest());
      }
  }
}
