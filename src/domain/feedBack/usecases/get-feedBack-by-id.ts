import { FeedBackEntity } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetFeedBackByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

export class GetFeedBackById implements GetFeedBackByIdUsecase {
  private readonly feedBackRepository:FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, FeedBackEntity>> {
    return await this.feedBackRepository.getFeedBackById(id);
  }
}