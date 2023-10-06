// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient"; // Import the Sequelize instance for database connection
import { Router } from "express"; // Import the Express Router class for creating routes
import { JobApplicantService } from "@presentation/services/jobApplicants-services"; // Import the JobApplicantService for handling business logic
import { JobApplicantDataSourceImpl } from "@data/jobApplicants/datasources/jobApplicants-data-sources"; // Import the data source for job applicants
import { JobApplicantRepositoryImpl } from "@data/jobApplicants/repositories/jobApplicants-repository-impl"; // Import the repository for job applicants
import { GetJobApplicantById } from "@domain/jobApplicants/usecases/get-jobApplicant-by-id"; // Import the use case to get a job applicant by ID
import { GetAllJobApplicants } from "@domain/jobApplicants/usecases/get-all-jobApplicants"; // Import the use case to get all job applicants
import { UpdateJobApplicant } from "@domain/jobApplicants/usecases/update-jobApplicant"; // Import the use case to update a job applicant
import { CreateJobApplicant } from "@domain/jobApplicants/usecases/create-jobApplicants"; // Import the use case to create a job applicant
import { validateJobApplicantInputMiddleware } from "@presentation/middlewares/jobApplicants/validation-middleware"; // Import a middleware for validating job applicant input
import { DeleteJobApplicant } from "@domain/jobApplicants/usecases/delete-jobApplicant";

// Create an instance of the JobApplicantDataSourceImpl and pass the sequelize connection
const jobApplicantDataSource = new JobApplicantDataSourceImpl(sequelize);

// Create an instance of the JobApplicantRepositoryImpl and pass the JobApplicantDataSourceImpl
const jobApplicantRepository = new JobApplicantRepositoryImpl(
  jobApplicantDataSource
);

// Create instances of the required use cases and pass the JobApplicantRepositoryImpl
const createJobApplicantUsecase = new CreateJobApplicant(
  jobApplicantRepository
); // Use case to create a job applicant
const getJobApplicantByIdUsecase = new GetJobApplicantById(
  jobApplicantRepository
); // Use case to get a job applicant by ID
const getAllJobApplicantUsecase = new GetAllJobApplicants(
  jobApplicantRepository
); // Use case to get all job applicants
const updateJobApplicantUsecase = new UpdateJobApplicant(
  jobApplicantRepository
); // Use case to update a job applicant
const deleteJobApplicantUsecase = new DeleteJobApplicant(
  jobApplicantRepository
); // Use case to delete a job applicant

// Initialize JobApplicantService and inject required dependencies
const jobApplicantService = new JobApplicantService(
  createJobApplicantUsecase,
  getJobApplicantByIdUsecase,
  getAllJobApplicantUsecase,
  updateJobApplicantUsecase,
  deleteJobApplicantUsecase
);

// Create an Express router
export const jobApplicantRouter = Router();

// Route handling for creating a new Job Applicant
jobApplicantRouter.post(
  "/", // HTTP POST request to create a new job applicant
  validateJobApplicantInputMiddleware, // Apply validation middleware before processing the request
  jobApplicantService.createJobApplicant.bind(
    jobApplicantService // Bind the createJobApplicant method from the service to handle the route
  )
);

// Route handling for getting a Job Applicant by ID
jobApplicantRouter.get(
  "/:id",
  jobApplicantService.getJobApplicantById.bind(jobApplicantService)
); // HTTP GET request to retrieve a job applicant by ID

// Route handling for getting all Job Applicants
jobApplicantRouter.get(
  "/",
  jobApplicantService.getAllJobApplicants.bind(jobApplicantService)
); // HTTP GET request to retrieve all job applicants

// Route handling for updating a Job Applicant by ID
jobApplicantRouter.put(
  "/:id",
  jobApplicantService.updateJobApplicant.bind(jobApplicantService)
); // HTTP PUT request to update a job applicant by ID

// Route handling for deleting a JobApplicant by ID
jobApplicantRouter.delete(
  "/:id",
  jobApplicantService.deleteJobApplicant.bind(jobApplicantService)
); // Route URL for deleting a jobApplican by ID
