import { AgreementEntity, AgreementModel } from "@domain/agreement/entities/agreement";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface AgreementRepository {
  createAgreement(
    agreement: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>>;
  updateAgreement(
    id: string,
    data: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>>;
  getAgreements(): Promise<Either<ErrorClass, AgreementEntity[]>>;
  getAgreementById(id: string): Promise<Either<ErrorClass, AgreementEntity>>;
}
