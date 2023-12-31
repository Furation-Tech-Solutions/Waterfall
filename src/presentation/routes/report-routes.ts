// Import necessary classes, interfaces, and dependencies
import { sequelize } from "@main/sequelizeClient";
import { Router, Request, Response } from "express"; // Import the Router class and Request/Response types from Express
import { ReportService } from "@presentation/services/report-services";
import { ReportDataSourceImpl } from "@data/report/datasources/report-data-sources";
import { ReportRepositoryImpl } from "@data/report/repositories/report-repository-impl";
import { CreateReport } from "@domain/report/usecases/create-report";
import { DeleteReport } from "@domain/report/usecases/delete-report";
import { GetReportById } from "@domain/report/usecases/get-report-by-id";
import { CheckReport } from "@domain/report/usecases/check_Report";
import { GetAllReports } from "@domain/report/usecases/get-all-reports";
import { UpdateReport } from "@domain/report/usecases/update-report";
import { validateReportInputMiddleware } from "@presentation/middlewares/report/validation-middleware";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

// Create an instance of the ReportDataSourceImpl and pass the Sequelize connection
const reportDataSource = new ReportDataSourceImpl(sequelize);

// Create an instance of the ReportRepositoryImpl and pass the ReportDataSourceImpl
const reportRepository = new ReportRepositoryImpl(reportDataSource);

// Create instances of the required use cases and pass the ReportRepositoryImpl
const createReportUsecase = new CreateReport(reportRepository);
const deleteReportUsecase = new DeleteReport(reportRepository);
const getReportByIdUsecase = new GetReportById(reportRepository);
const CheckReportUsecase = new CheckReport(reportRepository);
const updateReportUsecase = new UpdateReport(reportRepository);
const getAllReportUsecase = new GetAllReports(reportRepository);

// Initialize ReportService and inject required dependencies
const reportService = new ReportService(
  createReportUsecase,
  deleteReportUsecase,
  getReportByIdUsecase,
  CheckReportUsecase,
  updateReportUsecase,
  getAllReportUsecase
);

// Create an Express router
export const reportRouter = Router();

// Route handling for creating a new Report
reportRouter.post(
  "/",
  verifyUser,
  validateReportInputMiddleware(false), // Apply input validation middleware
  reportService.createReport.bind(reportService) // Bind the createReport method to handle the route
);

// Route handling for getting a Report by ID
reportRouter.get("/:id", verifyUser, reportService.getReportById.bind(reportService));

// check report by id
reportRouter.get("/check/:id", verifyUser, reportService.checkReport.bind(reportService));

// Route handling for updating a Report by ID
reportRouter.put("/:id", verifyUser, validateReportInputMiddleware(true), reportService.updateReport.bind(reportService));

// Route handling for deleting a Report by ID
reportRouter.delete("/:id", verifyUser, reportService.deleteReport.bind(reportService));

// Route handling for getting all Reports
reportRouter.get("/reported/:id",verifyUser, reportService.getAllReports.bind(reportService));
