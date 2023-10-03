import { NextFunction, Request, Response } from "express";
import {
  AgreementEntity,
  AgreementModel,
  AgreementMapper,
} from "@domain/agreement/entities/agreement";
import { CreateAgreementUsecase } from "@domain/agreement/usecases/create-agreement";
import { GetAgreementByIdUsecase } from "@domain/agreement/usecases/get-agreement-by-id";
import { UpdateAgreementUsecase } from "@domain/agreement/usecases/update-agreement";
import { GetAllAgreementsUsecase } from "@domain/agreement/usecases/get-all-agreements";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class AgreementService {
  private readonly createAgreementUsecase: CreateAgreementUsecase;
  private readonly getAgreementByIdUsecase: GetAgreementByIdUsecase;
  private readonly updateAgreementUsecase: UpdateAgreementUsecase;
  private readonly getAllAgreementsUsecase: GetAllAgreementsUsecase;

  constructor(
    createAgreementUsecase: CreateAgreementUsecase,
    getAgreementByIdUsecase: GetAgreementByIdUsecase,
    updateAgreementUsecase: UpdateAgreementUsecase,
    getAllAgreementsUsecase: GetAllAgreementsUsecase
  ) {
    this.createAgreementUsecase = createAgreementUsecase;
    this.getAgreementByIdUsecase = getAgreementByIdUsecase;
    this.updateAgreementUsecase = updateAgreementUsecase;
    this.getAllAgreementsUsecase = getAllAgreementsUsecase;
  }

  async createAgreement(req: Request, res: Response): Promise<void> {
    const agreementData: AgreementModel = AgreementMapper.toModel(req.body);

    const newAgreement: Either<ErrorClass, AgreementEntity> =
      await this.createAgreementUsecase.execute(agreementData);

    newAgreement.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: AgreementEntity) => {
        const resData = AgreementMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async getAgreementById(req: Request, res: Response): Promise<void> {
    const agreementId: string = req.params.id;

    const agreement: Either<ErrorClass, AgreementEntity> =
      await this.getAgreementByIdUsecase.execute(agreementId);

    agreement.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: AgreementEntity) => {
        const resData = AgreementMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async updateAgreement(req: Request, res: Response): Promise<void> {
    const agreementId: string = req.params.id;
    const AgreementData: AgreementModel = req.body;

    const existingAgreement: Either<ErrorClass, AgreementEntity> =
      await this.getAgreementByIdUsecase.execute(agreementId);

    existingAgreement.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: AgreementEntity) => {
        const resData = AgreementMapper.toEntity(result, true);

        const updatedAgreementEntity: AgreementEntity =
          AgreementMapper.toEntity(AgreementData, true, resData);

        const updatedAgreement: Either<ErrorClass, AgreementEntity> =
          await this.updateAgreementUsecase.execute(
            agreementId,
            updatedAgreementEntity
          );

        updatedAgreement.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: AgreementEntity) => {
            const responseData = AgreementMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  async getAllAgreements(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const jobs: Either<ErrorClass, AgreementEntity[]> =
      await this.getAllAgreementsUsecase.execute();

    jobs.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (agreements: AgreementEntity[]) => {
        const resData = agreements.map((agreement: any) =>
          AgreementMapper.toEntity(agreement)
        );
        return res.json(resData);
      }
    );
  }
}
