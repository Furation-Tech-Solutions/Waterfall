import { SupportRepository } from "@domain/support/repositories/support-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface DeleteSupportUsecase {
  execute: (supportId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteSupport implements DeleteSupportUsecase {
  private readonly supportRepository: SupportRepository;

  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  async execute(supportId: string): Promise<Either<ErrorClass, void>> {
    return await this.supportRepository.deleteSupport(supportId);
  }
}
