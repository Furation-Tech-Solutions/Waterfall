import { FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllFeedBacksUsecase {
  execute: () => Promise<Either<ErrorClass, FeedBackEntity[]>>;
}

export class GetAllFeedBacks implements GetAllFeedBacksUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  async execute(): Promise<Either<ErrorClass, FeedBackEntity[]>> {
    return await this.feedBackRepository.getFeedBacks();
  }
}
