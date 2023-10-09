import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Interface for the delete feedback use case
export interface DeleteFeedBackUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Delete feedback use case implementation
export class DeleteFeedBack implements DeleteFeedBackUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteFeedBack method of the repository to delete a feedback by its ID
    return await this.feedBackRepository.deleteFeedBack(id);
  }
}
