import { FeedBackModel, FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { FeedBackDataSource } from "@data/feedBack/datasources/feedBack-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class FeedBackRepositoryImpl implements FeedBackRepository {
  private readonly feedBackDataSource: FeedBackDataSource;
  constructor(feedBackDataSource: FeedBackDataSource) {
      this.feedBackDataSource = feedBackDataSource;
  }

  async createFeedBack(feedBack: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
      try {
          const feedBacks = await this.feedBackDataSource.create(feedBack); // Use the feedBack data source
          return Right<ErrorClass, FeedBackEntity>(feedBacks);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "badRequest") {
              return Left<ErrorClass, FeedBackEntity>(ApiError.badRequest());
          }
          return Left<ErrorClass, FeedBackEntity>(ApiError.customError(400, error.message));
      }
  }
}

