import { NextFunction, Request, Response } from "express";
import {
  FQAModel,
  FQAEntity,
  FQAMapper,
} from "@domain/fqa/entities/fqa";
import { CreateFQAUsecase } from "@domain/fqa/usecases/create-fqa";
import { GetAllFQAsUsecase } from "@domain/fqa/usecases/get-all-fqas";
import { GetFQAByIdUsecase } from "@domain/fqa/usecases/get-fqa-by-id";
import { UpdateFQAUsecase } from "@domain/fqa/usecases/update-fqa";
import { DeleteFQAUsecase } from "@domain/fqa/usecases/delete-fqa";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FQAService {
  private readonly CreateFQAUsecase: CreateFQAUsecase;
  private readonly GetAllFQAsUsecase: GetAllFQAsUsecase;
  private readonly GetFQAByIdUsecase: GetFQAByIdUsecase;
  private readonly UpdateFQAUsecase: UpdateFQAUsecase;
  private readonly DeleteFQAUsecase: DeleteFQAUsecase;

  constructor(
    CreateFQAUsecase: CreateFQAUsecase,
    GetAllFQAsUsecase: GetAllFQAsUsecase,
    GetFQAByIdUsecase: GetFQAByIdUsecase,
    UpdateFQAUsecase: UpdateFQAUsecase,
    DeleteFQAUsecase: DeleteFQAUsecase
  ) {
    this.CreateFQAUsecase = CreateFQAUsecase;
    this.GetAllFQAsUsecase = GetAllFQAsUsecase;
    this.GetFQAByIdUsecase = GetFQAByIdUsecase;
    this.UpdateFQAUsecase = UpdateFQAUsecase;
    this.DeleteFQAUsecase = DeleteFQAUsecase;
  }

  async createFQA(req: Request, res: Response): Promise<void> {
    const fqaData: FQAModel = FQAMapper.toModel(req.body);
    console.log(fqaData, "service-38");

    const newFQA: Either<ErrorClass, FQAEntity> =
        await this.CreateFQAUsecase.execute(fqaData);

    console.log(fqaData, "service-43");

    newFQA.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FQAEntity) => {
            const resData = FQAMapper.toEntity(result, true);
            return res.json(resData);
        }
    );
  }

  async getAllFQAs(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllFQAsUsecase to get all FQAs
    const fqas: Either<ErrorClass, FQAEntity[]> = await this.GetAllFQAsUsecase.execute();
      
    fqas.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: FQAEntity[]) => {
          // Filter out fqas with del_status set to "Deleted"
          // const nonDeletedFQAs = result.filter((fqa) => fqa.deleteStatus !== false);

          // Convert non-deleted fqas from an array of FQAEntity to an array of plain JSON objects using fqaMapper
          const responseData = fqas.map((fqa) => FQAMapper.toEntity(fqa));
          return res.json(responseData);
      }
  );
  }

  async getFQAById(req: Request, res: Response): Promise<void> {
    const fqaId: string = req.params.id;

    const fqa: Either<ErrorClass, FQAEntity> =
        await this.GetFQAByIdUsecase.execute(fqaId);

    fqa.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FQAEntity) => {
            if (!result) {
                return res.json({ message: "FQA Name not found." });
            }
            const resData = FQAMapper.toEntity(result);
            return res.json(resData);
        }
    );
  }

  async updateFQA(req: Request, res: Response): Promise<void> {
    const fqaId: string = req.params.id;
    const fqaData: FQAModel = req.body;

    const existingFQA: Either<ErrorClass, FQAEntity> =
        await this.GetFQAByIdUsecase.execute(fqaId);

    existingFQA.cata(
        (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
        },
        async (existingFQAData: FQAEntity) => {
            const updatedFQAEntity: FQAEntity = FQAMapper.toEntity(
                fqaData,
                true,
                existingFQAData
            );

            const updatedFQA: Either<ErrorClass, FQAEntity> =
                await this.UpdateFQAUsecase.execute(
                    fqaId,
                    updatedFQAEntity
                );

            updatedFQA.cata(
                (error: ErrorClass) => {
                    res.status(error.status).json({ error: error.message });
                },
                (result: FQAEntity) => {
                    const resData = FQAMapper.toEntity(result, true);
                    res.json(resData);
                }
            );
        }
    );
  }

  async deleteFQA(req: Request, res: Response): Promise<void> {
      const id: string = req.params.id;
    
      // Execute the deleteBlock use case to delete a fqa by ID
      const deleteBlock: Either<ErrorClass, void> 
        = await this.DeleteFQAUsecase.execute(id);

      deleteBlock.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: void) =>{
          return res.json({ message: "FQA deleted successfully." })
        }
      )
  }
}
