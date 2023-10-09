// Import necessary modules and dependencies
import { FeedBackModel, FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { FeedBackDataSource } from "@data/feedBack/datasources/feedBack-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

// Define the implementation class for the FeedBackRepository interface
export class FeedBackRepositoryImpl implements FeedBackRepository {
  private readonly feedBackDataSource: FeedBackDataSource;

  constructor(feedBackDataSource: FeedBackDataSource) {
      this.feedBackDataSource = feedBackDataSource;
  }

  // Create a new feedback entry
  async createFeedBack(feedBack: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
      try {
          const feedBacks = await this.feedBackDataSource.create(feedBack); // Use the feedBack data source
          return Right<ErrorClass, FeedBackEntity>(feedBacks);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "feedBack_conflict") {
              return Left<ErrorClass, FeedBackEntity>(ApiError.feedBackGiven());
          }
          return Left<ErrorClass, FeedBackEntity>(ApiError.customError(400, error.message));
      }
  }

  // Retrieve all feedback entries
  async getFeedBacks(): Promise<Either<ErrorClass, FeedBackEntity[]>> {
      try {
          const feedBacks = await this.feedBackDataSource.getAllFeedBacks(); // Use the tag feedBack data source
          return Right<ErrorClass, FeedBackEntity[]>(feedBacks);
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, FeedBackEntity[]>(ApiError.notFound());
          }
          return Left<ErrorClass, FeedBackEntity[]>(ApiError.badRequest());
      }
  }

  // Retrieve a feedback entry by its ID
  async getFeedBackById(id: string): Promise<Either<ErrorClass, FeedBackEntity>> {
      try {
          const feedBack = await this.feedBackDataSource.read(id); // Use the tag feedBack data source
          return feedBack
              ? Right<ErrorClass, FeedBackEntity>(feedBack)
              : Left<ErrorClass, FeedBackEntity>(ApiError.notFound());
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, FeedBackEntity>(ApiError.notFound());
          }
          return Left<ErrorClass, FeedBackEntity>(ApiError.badRequest());
      }
  }

  // Update a feedback entry by ID
  async updateFeedBack(id: string, data: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
      try {
          const updatedFeedBack = await this.feedBackDataSource.update(id, data); // Use the tag feedBack data source
          return Right<ErrorClass, FeedBackEntity>(updatedFeedBack);
      } catch (e) {
          if (e instanceof ApiError && e.name === "conflict") {
              return Left<ErrorClass, FeedBackEntity>(ApiError.emailExist());
          }
          return Left<ErrorClass, FeedBackEntity>(ApiError.badRequest());
      }
  }

  // Delete a feedback entry by ID
  async deleteFeedBack(id: string): Promise<Either<ErrorClass, void>> {
      try {
          const result = await this.feedBackDataSource.delete(id); // Use the tag feedBack data source
          return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, void>(ApiError.notFound());
          }
          return Left<ErrorClass, void>(ApiError.badRequest());
      }
  }
}
