import { type FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";
export interface DeleteFQAUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteFQA implements DeleteFQAUsecase {
  private readonly fqaRepository: FQARepository;

  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    return await this.fqaRepository.deleteFQA(id);
  }
}
