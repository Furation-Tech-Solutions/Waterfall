// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Correctly import Request and Response
import { JobApplicantService } from "@presentation/services/jobApplicants-services";
import { JobApplicantDataSourceImpl } from "@data/jobApplicants/datasources/jobApplicants-data-sources";
import { JobApplicantRepositoryImpl } from "@data/jobApplicants/repositories/jobApplicants-repository-impl";
import { GetJobApplicantById } from "@domain/jobApplicants/usecases/get-jobApplicant-by-id";
import { GetAllJobApplicants } from "@domain/jobApplicants/usecases/get-all-jobApplicants";
import { UpdateJobApplicant } from "@domain/jobApplicants/usecases/update-jobApplicant";
import { CreateJobApplicant } from "@domain/jobApplicants/usecases/create-jobApplicants";

// Create an instance of the JobApplicantDataSourceImpl and pass the sequelize connection
const jobApplicantDataSource = new JobApplicantDataSourceImpl(sequelize);

// Create an instance of the JobApplicantRepositoryImpl and pass the JobApplicantDataSourceImpl
const jobApplicantRepository = new JobApplicantRepositoryImpl(jobApplicantDataSource);

// Create instances of the required use cases and pass the JobApplicantRepositoryImpl
const createJobApplicantUsecase = new CreateJobApplicant(jobApplicantRepository);
const getJobApplicantByIdUsecase = new GetJobApplicantById(jobApplicantRepository);
const getAllJobApplicantUsecase = new GetAllJobApplicants(jobApplicantRepository);
const updateJobApplicantUsecase = new UpdateJobApplicant(jobApplicantRepository);


// Initialize JobApplicantService and inject required dependencies
const jobApplicantService = new JobApplicantService(
    createJobApplicantUsecase,
    getJobApplicantByIdUsecase,
    getAllJobApplicantUsecase,
    updateJobApplicantUsecase
   
);

// Create an Express router
export const jobApplicantRouter = Router();

// Route handling for creating a new Job Applicant
jobApplicantRouter.post("/", jobApplicantService.createJobApplicant.bind(jobApplicantService));

// Route handling for getting an JobApplicant by ID
jobApplicantRouter.get("/:id", jobApplicantService.getJobApplicantById.bind(jobApplicantService));


// Route handling for getting all Jobs
jobApplicantRouter.get("/", jobApplicantService.getAllJobApplicants.bind(jobApplicantService));

// Route handling for updating an JobApplicant by ID
jobApplicantRouter.put("/id", jobApplicantService.updateJobApplicant.bind(jobApplicantService));



