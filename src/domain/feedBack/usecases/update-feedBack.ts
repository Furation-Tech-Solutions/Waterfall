import { FeedBackEntity, FeedBackModel } from "@domain/feedBack/entities/feedBack";
import { FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface UpdateFeedBackUsecase {
  execute: (
    id: string,
    feedBackData: FeedBackModel
  ) => Promise<Either<ErrorClass, FeedBackEntity>>;
}

export class UpdateFeedBack implements UpdateFeedBackUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  async execute(id: string, feedBackData: FeedBackModel): Promise<Either<ErrorClass, FeedBackEntity>> {
    return await this.feedBackRepository.updateFeedBack(id, feedBackData);
  }
}
