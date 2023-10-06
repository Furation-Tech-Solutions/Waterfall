import { NextFunction, Request, Response } from "express";
import {
  SupportEntity,
  SupportModel,
  SupportMapper,
} from "@domain/support/entities/support";
import { CreateSupportUsecase } from "@domain/support/usecases/create-support";
import { DeleteSupportUsecase } from "@domain/support/usecases/delete-support";
import { GetSupportByIdUsecase } from "@domain/support/usecases/get-support-by-id";
import { UpdateSupportUsecase } from "@domain/support/usecases/update-support";
import { GetAllSupportsUsecase } from "@domain/support/usecases/get-all-supports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Create a class for the SupportService
export class SupportService {
  private readonly createSupportUsecase: CreateSupportUsecase;
  private readonly deleteSupportUsecase: DeleteSupportUsecase;
  private readonly getSupportByIdUsecase: GetSupportByIdUsecase;
  private readonly updateSupportUsecase: UpdateSupportUsecase;
  private readonly getAllSupportsUsecase: GetAllSupportsUsecase;

  // Constructor to initialize dependencies
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

  // Function to create a new support
  async createSupport(req: Request, res: Response): Promise<void> {
    // Extract support data from the request body
    const supportData: SupportModel = SupportMapper.toModel(req.body);

    // Execute the createSupportUsecase and handle the result using Either
    const newSupport: Either<ErrorClass, SupportEntity> =
      await this.createSupportUsecase.execute(supportData);

    // Handle the result and send a JSON response
    newSupport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to delete a support
  async deleteSupport(req: Request, res: Response): Promise<void> {
    // Extract support ID from the request parameters
    const supportId: string = req.params.id;

    // Execute the deleteSupportUsecase and handle the result using Either
    const response: Either<ErrorClass, void> =
      await this.deleteSupportUsecase.execute(supportId);

    // Handle the result and send a JSON response
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "Support deleted successfully." });
      }
    );
  }

  // Function to get a support by ID
  async getSupportById(req: Request, res: Response): Promise<void> {
    // Extract support ID from the request parameters
    const supportId: string = req.params.id;

    // Execute the getSupportByIdUsecase and handle the result using Either
    const support: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    // Handle the result and send a JSON response
    support.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to update a support
  async updateSupport(req: Request, res: Response): Promise<void> {
    // Extract support ID from the request parameters
    const supportId: string = req.params.id;
    // Extract support data from the request body
    const supportData: SupportModel = req.body;

    // Execute the getSupportByIdUsecase to fetch the existing support
    const existingSupport: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    // Handle the result of fetching the existing support
    existingSupport.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);

        // Map the updated support data to an entity
        const updatedSupportEntity: SupportEntity = SupportMapper.toEntity(
          supportData,
          true,
          resData
        );

        // Execute the updateSupportUsecase and handle the result using Either
        const updatedSupport: Either<ErrorClass, SupportEntity> =
          await this.updateSupportUsecase.execute(
            supportId,
            updatedSupportEntity
          );

        // Handle the result and send a JSON response
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

  // Function to get all supports
  async getAllSupports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllSupportsUsecase and handle the result using Either
    const supports: Either<ErrorClass, SupportEntity[]> =
      await this.getAllSupportsUsecase.execute();

    // Handle the result and send a JSON response
    supports.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (supports: SupportEntity[]) => {
        const resData = supports.map((support: any) =>
          SupportMapper.toEntity(support)
        );
        return res.json(resData);
      }
    );
  }
}
