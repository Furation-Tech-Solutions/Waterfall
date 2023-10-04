import { FeedBackModel, FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface FeedBackRepository {
  createFeedBack(feedBack: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>>;
}