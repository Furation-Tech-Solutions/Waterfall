// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { BlockingService } from "@presentation/services/blocking-services";
import { BlockingDataSourceImpl } from "@data/blocking/datasources/blocking-data-source";
import { BlockingRepositoryImpl } from "@data/blocking/repositories/blocking-repositories-impl";
import { CreateBlocking } from "@domain/blocking/usecases/create-blocking";
import { validateBlockingInputMiddleware } from "@presentation/middlewares/blocking/validation-middleware";
import { GetAllBlockings } from "@domain/blocking/usecases/get-all-blockings";
import sequelize from "@main/sequalizeClient";


// Create an instance of the BlockingDataSourceImpl and pass the mongoose connection
const blockingDataSource = new BlockingDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const blockingRepository = new BlockingRepositoryImpl(blockingDataSource);

// Create instances of the required use cases and pass the BlockingRepositoryImpl
const createBlockingUsecase = new CreateBlocking(blockingRepository);
const getAllBlockingsUsecase = new GetAllBlockings(blockingRepository);

// Initialize BlockingService and inject required dependencies
const blockingService = new BlockingService(
  createBlockingUsecase,
  getAllBlockingsUsecase
);

// Create an Express router
export const blockingRouter = Router();

// Route handling for creating a new blocking
blockingRouter.post("/", validateBlockingInputMiddleware(false), blockingService.createBlocking.bind(blockingService));

// Route handling for getting all blockingsx`
blockingRouter.get("/", blockingService.getAllBlockings.bind(blockingService));
