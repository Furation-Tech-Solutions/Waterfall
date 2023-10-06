// // Import necessary classes, interfaces, and dependencies
// import sequelize from "@main/sequelizeClient";
// import { Router, Request, Response } from "express"; // Correctly import Request and Response
// import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources"; // Replace with the actual import path
// import { JobRepositoryImpl } from "@data/job/repositories/job-repository-impl";
// import { GetAllJobs } from "@domain/job/usecases/get-all-jobs";
// import { JobService } from "@presentation/services/job-services"; // Replace with the actual import path

// // Create an instance of the JobDataSourceImpl and pass the sequelize connection
// const jobDataSource = new JobDataSourceImpl(sequelize); // Replace with the actual class

// // Create an instance of the JobRepositoryImpl and pass the JobDataSourceImpl
// const jobRepository = new JobRepositoryImpl(jobDataSource);

// // Create instances of the required use cases and pass the JobRepositoryImpl
// const getAllJobUsecase = new GetAllJobs(jobRepository);

// // Initialize JobService and inject required dependencies
// const jobService = new JobService(
//   getAllJobUsecase
// );

// export const dashBoardRouter = Router();

// // Route handling for getting all Jobs
// dashBoardRouter.get("/", (req: Request, res: Response) => jobService.getAllJobs(req, res));
