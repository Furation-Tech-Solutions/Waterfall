// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Correctly import Request and Response
import { JobService } from "@presentation/services/job-services";
import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources";
import { JobRepositoryImpl } from "@data/job/repositories/job-repository-impl";
import { CreateJob } from "@domain/job/usecases/create-job";
import { DeleteJob } from "@domain/job/usecases/delete-job";
import { GetJobById } from "@domain/job/usecases/get-job-by-id";
import { GetAllJobs } from "@domain/job/usecases/get-all-jobs";
import { UpdateJob } from "@domain/job/usecases/update-jobs";
import { validateJobInputMiddleware } from "@presentation/middlewares/job/validation-middleware";

// Create an instance of the JobDataSourceImpl and pass the sequalize connection
const jobDataSource = new JobDataSourceImpl(sequelize);

// Create an instance of the JobRepositoryImpl and pass the JobDataSourceImpl
const jobRepository = new JobRepositoryImpl(jobDataSource);

// Create instances of the required use cases and pass the JobRepositoryImpl
const createJobUsecase = new CreateJob(jobRepository);
const deleteJobUsecase = new DeleteJob(jobRepository);
const getJobByIdUsecase = new GetJobById(jobRepository);
const updateJobUsecase = new UpdateJob(jobRepository);
const getAllJobUsecase = new GetAllJobs(jobRepository);

// Initialize JobService and inject required dependencies
const jobService = new JobService(
  createJobUsecase,
  deleteJobUsecase,
  getJobByIdUsecase,
  updateJobUsecase,
  getAllJobUsecase
);

// Create an Express router
export const jobRouter = Router();

// Route handling for creating a new Job
jobRouter.post(
  "/",
  validateJobInputMiddleware,
  jobService.createJob.bind(jobService)
);

// Route handling for getting an Job by ID
jobRouter.get("/:id", validateJobInputMiddleware, jobService.getJobById.bind(jobService));

// Route handling for updating an Job by ID
jobRouter.put("/:id", jobService.updateJob.bind(jobService));

// Route handling for deleting an Job by ID
jobRouter.delete("/:id", jobService.deleteJob.bind(jobService));

// Route handling for getting all Jobs
jobRouter.get("/", jobService.getAllJobs.bind(jobService));
