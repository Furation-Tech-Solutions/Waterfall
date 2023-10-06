import { type BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";
export interface DeleteBlockingUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBlocking implements DeleteBlockingUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    return await this.blockingRepository.deleteBlocking(id);
  }
}
