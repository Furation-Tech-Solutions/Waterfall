// Import necessary classes, interfaces, and dependencies
import { sequelize } from "@main/sequelizeClient"; // Importing the Sequelize connection
import { Router } from "express"; // Importing the Express Router class
import { JobService } from "@presentation/services/job-services"; // Importing the JobService class
import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources"; // Importing the JobDataSourceImpl class
import { JobRepositoryImpl } from "@data/job/repositories/job-repository-impl"; // Importing the JobRepositoryImpl class
import { CreateJob } from "@domain/job/usecases/create-job"; // Importing the CreateJob use case
import { DeleteJob } from "@domain/job/usecases/delete-job"; // Importing the DeleteJob use case
import { GetJobById } from "@domain/job/usecases/get-job-by-id"; // Importing the GetJobById use case
import { GetAllJobs } from "@domain/job/usecases/get-all-jobs"; // Importing the GetAllJobs use case
import { UpdateJob } from "@domain/job/usecases/update-job"; // Importing the UpdateJob use case
import { GettotalCount } from "@domain/job/usecases/get-total-counts"; // Importing the GettotalCount use case
import { validateJobInputMiddleware } from "@presentation/middlewares/job/validation-middleware"; // Importing a middleware for job input validation
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";
import { GetGraphData } from "@domain/job/usecases/get-graph-data";

// Create an instance of the JobDataSourceImpl and pass the Sequelize connection
const jobDataSource = new JobDataSourceImpl(sequelize);

// Create an instance of the JobRepositoryImpl and pass the JobDataSourceImpl
const jobRepository = new JobRepositoryImpl(jobDataSource);

// Create instances of the required use cases and pass the JobRepositoryImpl
const createJobUsecase = new CreateJob(jobRepository);
const deleteJobUsecase = new DeleteJob(jobRepository);
const getJobByIdUsecase = new GetJobById(jobRepository);
const updateJobUsecase = new UpdateJob(jobRepository);
const getAllJobUsecase = new GetAllJobs(jobRepository);
const gettotalCountUsecase = new GettotalCount(jobRepository);
const getGraphDataUsecase=new GetGraphData(jobRepository)

// Initialize JobService and inject required dependencies
const jobService = new JobService(
  createJobUsecase,
  deleteJobUsecase,
  getJobByIdUsecase,
  updateJobUsecase,
  getAllJobUsecase,
  gettotalCountUsecase,
  getGraphDataUsecase
);

// Create an Express router
export const jobRouter = Router();

// Route handling for creating a new Job
jobRouter.post(
  "/", // Route URL for creating a new job
  verifyUser,
  validateJobInputMiddleware(false), // Middleware for validating job input data
  jobService.createJob.bind(jobService) // Handling function for creating a new job
);

// Route handling for getting all Jobs
jobRouter.get("/",
  verifyUser,
  jobService.getAllJobs.bind(jobService)); // Route URL for getting all jobs

// Route handling for getting the total feedback count
jobRouter.get("/count",verifyUser, jobService.getTotalCount.bind(jobService));

jobRouter.get("/graphData",verifyUser,jobService.getGraphData.bind(jobService))
// Route handling for getting a Job by ID
jobRouter.get("/:id",verifyUser, jobService.getJobById.bind(jobService)); // Route URL for getting a job by ID

// Route handling for updating a Job by ID
jobRouter.put("/:id",verifyUser, validateJobInputMiddleware(true), jobService.updateJob.bind(jobService)); // Route URL for updating a job by ID

// Route handling for deleting a Job by ID
jobRouter.delete("/:id",verifyUser, jobService.deleteJob.bind(jobService)); // Route URL for deleting a job by ID
