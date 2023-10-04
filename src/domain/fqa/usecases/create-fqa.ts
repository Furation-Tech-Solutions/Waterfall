import { FQAEntity, FQAModel } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateFQAUsecase {
  execute: (fqaData: FQAModel) => Promise<Either<ErrorClass, FQAEntity>>;
}

export class CreateFQA implements CreateFQAUsecase {
  private readonly FQARepository: FQARepository;

  constructor(FQARepository: FQARepository) {
    this.FQARepository = FQARepository;
  }

  async execute(fqaData: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
    return await this.FQARepository.createFQA(fqaData);
  }
}