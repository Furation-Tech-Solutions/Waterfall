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
import { ShiftWithTimeSlots } from "types/availibility/schema-type";

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
    // Call the GetAllRealtorsUsecase to get all Realtors
    const realtors: Either<ErrorClass, RealtorEntity[]> = await this.GetAllRealtorsUsecase.execute();
      
    realtors.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity[]) => {
        // Filter out Realtors with del_status set to "Deleted"
        // const nonDeletedRealtors = result.filter((realtor) => realtor.deleteStatus !== false);

        // Convert non-deleted Realtors from an array of RealtorEntity to an array of plain JSON objects using realtorMapper
        const responseData = result.map((realtor) => RealtorMapper.toEntity(realtor));
        return res.json(responseData);
      }
  );
  }  
  // async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const realtors: Either<ErrorClass, RealtorEntity[]> = await this.GetAllRealtorsUsecase.execute();
  //     const { location, gender } = req.query;
  //     const selectedLocation = new Location(`${location}`);

  //     realtors.cata(
  //       (error: ErrorClass) => {res.status(error.status).json({ error: error.message })},
  //       (realtors: RealtorEntity[]) => {
  //         const filteredRealtors = realtors.filter((realtor) => {
  //           const realtorLocation = new Location();

  //           if (realtorLocation < selectedLocation && realtor.gender === gender) {
  //             return true;
  //           }

  //           return false;
  //         });

  //         if (filteredRealtors && filteredRealtors.length > 0) {
  //           const results: ShiftWithTimeSlots[] = [];

  //           for (const realtor of filteredRealtors) {
  //             const timeSlots: string[] = [];

  //             results.push({
  //               id: realtor.id,
  //               location: realtor.location,
  //               gender: realtor.gender,
  //               timeSlots,
  //             });
  //           }

  //           const responseData = filteredRealtors.map((realtor) => RealtorMapper.toEntity(realtor));
  //           res.json(responseData);
  //         }
  //       });
  //   } catch (error) {
  //     // Handle unexpected errors
  //     console.error("Error in getAllRealtors:", error);
  //     res.status(500).json({ error: "An unexpected error occurred" });
  //   }
  // }


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
