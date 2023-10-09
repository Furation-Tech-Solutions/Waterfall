// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { BugReportService } from "@presentation/services/bugReport-services";
import { BugReportDataSourceImpl } from "@data/bugReport/datasources/bugReport-data-sources";
import { BugReportRepositoryImpl } from "@data/bugReport/repositories/bugReport-repository-impl";
import { CreateBugReport } from "@domain/bugReport/usecases/create-bugReport";
import { DeleteBugReport } from "@domain/bugReport/usecases/delete-bugReport";
import { GetBugReportById } from "@domain/bugReport/usecases/get-bugReport-by-id";
import { GetAllBugReports } from "@domain/bugReport/usecases/get-all-bugReports";
import { UpdateBugReport } from "@domain/bugReport/usecases/update-bugReport";
import { validateBugReportInputMiddleware } from "@presentation/middlewares/bugReport/validation-middleware";

// Create an instance of the BugReportDataSourceImpl and pass the sequelize connection
const bugReportDataSource = new BugReportDataSourceImpl(sequelize);

// Create an instance of the BugReportRepositoryImpl and pass the BugReportDataSourceImpl
const bugReportRepository = new BugReportRepositoryImpl(bugReportDataSource);

// Create instances of the required use cases and pass the BugReportRepositoryImpl
const createBugReportUsecase = new CreateBugReport(bugReportRepository);
const deleteBugReportUsecase = new DeleteBugReport(bugReportRepository);
const getBugReportByIdUsecase = new GetBugReportById(bugReportRepository);
const updateBugReportUsecase = new UpdateBugReport(bugReportRepository);
const getAllBugReportUsecase = new GetAllBugReports(bugReportRepository);

// Initialize BugReportService and inject required dependencies
const bugReportService = new BugReportService(
  createBugReportUsecase,
  deleteBugReportUsecase,
  getBugReportByIdUsecase,
  updateBugReportUsecase,
  getAllBugReportUsecase
);

// Create an Express router
export const bugReportRouter = Router();

// Route handling for creating a new BugReport
bugReportRouter.post(
  "/",
  validateBugReportInputMiddleware, // Apply input validation middleware
  bugReportService.createBugReport.bind(bugReportService) // Bind the createBugReport method to handle the route
);

// Route handling for getting a BugReport by ID
bugReportRouter.get(
  "/:id",
  bugReportService.getBugReportById.bind(bugReportService)
);

// Route handling for updating a BugReport by ID
bugReportRouter.put(
  "/:id",
  bugReportService.updateBugReport.bind(bugReportService)
);

// Route handling for deleting a BugReport by ID
bugReportRouter.delete(
  "/:id",
  bugReportService.deleteBugReport.bind(bugReportService)
);

// Route handling for getting all BugReports
bugReportRouter.get(
  "/",
  bugReportService.getAllBugReports.bind(bugReportService)
);
