// Import necessary modules and dependencies
import { NextFunction, Request, Response } from "express";
import { Op } from 'sequelize';
import sequelize from "@main/sequelizeClient";
import Jobs from "@data/job/models/job-model";

import { JobEntity, JobModel, JobMapper } from "@domain/job/entities/job";

import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class DashBoardService {
  private readonly getAllJobsUsecase: GetAllJobsUsecase;

  // Constructor to initialize use case instances
  constructor(
    getAllJobsUsecase: GetAllJobsUsecase,
  ) {
    this.getAllJobsUsecase = getAllJobsUsecase;
  }

  // async getAllJobsAndFeedbacks(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const jobs: Either<ErrorClass, JobEntity[]> = await this.getAllJobsUsecase.execute();
  //     const feedBacks: Either<ErrorClass, FeedBackEntity[]> = await this.GetAllFeedBacksUsecase.execute();

  //     let jobsData: JobEntity[] = [];
  //     let feedBacksData: FeedBackEntity[] = [];

  //     jobs.cata(
  //       (error: ErrorClass) => {
  //         res.status(error.status).json({ error: error.message });
  //       },
  //       (jobsResult: JobEntity[]) => {
  //         jobsData = jobsResult.map((job: any) => JobMapper.toEntity(job));
  //         if (feedBacksData.length > 0) {
  //           const combinedData = {
  //             jobs: jobsData,
  //             feedbacks: feedBacksData
  //           };
  //           res.json(combinedData);
  //         }
  //       }
  //     );

  //     feedBacks.cata(
  //       (error: ErrorClass) => {
  //         res.status(error.status).json({ error: error.message });
  //       },
  //       (feedBacksResult: FeedBackEntity[]) => {
  //         feedBacksData = feedBacksResult.map((feedback: any) => FeedBackMapper.toEntity(feedback));
  //         if (jobsData.length > 0) {
  //           const combinedData = {
  //             jobs: jobsData,
  //             feedbacks: feedBacksData
  //           };
  //           res.json(combinedData);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  //   async getAllJobsAndFeedbacks(req: Request, res: Response, next: NextFunction): Promise<JobsResponse | any[]> {
  //     const { query } = req;

  //     if (query.ownerId) {
  //         const jobOwner = query.ownerId; // Assuming ownerId is used to filter jobs by owner

  //         const jobCount = await Jobs.count({
  //             where: {
  //                 jobOwner: jobOwner,
  //             }
  //         });

  //         const data = await Jobs.findAndCountAll({
  //             where: {
  //                 jobOwner: jobOwner,
  //             }
  //         });

  //         const rows = data.rows; // Extracting the 'rows' property

  //         const jobs = rows.map((job: any) => job.toJSON());

  //         const result: JobsResponse = {
  //             jobCount,
  //             jobs
  //         };

  //         return result;
  //     } else {
  //         return []; // Return an empty array if ownerId is not provided in the query
  //     }
  // }

  // async getAllJobsAndFeedbacks(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const ownerId = req.params.ownerId; // Assuming ownerId is passed in the request parameters

  //     if (ownerId === undefined) {
  //       res.status(400).json({ error: 'Owner ID is missing in the request.' });
  //       return; // Return here to avoid further execution
  //     }

  //     // Find and count all jobs associated with the owner's ID
  //     const { count, rows } = await Jobs.findAndCountAll({
  //       where: {
  //         jobOwner: ownerId,
  //       },
  //     });

  //     // Send the count and job details as a response
  //     res.json({
  //       owner: ownerId,
  //       jobCount: count,
  //       jobs: rows,
  //     });
  //   } catch (error: any) {
  //     // Handle other errors, if any
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  async getAllJobsCount(
    ownerId: string,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllJobs use case and get an Either result
    const jobs: Either<ErrorClass, JobEntity[]> =
      await this.getAllJobsUsecase.execute(ownerId);

    // Handle the result using Either's cata function
    jobs.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the results to Entities and send them as a JSON response
      (jobs: JobEntity[]) => {
        const resData = jobs.map((job: any) => JobMapper.toEntity(job));
        return res.json(resData);
      }
    );
  }


}