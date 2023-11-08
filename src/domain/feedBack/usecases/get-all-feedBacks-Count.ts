import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { string } from "joi";

// Define the interface for the "Get Feedback Count" use case
export interface GetFeedbackCountUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, number>>;
}

// Implement the "Get Feedback Count" use case class
export class GetFeedbackCount implements GetFeedbackCountUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  // Implement the execute method to retrieve the count of feedback entries
  async execute(id: string): Promise<Either<ErrorClass, number>> {
    return await this.feedBackRepository.getFeedbackCount(id);
  }
}

