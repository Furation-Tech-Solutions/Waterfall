import { SupportEntity, SupportModel } from "@domain/support/entities/support";
import { SupportRepository } from "@domain/support/repositories/support-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateSupportUsecase {
  execute: (
    supportId: string,
    supportData: SupportModel
  ) => Promise<Either<ErrorClass, SupportEntity>>;
}

export class UpdateSupport implements UpdateSupportUsecase {
  private readonly supportRepository: SupportRepository;

  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  async execute(
    supportId: string,
    supportData: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    return await this.supportRepository.updateSupport(supportId, supportData);
  }
}
