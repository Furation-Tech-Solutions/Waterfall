// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FeedBackService } from "@presentation/services/feedBack-services";
import { FeedBackDataSourceImpl } from "@data/feedBack/datasources/feedBack-data-source";
import { FeedBackRepositoryImpl } from "@data/feedBack/repositories/feedBack-repositories-impl";
import { CreateFeedBack } from "@domain/feedBack/usecases/create-feedBack";
import { validateFeedBackInputMiddleware } from "@presentation/middlewares/feedBack/validation-middleware";
import { GetAllFeedBacks } from "@domain/feedBack/usecases/get-all-feedBacks";
import { GetFeedBackById } from "@domain/feedBack/usecases/get-feedBack-by-id";
import { UpdateFeedBack } from "@domain/feedBack/usecases/update-feedBack";
import { DeleteFeedBack } from "@domain/feedBack/usecases/delete-feedBack";
import sequelize from "@main/sequelizeClient";


// Create an instance of the FeedBackDataSourceImpl and pass the mongoose connection
const feedBackDataSource = new FeedBackDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const feedBackRepository = new FeedBackRepositoryImpl(feedBackDataSource);

// Create instances of the required use cases and pass the FeedBackRepositoryImpl
const createFeedBackUsecase = new CreateFeedBack(feedBackRepository);
const getAllFeedBacksUsecase = new GetAllFeedBacks(feedBackRepository);
const getFeedBackByIdUsecase = new GetFeedBackById(feedBackRepository);
const updateFeedBackUsecase = new UpdateFeedBack(feedBackRepository);
const deleteFeedBackUsecase = new DeleteFeedBack(feedBackRepository);

// Initialize FeedBackService and inject required dependencies
const feedBackService = new FeedBackService(
  createFeedBackUsecase,
  getAllFeedBacksUsecase,
  getFeedBackByIdUsecase,
  updateFeedBackUsecase,
  deleteFeedBackUsecase
);

// Create an Express router
export const feedBackRouter = Router();

// Route handling for creating a new feedBack
feedBackRouter.post("/", validateFeedBackInputMiddleware(false), feedBackService.createFeedBack.bind(feedBackService));

// Route handling for getting all feedBacksx`
feedBackRouter.get("/", feedBackService.getAllFeedBacks.bind(feedBackService));

// Route handling for getting an FeedBack by ID
feedBackRouter.get("/:id", feedBackService.getFeedBackById.bind(feedBackService));

// Route handling for updating an feedBack by ID
feedBackRouter.put("/:id", validateFeedBackInputMiddleware(true), feedBackService.updateFeedBack.bind(feedBackService));

// Route handling for deleting an feedBack by ID
feedBackRouter.delete("/:id", feedBackService.deleteFeedBack.bind(feedBackService));
