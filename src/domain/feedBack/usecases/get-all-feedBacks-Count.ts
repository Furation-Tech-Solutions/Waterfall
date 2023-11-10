import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { Query } from "@data/feedBack/datasources/feedBack-data-source";

// Define the interface for the "Get Feedback Count" use case
export interface GetFeedbackCountUsecase {
  execute: (query: Query) => Promise<Either<ErrorClass, number>>;
}

// Implement the "Get Feedback Count" use case class
export class GetFeedbackCount implements GetFeedbackCountUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  // Implement the execute method to retrieve the count of feedback entries
  async execute(query: Query): Promise<Either<ErrorClass, number>> {
    return await this.feedBackRepository.getFeedbackCount(query);
  }
}
