// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { SupportService } from "@presentation/services/support-services";
import { SupportDataSourceImpl } from "@data/support/datasources/support-data-sources";
import { SupportRepositoryImpl } from "@data/support/repositories/support-repository-impl";
import { CreateSupport } from "@domain/support/usecases/create-support";
import { DeleteSupport } from "@domain/support/usecases/delete-support";
import { GetSupportById } from "@domain/support/usecases/get-support-by-id";
import { GetAllSupports } from "@domain/support/usecases/get-all-supports";
import { UpdateSupport } from "@domain/support/usecases/update-support";
import { validateSupportInputMiddleware } from "@presentation/middlewares/support/validation-middleware";

// Create an instance of the SupportDataSourceImpl and pass the sequelize connection
const supportDataSource = new SupportDataSourceImpl(sequelize);

// Create an instance of the SupportRepositoryImpl and pass the SupportDataSourceImpl
const supportRepository = new SupportRepositoryImpl(supportDataSource);

// Create instances of the required use cases and pass the SupportRepositoryImpl
const createSupportUsecase = new CreateSupport(supportRepository);
const deleteSupportUsecase = new DeleteSupport(supportRepository);
const getSupportByIdUsecase = new GetSupportById(supportRepository);
const updateSupportUsecase = new UpdateSupport(supportRepository);
const getAllSupportUsecase = new GetAllSupports(supportRepository);

// Initialize SupportService and inject required dependencies
const supportService = new SupportService(
  createSupportUsecase,
  deleteSupportUsecase,
  getSupportByIdUsecase,
  updateSupportUsecase,
  getAllSupportUsecase
);

// Create an Express router
export const supportRouter = Router();

// Route handling for creating a new Support
supportRouter.post(
  "/", // Endpoint for creating a new Support
  validateSupportInputMiddleware, // Apply input validation middleware
  supportService.createSupport.bind(supportService) // Bind the createSupport method to handle the route
);

// Route handling for getting a Support by ID
supportRouter.get("/:id", supportService.getSupportById.bind(supportService));

// Route handling for updating a Support by ID
supportRouter.put("/:id", supportService.updateSupport.bind(supportService));

// Route handling for deleting a Support by ID
supportRouter.delete("/:id", supportService.deleteSupport.bind(supportService));

// Route handling for getting all Supports
supportRouter.get("/", supportService.getAllSupports.bind(supportService));
