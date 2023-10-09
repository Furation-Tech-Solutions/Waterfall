import { FeedBackEntity, FeedBackModel } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the update feedback use case
export interface UpdateFeedBackUsecase {
  execute: (
    id: string,
    feedBackData: FeedBackModel
  ) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

// Implement the update feedback use case class
export class UpdateFeedBack implements UpdateFeedBackUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  // Implement the execute method to update feedback by ID
  async execute(id: string, feedBackData: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
    // Call the updateFeedBack method from the repository to perform the update
    return await this.feedBackRepository.updateFeedBack(id, feedBackData);
  }
}
