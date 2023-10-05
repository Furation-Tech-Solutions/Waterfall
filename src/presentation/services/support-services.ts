import { NextFunction, Request, Response } from "express";
import { SupportEntity, SupportModel, SupportMapper } from "@domain/support/entities/support";
import { CreateSupportUsecase } from "@domain/support/usecases/create-support";
import { DeleteSupportUsecase } from "@domain/support/usecases/delete-support";
import { GetSupportByIdUsecase } from "@domain/support/usecases/get-support-by-id";
import { UpdateSupportUsecase } from "@domain/support/usecases/update-support";
import { GetAllSupportsUsecase } from "@domain/support/usecases/get-all-supports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class SupportService {
  private readonly createSupportUsecase: CreateSupportUsecase;
  private readonly deleteSupportUsecase: DeleteSupportUsecase;
  private readonly getSupportByIdUsecase: GetSupportByIdUsecase;
  private readonly updateSupportUsecase: UpdateSupportUsecase;
  private readonly getAllSupportsUsecase: GetAllSupportsUsecase;

  constructor(
    createSupportUsecase: CreateSupportUsecase,
    deleteSupportUsecase: DeleteSupportUsecase,
    getSupportByIdUsecase: GetSupportByIdUsecase,
    updateSupportUsecase: UpdateSupportUsecase,
    getAllSupportsUsecase: GetAllSupportsUsecase
  ) {
    this.createSupportUsecase = createSupportUsecase;
    this.deleteSupportUsecase = deleteSupportUsecase;
    this.getSupportByIdUsecase = getSupportByIdUsecase;
    this.updateSupportUsecase = updateSupportUsecase;
    this.getAllSupportsUsecase = getAllSupportsUsecase;
  }

  async createSupport(req: Request, res: Response): Promise<void> {
    const supportData: SupportModel = SupportMapper.toModel(req.body);

    const newSupport: Either<ErrorClass, SupportEntity> =
      await this.createSupportUsecase.execute(supportData);

    newSupport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async deleteSupport(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteSupportUsecase.execute(supportId);

    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "Support deleted successfully." });
      }
    );
  }

  async getSupportById(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;

    const support: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    support.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async updateSupport(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;
    const supportData: SupportModel = req.body;

    const existingSupport: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    existingSupport.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);

        const updatedSupportEntity: SupportEntity = SupportMapper.toEntity(
          supportData,
          true,
          resData
        );

        const updatedSupport: Either<ErrorClass, SupportEntity> =
          await this.updateSupportUsecase.execute(supportId, updatedSupportEntity);

        updatedSupport.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: SupportEntity) => {
            const responseData = SupportMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  async getAllSupports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const supports: Either<ErrorClass, SupportEntity[]> =
      await this.getAllSupportsUsecase.execute();

    supports.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (supports: SupportEntity[]) => {
        const resData = supports.map((support: any) => SupportMapper.toEntity(support));
        return res.json(resData);
      }
    );
  }
}
