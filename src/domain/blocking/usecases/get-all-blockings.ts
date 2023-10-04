import { BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllBlockingsUsecase {
  execute: () => Promise<Either<ErrorClass, BlockingEntity[]>>;
}

export class GetAllBlockings implements GetAllBlockingsUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  async execute(): Promise<Either<ErrorClass, BlockingEntity[]>> {
    return await this.blockingRepository.getBlockings();
  }
}
