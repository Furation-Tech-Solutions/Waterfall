// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FeedBackService } from "@presentation/services/feedBack-services";
import { FeedBackDataSourceImpl } from "@data/feedBack/datasources/feedBack-data-source";
import { FeedBackRepositoryImpl } from "@data/feedBack/repositories/feedBack-repositories-impl";
import { CreateFeedBack } from "@domain/feedBack/usecases/create-feedBack";
import { validateFeedBackInputMiddleware } from "@presentation/middlewares/feedBack/validation-middleware";
import sequelize from "@main/sequelizeClient";


// Create an instance of the FeedBackDataSourceImpl and pass the mongoose connection
const feedBackDataSource = new FeedBackDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const feedBackRepository = new FeedBackRepositoryImpl(feedBackDataSource);

// Create instances of the required use cases and pass the FeedBackRepositoryImpl
const createFeedBackUsecase = new CreateFeedBack(feedBackRepository);

// Initialize FeedBackService and inject required dependencies
const feedBackService = new FeedBackService(
  createFeedBackUsecase
);

// Create an Express router
export const feedBackRouter = Router();

// Route handling for creating a new feedBack
feedBackRouter.post("/", validateFeedBackInputMiddleware(false), feedBackService.createFeedBack.bind(feedBackService));
