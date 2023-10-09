import { FeedBackEntity, FeedBackModel } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Interface for the create feedback use case
export interface CreateFeedBackUsecase {
  execute: (feedBackData: FeedBackModel) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

// Create feedback use case implementation
export class CreateFeedBack implements CreateFeedBackUsecase {
  private readonly FeedBackRepository: FeedBackRepository;

  constructor(FeedBackRepository: FeedBackRepository) {
    this.FeedBackRepository = FeedBackRepository;
  }

  async execute(feedBackData: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
    // Call the createFeedBack method of the repository to create a new feedback
    return await this.FeedBackRepository.createFeedBack(feedBackData);
  }
}
