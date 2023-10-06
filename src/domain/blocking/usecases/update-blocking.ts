import { BlockingEntity, BlockingModel } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface UpdateBlockingUsecase {
  execute: (
    id: string,
    blockingData: BlockingModel
  ) => Promise<Either<ErrorClass, BlockingEntity>>;
}

export class UpdateBlocking implements UpdateBlockingUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  async execute(id: string, blockingData: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.blockingRepository.updateBlocking(id, blockingData);
  }
}
