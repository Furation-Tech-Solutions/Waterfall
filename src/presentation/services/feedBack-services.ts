import { NextFunction, Request, Response } from "express";
import {
  FeedBackModel,
  FeedBackEntity,
  FeedBackMapper,
} from "@domain/feedBack/entities/feedBack";
import { CreateFeedBackUsecase } from "@domain/feedBack/usecases/create-feedBack";
import { GetAllFeedBacksUsecase } from "@domain/feedBack/usecases/get-all-feedBacks";
import { GetFeedBackByIdUsecase } from "@domain/feedBack/usecases/get-feedBack-by-id";
import { UpdateFeedBackUsecase } from "@domain/feedBack/usecases/update-feedBack";
import { DeleteFeedBackUsecase } from "@domain/feedBack/usecases/delete-feedBack";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FeedBackService {
  private readonly CreateFeedBackUsecase: CreateFeedBackUsecase;
  private readonly GetAllFeedBacksUsecase: GetAllFeedBacksUsecase;
  private readonly GetFeedBackByIdUsecase: GetFeedBackByIdUsecase;
  private readonly UpdateFeedBackUsecase: UpdateFeedBackUsecase;
  private readonly DeleteFeedBackUsecase: DeleteFeedBackUsecase;

  constructor(
    CreateFeedBackUsecase: CreateFeedBackUsecase,
    GetAllFeedBacksUsecase: GetAllFeedBacksUsecase,
    GetFeedBackByIdUsecase: GetFeedBackByIdUsecase,
    UpdateFeedBackUsecase: UpdateFeedBackUsecase,
    DeleteFeedBackUsecase: DeleteFeedBackUsecase
  ) {
    this.CreateFeedBackUsecase = CreateFeedBackUsecase;
    this.GetAllFeedBacksUsecase = GetAllFeedBacksUsecase;
    this.GetFeedBackByIdUsecase = GetFeedBackByIdUsecase;
    this.UpdateFeedBackUsecase = UpdateFeedBackUsecase;
    this.DeleteFeedBackUsecase = DeleteFeedBackUsecase;
  }

  // Handler for creating a new feedback
  async createFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackData: FeedBackModel = FeedBackMapper.toModel(req.body);
    console.log(feedBackData, "service-38"); // Logging feedback data

    const newFeedBack: Either<ErrorClass, FeedBackEntity> =
        await this.CreateFeedBackUsecase.execute(feedBackData);

    console.log(feedBackData, "service-43"); // Logging feedback data again

    newFeedBack.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FeedBackEntity) => {
            const resData = FeedBackMapper.toEntity(result, true);
            return res.json(resData);
        }
    );
  }

  // Handler for getting all feedbacks
  async getAllFeedBacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const id: string = req.params.id;
    console.log("fhgfhgfhgfgffhhf",id);
    
    const Id: number = parseInt(id, 10);
    
    // Call the GetAllFeedBacksUsecase to get all Feedbacks
    const feedBacks: Either<ErrorClass, FeedBackEntity[]> = await this.GetAllFeedBacksUsecase.execute();
      
    feedBacks.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: FeedBackEntity[]) => {
        // Filter out feedbacks with del_status set to "Deleted"
        // const nonDeletedFeedBacks = result.filter((feedback) => feedback.deleteStatus !== false);

        // Convert non-deleted feedbacks from an array of FeedBackEntity to an array of plain JSON objects using feedbackMapper
        const responseData = result.map((feedback) => FeedBackMapper.toEntity(feedback));
        return res.json(responseData);
      }
  );
  }

  // Handler for getting feedback by ID
  async getFeedBackById(req: Request, res: Response): Promise<void> {
    const feedBackId: string = req.params.id;

    const feedBack: Either<ErrorClass, FeedBackEntity> =
        await this.GetFeedBackByIdUsecase.execute(feedBackId);

    feedBack.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FeedBackEntity) => {
            if (!result) {
                return res.json({ message: "FeedBack Name not found." });
            }
            const resData = FeedBackMapper.toEntity(result);
            return res.json(resData);
        }
    );
  }

  // Handler for updating feedback by ID
  async updateFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackId: string = req.params.id;
    const feedBackData: FeedBackModel = req.body;

    const existingFeedBack: Either<ErrorClass, FeedBackEntity> =
        await this.GetFeedBackByIdUsecase.execute(feedBackId);

    existingFeedBack.cata(
        (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
        },
        async (existingFeedBackData: FeedBackEntity) => {
            const updatedFeedBackEntity: FeedBackEntity = FeedBackMapper.toEntity(
                feedBackData,
                true,
                existingFeedBackData
            );

            const updatedFeedBack: Either<ErrorClass, FeedBackEntity> =
                await this.UpdateFeedBackUsecase.execute(
                    feedBackId,
                    updatedFeedBackEntity
                );

            updatedFeedBack.cata(
                (error: ErrorClass) => {
                    res.status(error.status).json({ error: error.message });
                },
                (result: FeedBackEntity) => {
                    const resData = FeedBackMapper.toEntity(result, true);
                    res.json(resData);
                }
            );
        }
    );
  }

  // Handler for deleting feedback by ID
  async deleteFeedBack(req: Request, res: Response): Promise<void> {
      const id: string = req.params.id;
    
      // Execute the deleteFeedBack use case to delete a feedback by ID
      const deleteFeedBack: Either<ErrorClass, void> 
        = await this.DeleteFeedBackUsecase.execute(id);

      deleteFeedBack.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: void) =>{
          return res.json({ message: "FeedBack deleted successfully." })
        }
      )
  }
}
