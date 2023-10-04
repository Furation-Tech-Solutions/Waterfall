import { FeedBackEntity, FeedBackModel } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateFeedBackUsecase {
  execute: (feedBackData: FeedBackModel) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

export class CreateFeedBack implements CreateFeedBackUsecase {
  private readonly FeedBackRepository: FeedBackRepository;

  constructor(FeedBackRepository: FeedBackRepository) {
    this.FeedBackRepository = FeedBackRepository;
  }

  async execute(feedBackData: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
    return await this.FeedBackRepository.createFeedBack(feedBackData);
  }
}