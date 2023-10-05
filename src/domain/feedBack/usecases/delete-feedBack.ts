import { type FeedBackRepository } from "@domain/feedBack/repositories/feedBack-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";
export interface DeleteFeedBackUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteFeedBack implements DeleteFeedBackUsecase {
  private readonly feedBackRepository: FeedBackRepository;

  constructor(feedBackRepository: FeedBackRepository) {
    this.feedBackRepository = feedBackRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    return await this.feedBackRepository.deleteFeedBack(id);
  }
}
