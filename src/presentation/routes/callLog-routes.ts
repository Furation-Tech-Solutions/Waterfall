// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Import Express Router
import { CallLogService } from "@presentation/services/callLog-services";
import { CallLogDataSourceImpl } from "@data/callLog/datasources/callLog-data-sources";
import { CallLogRepositoryImpl } from "@data/callLog/repositories/callLog-repository-impl";
import { CreateCallLog } from "@domain/callLog/usecases/create-callLog";
import { DeleteCallLog } from "@domain/callLog/usecases/delete-callLog";
import { GetCallLogById } from "@domain/callLog/usecases/get-callLog-by-id";
import { GetAllCallLogs } from "@domain/callLog/usecases/get-all-callLog";
import { UpdateCallLog } from "@domain/callLog/usecases/update-callLog";
import { validateCallLogInputMiddleware } from "@presentation/middlewares/callLog/validation-middleware";

// Create an instance of the CallLogDataSourceImpl and pass the sequelize connection
const callLogDataSource = new CallLogDataSourceImpl(sequelize);

// Create an instance of the CallLogRepositoryImpl and pass the CallLogDataSourceImpl
const callLogRepository = new CallLogRepositoryImpl(callLogDataSource);

// Create instances of the required use cases and pass the CallLogRepositoryImpl
const createCallLogUsecase = new CreateCallLog(callLogRepository);
const deleteCallLogUsecase = new DeleteCallLog(callLogRepository);
const getCallLogByIdUsecase = new GetCallLogById(callLogRepository);
const updateCallLogUsecase = new UpdateCallLog(callLogRepository);
const getAllCallLogUsecase = new GetAllCallLogs(callLogRepository);

// Initialize CallJobService and inject required dependencies
const callLogService = new CallLogService(
  createCallLogUsecase,
  deleteCallLogUsecase,
  getCallLogByIdUsecase,
  updateCallLogUsecase,
  getAllCallLogUsecase
);

// Create an Express router
export const callLogRouter = Router();

// Route handling for creating a new CallLog
callLogRouter.post(
  "/", // Route URL
  validateCallLogInputMiddleware, // Middleware for input validation
  callLogService.createCallLog.bind(callLogService) // Handling function
);

// Route handling for getting a CallLog by ID
callLogRouter.get("/:id", callLogService.getCallLogById.bind(callLogService));

// Route handling for updating a CallLog by ID
callLogRouter.put("/:id", callLogService.updateCallLog.bind(callLogService));

// Route handling for deleting a CallLog by ID
callLogRouter.delete("/:id", callLogService.deleteCallLog.bind(callLogService));

// Route handling for getting all CallLogs
callLogRouter.get("/", callLogService.getAllCallLogs.bind(callLogService));
