import { FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { Query } from "@data/feedBack/datasources/feedBack-data-source";

// Define the interface for the use case
export interface GetAllFeedBacksUsecase {
  execute: (query: Query) => Promise<Either<ErrorClass, FeedBackEntity[]>>;
}

// Implement the use case class
export class GetAllFeedBacks implements GetAllFeedBacksUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  // Implement the execute method to retrieve all feedback entries
  async execute(query: Query): Promise<Either<ErrorClass, FeedBackEntity[]>> {
    return await this.feedBackRepository.getFeedBacks(query);
  }
}
