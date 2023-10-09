// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { BlockingService } from "@presentation/services/blocking-services";
import { BlockingDataSourceImpl } from "@data/blocking/datasources/blocking-data-source";
import { BlockingRepositoryImpl } from "@data/blocking/repositories/blocking-repositories-impl";
import { CreateBlocking } from "@domain/blocking/usecases/create-blocking";
import { validateBlockingInputMiddleware } from "@presentation/middlewares/blocking/validation-middleware";
import { GetAllBlockings } from "@domain/blocking/usecases/get-all-blockings";
import { GetBlockingById } from "@domain/blocking/usecases/get-blocking-by-id";
import { UpdateBlocking } from "@domain/blocking/usecases/update-blocking";
import { DeleteBlocking } from "@domain/blocking/usecases/delete-blocking";
import sequelize from "@main/sequelizeClient";


// Create an instance of the BlockingDataSourceImpl and pass the mongoose connection
const blockingDataSource = new BlockingDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const blockingRepository = new BlockingRepositoryImpl(blockingDataSource);

// Create instances of the required use cases and pass the BlockingRepositoryImpl
const createBlockingUsecase = new CreateBlocking(blockingRepository);
const getAllBlockingsUsecase = new GetAllBlockings(blockingRepository);
const getBlockingByIdUsecase = new GetBlockingById(blockingRepository);
const updateBlockingUsecase = new UpdateBlocking(blockingRepository);
const deleteBlockingUsecase = new DeleteBlocking(blockingRepository);

// Initialize BlockingService and inject required dependencies
const blockingService = new BlockingService(
  createBlockingUsecase,
  getAllBlockingsUsecase,
  getBlockingByIdUsecase,
  updateBlockingUsecase,
  deleteBlockingUsecase
);

// Create an Express router
export const blockingRouter = Router();

// Route handling for creating a new blocking
blockingRouter.post("/", validateBlockingInputMiddleware(false), blockingService.createBlocking.bind(blockingService));

// Route handling for getting all blockingsx`
blockingRouter.get("/", blockingService.getAllBlockings.bind(blockingService));

// Route handling for getting an Blocking by ID
blockingRouter.get("/:id", blockingService.getBlockingById.bind(blockingService));

// Route handling for updating an blocking by ID
blockingRouter.put("/:id", validateBlockingInputMiddleware(true), blockingService.updateBlocking.bind(blockingService));

// Route handling for deleting an blocking by ID
blockingRouter.delete("/:id", blockingService.deleteBlocking.bind(blockingService));
