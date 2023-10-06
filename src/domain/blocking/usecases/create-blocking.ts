import { BlockingEntity, BlockingModel } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateBlockingUsecase {
  execute: (blockingData: BlockingModel) => Promise<Either<ErrorClass, BlockingEntity>>;
}

export class CreateBlocking implements CreateBlockingUsecase {
  private readonly BlockingRepository: BlockingRepository;

  constructor(BlockingRepository: BlockingRepository) {
    this.BlockingRepository = BlockingRepository;
  }

  async execute(blockingData: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.BlockingRepository.createBlocking(blockingData);
  }
}