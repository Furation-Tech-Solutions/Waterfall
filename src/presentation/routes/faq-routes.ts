// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FQAService } from "@presentation/services/faq-services";
import { FQADataSourceImpl } from "@data/faq/datasources/faq-data-source";
import { FQARepositoryImpl } from "@data/faq/repositories/faq-repositories-impl";
import { CreateFQA } from "@domain/faq/usecases/create-faq";
import { validateFQAInputMiddleware } from "@presentation/middlewares/faq/validation-middleware";
import { GetAllFQAs } from "@domain/faq/usecases/get-all-faqs";
import { GetFQAById } from "@domain/faq/usecases/get-faq-by-id";
import { UpdateFQA } from "@domain/faq/usecases/update-faq";
import { DeleteFQA } from "@domain/faq/usecases/delete-faq";
import { sequelize } from "@main/sequelizeClient";

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
fqaRouter.post(
  "/",
  validateFQAInputMiddleware(false),
  fqaService.createFQA.bind(fqaService)
);

// Route handling for getting all fqasx`
fqaRouter.get("/", fqaService.getAllFQAs.bind(fqaService));

// Route handling for getting an FQA by ID
fqaRouter.get("/:id", fqaService.getFQAById.bind(fqaService));

// Route handling for updating an fqa by ID
fqaRouter.put(
  "/:id",
  validateFQAInputMiddleware(true),
  fqaService.updateFQA.bind(fqaService)
);

// Route handling for deleting an fqa by ID
fqaRouter.delete("/:id", fqaService.deleteFQA.bind(fqaService));
