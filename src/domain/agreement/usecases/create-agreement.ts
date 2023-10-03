import { AgreementEntity, AgreementModel } from "@domain/agreement/entities/agreement";
import { AgreementRepository } from "@domain/agreement/repositories/agreement-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateAgreementUsecase {
  execute: (
    agreementData: AgreementModel
  ) => Promise<Either<ErrorClass, AgreementEntity>>;
}

export class CreateAgreement implements CreateAgreementUsecase {
  private readonly agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  async execute(
    agreementData: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    return await this.agreementRepository.createAgreement(agreementData);
  }
}
