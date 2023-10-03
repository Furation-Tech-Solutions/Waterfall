// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Correctly import Request and Response
import { UpcomingTaskService } from "@presentation/services/upcomingTask-services";
import { UpcomingTaskDataSourceImpl } from "@data/upcomingTask/datasources/upcomingTask-data-sources";
import { UpcomingTaskRepositoryImpl } from "@data/upcomingTask/repositories/upcomingTask-repository-impl";
import { CreateUpcomingTask } from "@domain/upcomingTask/usecases/create-upcomingTask";
import { GetUpcomingTaskById } from "@domain/upcomingTask/usecases/get-upcomingTask-by-id";
import { GetAllUpcomingTasks } from "@domain/upcomingTask/usecases/get-all-upcomingTasks";
import { UpdateUpcomingTask } from "@domain/upcomingTask/usecases/update-upcomingTask";
import { validateUpcomingTaskInputMiddleware } from "@presentation/middlewares/upcomingTask/validation-middleware";

// Create an instance of the UpcomingTaskDataSourceImpl and pass the sequalize connection
const upcomingTaskDataSource = new UpcomingTaskDataSourceImpl(sequelize);

// Create an instance of the UpcomingTaskRepositoryImpl and pass the UpcomingTaskDataSourceImpl
const upcomingTaskRepository = new UpcomingTaskRepositoryImpl(
  upcomingTaskDataSource
);

// Create instances of the required use cases and pass the UpcomingTaskRepositoryImpl
const createUpcomingTaskUsecase = new CreateUpcomingTask(
  upcomingTaskRepository
);
const getUpcomingTaskByIdUsecase = new GetUpcomingTaskById(
  upcomingTaskRepository
);
const updateUpcomingTaskUsecase = new UpdateUpcomingTask(
  upcomingTaskRepository
);
const getAllUpcomingTaskUsecase = new GetAllUpcomingTasks(
  upcomingTaskRepository
);

// Initialize UpcomingTaskService and inject required dependencies
const upcomingTaskService = new UpcomingTaskService(
  createUpcomingTaskUsecase,
  getUpcomingTaskByIdUsecase,
  updateUpcomingTaskUsecase,
  getAllUpcomingTaskUsecase
);
// Create an Express router
export const upcomingTaskRouter = Router();

// Route handling for creating a new UpcomingTask
upcomingTaskRouter.post(
  "/",
  validateUpcomingTaskInputMiddleware,
  upcomingTaskService.createUpcomingTask.bind(upcomingTaskService)
);

// Route handling for getting an UpcomingTask by ID
upcomingTaskRouter.get(
  "/:id",
  upcomingTaskService.getUpcomingTaskById.bind(upcomingTaskService)
);

// Route handling for updating an UpcomingTask by ID
upcomingTaskRouter.put(
  "/:id",
  upcomingTaskService.updateUpcomingTask.bind(upcomingTaskService)
);

// Route handling for getting all UpcomingTasks
upcomingTaskRouter.get(
  "/",
  upcomingTaskService.getAllUpcomingTasks.bind(upcomingTaskService)
);
