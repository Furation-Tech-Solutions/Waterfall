// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FQAService } from "@presentation/services/fqa-services";
import { FQADataSourceImpl } from "@data/fqa/datasources/fqa-data-source";
import { FQARepositoryImpl } from "@data/fqa/repositories/fqa-repositories-impl";
import { CreateFQA } from "@domain/fqa/usecases/create-fqa";
import { validateFQAInputMiddleware } from "@presentation/middlewares/fqa/validation-middleware";
import { GetAllFQAs } from "@domain/fqa/usecases/get-all-fqas";
import { GetFQAById } from "@domain/fqa/usecases/get-fqa-by-id";
import { UpdateFQA } from "@domain/fqa/usecases/update-fqa";
import { DeleteFQA } from "@domain/fqa/usecases/delete-fqa";
import sequelize from "@main/sequelizeClient";


// Create an instance of the FQADataSourceImpl and pass the mongoose connection
const fqaDataSource = new FQADataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const fqaRepository = new FQARepositoryImpl(fqaDataSource);

// Create instances of the required use cases and pass the FQARepositoryImpl
const createFQAUsecase = new CreateFQA(fqaRepository);
const getAllFQAsUsecase = new GetAllFQAs(fqaRepository);
const getFQAByIdUsecase = new GetFQAById(fqaRepository);
const updateFQAUsecase = new UpdateFQA(fqaRepository);
const deleteFQAUsecase = new DeleteFQA(fqaRepository);

// Initialize FQAService and inject required dependencies
const fqaService = new FQAService(
  createFQAUsecase,
  getAllFQAsUsecase,
  getFQAByIdUsecase,
  updateFQAUsecase,
  deleteFQAUsecase
);

// Create an Express router
export const fqaRouter = Router();

// Route handling for creating a new fqa
fqaRouter.post("/", validateFQAInputMiddleware(false), fqaService.createFQA.bind(fqaService));

// Route handling for getting all fqasx`
fqaRouter.get("/", fqaService.getAllFQAs.bind(fqaService));

// Route handling for getting an FQA by ID
fqaRouter.get("/:id", fqaService.getFQAById.bind(fqaService));

// Route handling for updating an fqa by ID
fqaRouter.put("/:id", validateFQAInputMiddleware(true), fqaService.updateFQA.bind(fqaService));

// Route handling for deleting an fqa by ID
fqaRouter.delete("/:id", fqaService.deleteFQA.bind(fqaService));
