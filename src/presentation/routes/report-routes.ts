// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router, Request, Response } from "express"; // Import the Router class and Request/Response types from Express
import { ReportService } from "@presentation/services/report-services";
import { ReportDataSourceImpl } from "@data/report/datasources/report-data-sources";
import { ReportRepositoryImpl } from "@data/report/repositories/report-repository-impl";
import { CreateReport } from "@domain/report/usecases/create-report";
import { DeleteReport } from "@domain/report/usecases/delete-report";
import { GetReportById } from "@domain/report/usecases/get-report-by-id";
import { GetAllReports } from "@domain/report/usecases/get-all-reports";
import { UpdateReport } from "@domain/report/usecases/update-report";
import { validateReportInputMiddleware } from "@presentation/middlewares/report/validation-middleware";

// Create an instance of the ReportDataSourceImpl and pass the Sequelize connection
const reportDataSource = new ReportDataSourceImpl(sequelize);

// Create an instance of the ReportRepositoryImpl and pass the ReportDataSourceImpl
const reportRepository = new ReportRepositoryImpl(reportDataSource);

// Create instances of the required use cases and pass the ReportRepositoryImpl
const createReportUsecase = new CreateReport(reportRepository);
const deleteReportUsecase = new DeleteReport(reportRepository);
const getReportByIdUsecase = new GetReportById(reportRepository);
const updateReportUsecase = new UpdateReport(reportRepository);
const getAllReportUsecase = new GetAllReports(reportRepository);

// Initialize ReportService and inject required dependencies
const reportService = new ReportService(
  createReportUsecase,
  deleteReportUsecase,
  getReportByIdUsecase,
  updateReportUsecase,
  getAllReportUsecase
);

// Create an Express router
export const reportRouter = Router();

// Route handling for creating a new Report
reportRouter.post(
  "/",
  validateReportInputMiddleware, // Apply input validation middleware
  reportService.createReport.bind(reportService) // Bind the createReport method to handle the route
);

// Route handling for getting a Report by ID
reportRouter.get("/:id", reportService.getReportById.bind(reportService));

// Route handling for updating a Report by ID
reportRouter.put("/:id", reportService.updateReport.bind(reportService));

// Route handling for deleting a Report by ID
reportRouter.delete("/:id", reportService.deleteReport.bind(reportService));

// Route handling for getting all Reports
reportRouter.get("/", reportService.getAllReports.bind(reportService));
