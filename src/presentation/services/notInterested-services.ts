import { NextFunction, Request, Response } from "express";
import {
  NotInterestedEntity,
  NotInterestedModel,
  NotInterestedMapper,
} from "@domain/notInterested/entities/notInterested_entities";
import { CreateNotInterestedUsecase } from "@domain/notInterested/usecases/create-notInterested";
import { DeleteNotInterestedUsecase } from "@domain/notInterested/usecases/delete-notInterested";
import { GetNotInterestedByIdUsecase } from "@domain/notInterested/usecases/get-notInterested-by-id";
import { UpdateNotInterestedUsecase } from "@domain/notInterested/usecases/update-notInterested";
import { GetAllNotInterestedsUsecase } from "@domain/notInterested/usecases/get-all-notInterested";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Create a class for the NotInterestedService
export class NotInterestedService {
  private readonly createNotInterestedUsecase: CreateNotInterestedUsecase;
  private readonly deleteNotInterestedUsecase: DeleteNotInterestedUsecase;
  private readonly getNotInterestedByIdUsecase: GetNotInterestedByIdUsecase;
  private readonly updateNotInterestedUsecase: UpdateNotInterestedUsecase;
  private readonly getAllNotInterestedsUsecase: GetAllNotInterestedsUsecase;

  // Constructor to initialize dependencies
  constructor(
    createNotInterestedUsecase: CreateNotInterestedUsecase,
    deleteNotInterestedUsecase: DeleteNotInterestedUsecase,
    getNotInterestedByIdUsecase: GetNotInterestedByIdUsecase,
    updateNotInterestedUsecase: UpdateNotInterestedUsecase,
    getAllNotInterestedsUsecase: GetAllNotInterestedsUsecase
  ) {
    this.createNotInterestedUsecase = createNotInterestedUsecase;
    this.deleteNotInterestedUsecase = deleteNotInterestedUsecase;
    this.getNotInterestedByIdUsecase = getNotInterestedByIdUsecase;
    this.updateNotInterestedUsecase = updateNotInterestedUsecase;
    this.getAllNotInterestedsUsecase = getAllNotInterestedsUsecase;
  }

  // Function to create a new saved job
  async createNotInterested(req: Request, res: Response): Promise<void> {
    // Extract saved job data from the request body
    const notInterestedData: NotInterestedModel = NotInterestedMapper.toModel(req.body);

    // Execute the createNotInterestedUsecase and handle the result using Either
    const newNotInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.createNotInterestedUsecase.execute(notInterestedData);

    // Handle the result and send a JSON response
    newNotInterested.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to delete a saved job
  async deleteNotInterested(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const notInterestedId: string = req.params.id;

    // Execute the deleteNotInterestedUsecase and handle the result using Either
    const response: Either<ErrorClass, void> =
      await this.deleteNotInterestedUsecase.execute(notInterestedId);

    // Handle the result and send a JSON response
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "NotInterested deleted successfully." });
      }
    );
  }

  // Function to get a saved job by ID
  async getNotInterestedById(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const notInterestedId: string = req.params.id;

    // Execute the getNotInterestedByIdUsecase and handle the result using Either
    const notInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.getNotInterestedByIdUsecase.execute(notInterestedId);

    // Handle the result and send a JSON response
    notInterested.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to update a saved job
  async updateNotInterested(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const notInterestedId: string = req.params.id;
    // Extract saved job data from the request body
    const notInterestedData: NotInterestedModel = req.body;

    // Execute the getNotInterestedByIdUsecase to fetch the existing saved job
    const existingNotInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.getNotInterestedByIdUsecase.execute(notInterestedId);

    // Handle the result of fetching the existing saved job
    existingNotInterested.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);

        // Map the updated saved job data to an entity
        const updatedNotInterestedEntity: NotInterestedEntity = NotInterestedMapper.toEntity(
          notInterestedData,
          true,
          resData
        );

        // Execute the updateNotInterestedUsecase and handle the result using Either
        const updatedNotInterested: Either<ErrorClass, NotInterestedEntity> =
          await this.updateNotInterestedUsecase.execute(
            notInterestedId,
            updatedNotInterestedEntity
          );

        // Handle the result and send a JSON response
        updatedNotInterested.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: NotInterestedEntity) => {
            const responseData = NotInterestedMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  // Function to get all saved jobs
  async getAllNotInteresteds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllNotInterestedsUsecase and handle the result using Either
    const notInteresteds: Either<ErrorClass, NotInterestedEntity[]> =
      await this.getAllNotInterestedsUsecase.execute();

    // Handle the result and send a JSON response
    notInteresteds.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (notInteresteds: NotInterestedEntity[]) => {
        const resData = notInteresteds.map((notInterested: any) =>
          NotInterestedMapper.toEntity(notInterested)
        );
        return res.json(resData);
      }
    );
  }
}