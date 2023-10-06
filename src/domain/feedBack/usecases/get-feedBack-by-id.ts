import { FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the use case
export interface GetFeedBackByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

// Implement the use case class
export class GetFeedBackById implements GetFeedBackByIdUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  // Implement the execute method to retrieve feedback by its ID
  async execute(id: string): Promise<Either<ErrorClass, FeedBackEntity>> {
    return await this.feedBackRepository.getFeedBackById(id);
  }
}
