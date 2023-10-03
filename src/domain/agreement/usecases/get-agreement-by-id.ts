import { AgreementEntity } from "@domain/agreement/entities/agreement";
import { AgreementRepository } from "@domain/agreement/repositories/agreement-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAgreementByIdUsecase {
  execute: (
    agreementId: string
  ) => Promise<Either<ErrorClass, AgreementEntity>>;
}

export class GetAgreementById implements GetAgreementByIdUsecase {
  private readonly agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  async execute(
    agreementId: string
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    return await this.agreementRepository.getAgreementById(agreementId);
  }
}
