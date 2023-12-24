// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { FAQService } from "@presentation/services/faq-services";
import { FAQDataSourceImpl } from "@data/faq/datasources/faq-data-source";
import { FAQRepositoryImpl } from "@data/faq/repositories/faq-repositories-impl";
import { CreateFAQ } from "@domain/faq/usecases/create-faq";
import { validateFAQInputMiddleware } from "@presentation/middlewares/faq/validation-middleware";
import { GetAllFAQs } from "@domain/faq/usecases/get-all-faqs";
import { GetFAQById } from "@domain/faq/usecases/get-faq-by-id";
import { UpdateFAQ } from "@domain/faq/usecases/update-faq";
import { DeleteFAQ } from "@domain/faq/usecases/delete-faq";
import { sequelize } from "@main/sequelizeClient";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

// Create an instance of the FAQDataSourceImpl and pass the mongoose connection
const faqDataSource = new FAQDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const faqRepository = new FAQRepositoryImpl(faqDataSource);

// Create instances of the required use cases and pass the FAQRepositoryImpl
const createFAQUsecase = new CreateFAQ(faqRepository);
const getAllFAQsUsecase = new GetAllFAQs(faqRepository);
const getFAQByIdUsecase = new GetFAQById(faqRepository);
const updateFAQUsecase = new UpdateFAQ(faqRepository);
const deleteFAQUsecase = new DeleteFAQ(faqRepository);

// Initialize FAQService and inject required dependencies
const faqService = new FAQService(
  createFAQUsecase,
  getAllFAQsUsecase,
  getFAQByIdUsecase,
  updateFAQUsecase,
  deleteFAQUsecase
);

// Create an Express router
export const faqRouter = Router();

// Route handling for creating a new faq
faqRouter.post(
  "/",
  verifyUser,
  validateFAQInputMiddleware(false),
  faqService.createFAQ.bind(faqService)
);

// Route handling for getting all faqsx`
faqRouter.get("/",verifyUser, faqService.getAllFAQs.bind(faqService));

// Route handling for getting an FAQ by ID
faqRouter.get("/:id",verifyUser, faqService.getFAQById.bind(faqService));

// Route handling for updating an faq by ID
faqRouter.put(
  "/:id",
  verifyUser,
  validateFAQInputMiddleware(true),
  faqService.updateFAQ.bind(faqService)
);

// Route handling for deleting an faq by ID
faqRouter.delete("/:id",verifyUser, faqService.deleteFAQ.bind(faqService));
