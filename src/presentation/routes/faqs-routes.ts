// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FAQSService } from "@presentation/services/faqs-services";
import { FAQSDataSourceImpl } from "@data/faqs/datasources/faqs-data-source";
import { FAQSRepositoryImpl } from "@data/faqs/repositories/faqs-repositories-impl";
import { CreateFAQS } from "@domain/faqs/usecases/create-faqs";
import validateFAQSMiddleware from "@presentation/middlewares/faqs/validation-middleware";
import { GetAllFAQSs } from "@domain/faqs/usecases/get-all-faqs";
import { GetFAQSById } from "@domain/faqs/usecases/get-faqs-by-id";
import { UpdateFAQS } from "@domain/faqs/usecases/update-faqs";
import { DeleteFAQS } from "@domain/faqs/usecases/delete-faqs";


// Create an instance of the FAQSDataSourceImpl and pass the mongoose connection
const faqsDataSource = new FAQSDataSourceImpl(mongoose.connection);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const faqsRepository = new FAQSRepositoryImpl(faqsDataSource);

// Create instances of the required use cases and pass the FAQSRepositoryImpl
const createFAQSUsecase = new CreateFAQS(faqsRepository);
const getAllFAQSsUsecase = new GetAllFAQSs(faqsRepository);
const getFAQSByIdUsecase = new GetFAQSById(faqsRepository);
const updateFAQSUsecase = new UpdateFAQS(faqsRepository);
const deleteFAQSUsecase = new DeleteFAQS(faqsRepository);

// Initialize FAQSService and inject required dependencies
const faqsService = new FAQSService(
  createFAQSUsecase,
  getAllFAQSsUsecase,
  getFAQSByIdUsecase,
  updateFAQSUsecase,
  deleteFAQSUsecase
);

// Create an Express router
export const faqsRouter = Router();

// Route handling for creating a new faqs
faqsRouter.post("/", validateFAQSMiddleware, faqsService.createFAQS.bind(faqsService));

// Route handling for getting all faqssx`
faqsRouter.get("/", faqsService.getAllFAQSs.bind(faqsService));

// Route handling for getting an FAQS by ID
faqsRouter.get("/:id", faqsService.getFAQSById.bind(faqsService));

// Route handling for updating an faqs by ID
faqsRouter.put("/:id", faqsService.updateFAQS.bind(faqsService));

// Route handling for deleting an faqs by ID
faqsRouter.delete("/:id", faqsService.deleteFAQS.bind(faqsService));
