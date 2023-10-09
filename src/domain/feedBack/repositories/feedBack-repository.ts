import { FeedBackModel, FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Interface for the FeedBack repository
export interface FeedBackRepository {
  // Create a new feedback
  createFeedBack(feedBack: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>>;

  // Retrieve all feedbacks
  getFeedBacks(): Promise<Either<ErrorClass, FeedBackEntity[]>>;

  // Retrieve a feedback by ID
  getFeedBackById(id: string): Promise<Either<ErrorClass, FeedBackEntity>>;

  // Update a feedback by ID
  updateFeedBack(id: string, data: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>>;

  // Delete a feedback by ID
  deleteFeedBack(id: string): Promise<Either<ErrorClass, void>>;
}
