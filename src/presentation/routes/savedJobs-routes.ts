// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { SavedJobService } from "@presentation/services/savedJobs-services";
import { SavedJobDataSourceImpl } from "@data/savedJobs/datasources/savedJobs-data-sources";
import { SavedJobRepositoryImpl } from "@data/savedJobs/repositories/savedJobs-repository-impl";
import { CreateSavedJob } from "@domain/savedJobs/usecases/create-savedJobs";
import { DeleteSavedJob } from "@domain/savedJobs/usecases/delete-savedJobs";
import { GetSavedJobById } from "@domain/savedJobs/usecases/get-savedJobs-by-id";
import { GetAllSavedJobs } from "@domain/savedJobs/usecases/get-all-savedJobs";
import { UpdateSavedJob } from "@domain/savedJobs/usecases/update-savedJobs";
import { validateSavedJobInputMiddleware } from "@presentation/middlewares/savedJobs/validation-middleware";

// Create an instance of the SavedJobDataSourceImpl and pass the sequelize connection
const savedJobDataSource = new SavedJobDataSourceImpl(sequelize);

// Create an instance of the SavedJobRepositoryImpl and pass the SavedJobDataSourceImpl
const savedJobRepository = new SavedJobRepositoryImpl(savedJobDataSource);

// Create instances of the required use cases and pass the SavedJobRepositoryImpl
const createSavedJobUsecase = new CreateSavedJob(savedJobRepository);
const deleteSavedJobUsecase = new DeleteSavedJob(savedJobRepository);
const getSavedJobByIdUsecase = new GetSavedJobById(savedJobRepository);
const updateSavedJobUsecase = new UpdateSavedJob(savedJobRepository);
const getAllSavedJobUsecase = new GetAllSavedJobs(savedJobRepository);

// Initialize SavedJobService and inject required dependencies
const savedJobService = new SavedJobService(
  createSavedJobUsecase,
  deleteSavedJobUsecase,
  getSavedJobByIdUsecase,
  updateSavedJobUsecase,
  getAllSavedJobUsecase
);

// Create an Express router
export const savedJobRouter = Router();

// Route handling for creating a new Job
savedJobRouter.post(
  "/", // Define the route URL
  validateSavedJobInputMiddleware, // Apply input validation middleware
  savedJobService.createSavedJob.bind(savedJobService) // Bind the createSavedJob method to handle the route
);

// Route handling for getting a SavedJob by ID
savedJobRouter.get(
  "/:id",
  savedJobService.getSavedJobById.bind(savedJobService)
);

// Route handling for updating a SavedJob by ID
savedJobRouter.put(
  "/:id",
  savedJobService.updateSavedJob.bind(savedJobService)
);

// Route handling for deleting a SavedJob by ID
savedJobRouter.delete(
  "/:id",
  savedJobService.deleteSavedJob.bind(savedJobService)
);

// Route handling for getting all SavedJobs
savedJobRouter.get("/", savedJobService.getAllSavedJobs.bind(savedJobService));
