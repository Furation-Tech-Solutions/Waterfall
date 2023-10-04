import { FQAEntity, FQAModel } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface UpdateFQAUsecase {
  execute: (
    id: string,
    fqaData: FQAModel
  ) => Promise<Either<ErrorClass, FQAEntity>>;
}

export class UpdateFQA implements UpdateFQAUsecase {
  private readonly fqaRepository: FQARepository;

  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  async execute(id: string, fqaData: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
    return await this.fqaRepository.updateFQA(id, fqaData);
  }
}
