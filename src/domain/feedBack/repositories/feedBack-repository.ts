import { FeedBackModel, FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface FeedBackRepository {
  createFeedBack(feedBack: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>>;
  getFeedBacks(): Promise<Either<ErrorClass, FeedBackEntity[]>>;
  getFeedBackById(id: string): Promise<Either<ErrorClass, FeedBackEntity>>;
  updateFeedBack(id: string, data: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>>;
  deleteFeedBack(id: string): Promise<Either<ErrorClass, void>>;
}