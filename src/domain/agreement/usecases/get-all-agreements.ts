import { AgreementEntity } from "@domain/agreement/entities/agreement";
import { AgreementRepository } from "@domain/agreement/repositories/agreement-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllAgreementsUsecase {
  execute: () => Promise<Either<ErrorClass, AgreementEntity[]>>;
}

export class GetAllAgreements implements GetAllAgreementsUsecase {
  private readonly agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  async execute(): Promise<Either<ErrorClass, AgreementEntity[]>> {
    return await this.agreementRepository.getAgreements();
  }
}
