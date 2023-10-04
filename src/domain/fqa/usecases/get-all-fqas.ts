import { FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllFQAsUsecase {
  execute: () => Promise<Either<ErrorClass, FQAEntity[]>>;
}

export class GetAllFQAs implements GetAllFQAsUsecase {
  private readonly fqaRepository: FQARepository;

  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  async execute(): Promise<Either<ErrorClass, FQAEntity[]>> {
    return await this.fqaRepository.getFQAs();
  }
}
