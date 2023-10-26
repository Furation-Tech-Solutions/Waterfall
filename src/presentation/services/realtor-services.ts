import { NextFunction, Request, Response } from "express";
import {
  RealtorModel,
  RealtorEntity,
  RealtorMapper,
} from "@domain/realtors/entities/realtors";
import { CreateRealtorUsecase } from "@domain/realtors/usecases/create-realtor";
import { GetAllRealtorsUsecase } from "@domain/realtors/usecases/get-all-realtors";
import { GetRealtorByIdUsecase } from "@domain/realtors/usecases/get-realtor-by-id";
import { UpdateRealtorUsecase } from "@domain/realtors/usecases/update-realtor";
import { DeleteRealtorUsecase } from "@domain/realtors/usecases/delete-realtor";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;
  private readonly GetAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;
  private readonly UpdateRealtorUsecase: UpdateRealtorUsecase;
  private readonly DeleteRealtorUsecase: DeleteRealtorUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
    GetAllRealtorsUsecase: GetAllRealtorsUsecase,
    GetRealtorByIdUsecase: GetRealtorByIdUsecase,
    UpdateRealtorUsecase: UpdateRealtorUsecase,
    DeleteRealtorUsecase: DeleteRealtorUsecase,
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
    this.GetAllRealtorsUsecase = GetAllRealtorsUsecase;
    this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
    this.UpdateRealtorUsecase = UpdateRealtorUsecase;
    this.DeleteRealtorUsecase = DeleteRealtorUsecase;
  }

  // Handler for creating a new Realtor
  async createRealtor(req: Request, res: Response): Promise<void> {
    const realtorData: RealtorModel = RealtorMapper.toModel(req.body);
    console.log(realtorData, "service-38"); // Logging Realtor data

    const newRealtor: Either<ErrorClass, RealtorEntity> =
      await this.CreateRealtorUsecase.execute(realtorData);

    console.log(realtorData, "service-43"); // Logging Realtor data again

    newRealtor.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity) => {
        const resData = RealtorMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

// Handler for getting all Realtors
async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
  const query = req.query;
  const page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
  const limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number
  console.log("-=-=-=-=-=-=-=->", query);

  const realtors: Either<ErrorClass, RealtorEntity[]> = await this.GetAllRealtorsUsecase.execute(query,page,limit);

  realtors.cata(
    (error: ErrorClass) => {
      res.status(error.status).json({ error: error.message });
    },
    (result: RealtorEntity[]) => {
      res.json(result);
    }
  );
}




  // Handler for getting Realtor by ID  
  async getRealtorById(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;

    const realtor: Either<ErrorClass, RealtorEntity> =
      await this.GetRealtorByIdUsecase.execute(realtorId);

    realtor.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity) => {
        if (!result) {
          return res.json({ message: "Realtor Name not found." });
        }
        const resData = RealtorMapper.toEntity(result);
        return res.json(resData);
      }
    );
  }

  // Handler for updating Realtor by ID
  async updateRealtor(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;
    const realtorData: RealtorModel = req.body;

    const existingRealtor: Either<ErrorClass, RealtorEntity> =
      await this.GetRealtorByIdUsecase.execute(realtorId);

    existingRealtor.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (existingRealtorData: RealtorEntity) => {
        const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
          realtorData,
          true,
          existingRealtorData
        );

        const updatedRealtor: Either<ErrorClass, RealtorEntity> =
          await this.UpdateRealtorUsecase.execute(
            realtorId,
            updatedRealtorEntity
          );

        updatedRealtor.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (result: RealtorEntity) => {
            const resData = RealtorMapper.toEntity(result, true);
            res.json(resData);
          }
        );
      }
    );
  }

  // Handler for deleting Realtor by ID
  async deleteRealtor(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
      { deleteStatus: true },
      true
    );

    // Call the UpdateRealtorUsecase to update the Realtor
    const updatedRealtor: Either<ErrorClass, RealtorEntity> = await this.UpdateRealtorUsecase.execute(
      id,
      updatedRealtorEntity
    );

    updatedRealtor.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity) => {
        const responseData = RealtorMapper.toModel(result);
        return res.json(responseData)
      }
    )
  }
}
