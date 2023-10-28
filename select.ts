// // Import necessary modules and dependencies
// import { NextFunction, Request, Response } from "express";

// import { JobEntity, JobModel, JobMapper } from "@domain/job/entities/job";
// import { FeedBackModel, FeedBackEntity, FeedBackMapper } from "@domain/feedBack/entities/feedBack";

// import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
// import { GetAllFeedBacksUsecase } from "@domain/feedBack/usecases/get-all-feedBacks";

// import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
// import { Either } from "monet";

// export class DashBoardService {
//     private readonly getAllJobsUsecase: GetAllJobsUsecase;
//     private readonly GetAllFeedBacksUsecase: GetAllFeedBacksUsecase;
    
//     // Constructor to initialize use case instances
//     constructor(
//         getAllJobsUsecase: GetAllJobsUsecase,
//         GetAllFeedBacksUsecase: GetAllFeedBacksUsecase
//     ) {
//         this.getAllJobsUsecase = getAllJobsUsecase;
//         this.GetAllFeedBacksUsecase = GetAllFeedBacksUsecase;
//       }

//       async getAllJobsAndFeedbacks(req: Request, res: Response, next: NextFunction): Promise<void> {
//         // Execute the getAllJobs use case and get an Either result
//         const jobs: Either<ErrorClass, JobEntity[]> = await this.getAllJobsUsecase.execute();
//         const feedBacks: Either<ErrorClass, FeedBackEntity[]> = await this.GetAllFeedBacksUsecase.execute();
    
//         jobs.cata(
//           (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
//           (jobs: JobEntity[]) => {
//             const resData = jobs.map((job: any) => JobMapper.toEntity(job));
//             return res.json(resData);
//           }
//         );
          
//         feedBacks.cata(
//           (error: ErrorClass) => 
//             res.status(error.status).json({ error: error.message }),
//           (feedBacks: FeedBackEntity[]) => {
//             const resData = feedBacks.map((feedback: any) => FeedBackMapper.toEntity(feedback));
//             return res.json(resData);
//           }
//         );
//       }

//       // async getAllFeedBacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    
//       //   // const id: string = req.params.id;
//       //   // console.log("fhgfhgfhgfgffhhf",id);
        
//       //   // const Id: number = parseInt(id, 10);
        
//       //   // Call the GetAllFeedBacksUsecase to get all Feedbacks
//       //   const feedBacks: Either<ErrorClass, FeedBackEntity[]> = 
//       //   await this.GetAllFeedBacksUsecase.execute();
          
//       //   feedBacks.cata(
//       //     (error: ErrorClass) => 
//       //       res.status(error.status).json({ error: error.message }),
//       //     (feedBacks: FeedBackEntity[]) => {
//       //       // Filter out feedbacks with del_status set to "Deleted"
//       //       // const nonDeletedFeedBacks = result.filter((feedback) => feedback.deleteStatus !== false);
    
//       //       // Convert non-deleted feedbacks from an array of FeedBackEntity to an array of plain JSON objects using feedbackMapper
//       //       const resData = feedBacks.map((feedback: any) => FeedBackMapper.toEntity(feedback));
//       //       return res.json(resData);
//       //     }
//       // );
//       // }
// }

// // Within the DashBoardService class, create a new method to get all jobs and feedbacks in one route


// // export class DashBoardService {
// //       private readonly getAllJobsUsecase: GetAllJobsUsecase;
// //       private readonly GetAllFeedBacksUsecase: GetAllFeedBacksUsecase;

// //   constructor(
// //             getAllJobsUsecase: GetAllJobsUsecase,
// //             GetAllFeedBacksUsecase: GetAllFeedBacksUsecase
// //   ) {
// //     this.getAllJobsUsecase = getAllJobsUsecase;
// //     this.GetAllFeedBacksUsecase = GetAllFeedBacksUsecase;
// //   }

// //   // Method to get all jobs and feedbacks in one route
// //   async getAllJobsAndFeedbacks() {
// //     const allJobs = await this.getAllJobsUsecase.execute();
// //     console.log("------JOBS>",allJobs);
    
// //     const allFeedbacks = await this.GetAllFeedBacksUsecase.execute();
// //     console.log("------FEEDBACKS>",allFeedbacks);

// //     return {
// //       jobs: allJobs,
// //       feedbacks: allFeedbacks
// //     };
// //   }
// // }





//------------------------------------------------------



// const JobModel = sequelize.models.Job;
//     const jobsCountAndRows = await JobModel.findAndCountAll({
//       where: {
//         jobPosts: {
//           [Op.like]: 'JobEntity'
//         }
//       },
//     });
//     const { count, rows } = jobsCountAndRows;

//     console.log("---------->",count);
//     console.log(rows);