// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient"; // Importing the Sequelize connection
import { Router } from "express"; // Importing the Express Router class

// Importing the DashBoardService class
import { DashBoardService } from "@presentation/services/dashBoard-services"; 

// Importing the JobDataSourceImpl,FeedBackDataSourceImpl class
import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources"; 

// Importing the JobRepositoryImpl,FeedBackRepositoryImpl class
import { JobRepositoryImpl } from "@data/job/repositories/job-repository-impl"; 

// Importing the GetAllJobs,GetAllFeedBacks use case
import { GetAllJobs } from "@domain/job/usecases/get-all-jobs"; 

// Create an instance of the JobDataSourceImpl,FeedBackDataSourceImpl and pass the Sequelize connection
const jobDataSource = new JobDataSourceImpl(sequelize);

// Create an instance of the JobRepositoryImpl,FeedBackRepositoryImpl and pass the JobDataSourceImpl,FeedBackDataSourceImpl
const jobRepository = new JobRepositoryImpl(jobDataSource);

// Create instances of the required use cases and pass the JobRepositoryImpl,FeedBackRepositoryImpl
const getAllJobsUsecase = new GetAllJobs(jobRepository);

// Initialize DashBoardService and inject required dependencies
const dashboardService  = new DashBoardService(
    getAllJobsUsecase
);

// Create an Express router
export const dashBoardRouter = Router();

// Route handling for getting all Data
dashBoardRouter.get("/", dashboardService.getAllJobsCount.bind(dashboardService)); // Route URL for getting all Data