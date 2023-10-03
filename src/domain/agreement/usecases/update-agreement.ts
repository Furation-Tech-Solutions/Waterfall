import { AgreementEntity, AgreementModel } from "@domain/agreement/entities/agreement";
import { AgreementRepository } from "@domain/agreement/repositories/agreement-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateAgreementUsecase {
  execute: (
    agreementId: string,
    agreementData: AgreementModel
  ) => Promise<Either<ErrorClass, AgreementEntity>>;
}

export class UpdateAgreement implements UpdateAgreementUsecase {
  private readonly agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  async execute(
    agreementId: string,
    agreementData: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    return await this.agreementRepository.updateAgreement(
      agreementId,
      agreementData
    );
  }
}
