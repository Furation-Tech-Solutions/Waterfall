import { NextFunction, Request, Response } from "express";
import { JobEntity, JobModel, JobMapper, JobCountEntity, ExpenditureGraphEntity } from "@domain/job/entities/job";
import { CreateJobUsecase } from "@domain/job/usecases/create-job";
import { DeleteJobUsecase } from "@domain/job/usecases/delete-job";
import { GetJobByIdUsecase } from "@domain/job/usecases/get-job-by-id";
import { UpdateJobUsecase } from "@domain/job/usecases/update-job";
import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
import { GettotalCountUsecase } from "@domain/job/usecases/get-total-counts";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import SESMailService from "./email-ses-services";
import SMSService from "./sms-service";
import { NotificationSender } from "./push-notification-services";
import { GetGraphDataUseCase } from "@domain/job/usecases/get-graph-data";

export class JobService {
  private readonly createJobUsecase: CreateJobUsecase;
  private readonly deleteJobUsecase: DeleteJobUsecase;
  private readonly getJobByIdUsecase: GetJobByIdUsecase;
  private readonly updateJobUsecase: UpdateJobUsecase;
  private readonly getAllJobsUsecase: GetAllJobsUsecase;
  private readonly gettotalCountUsecase: GettotalCountUsecase;
  private readonly getGraphDataUsecase: GetGraphDataUseCase;

  constructor(
    createJobUsecase: CreateJobUsecase,
    deleteJobUsecase: DeleteJobUsecase,
    getJobByIdUsecase: GetJobByIdUsecase,
    updateJobUsecase: UpdateJobUsecase,
    getAllJobsUsecase: GetAllJobsUsecase,
    gettotalCountUsecase: GettotalCountUsecase,
    getGraphDataUsecase: GetGraphDataUseCase,
  ) {
    this.createJobUsecase = createJobUsecase;
    this.deleteJobUsecase = deleteJobUsecase;
    this.getJobByIdUsecase = getJobByIdUsecase;
    this.updateJobUsecase = updateJobUsecase;
    this.getAllJobsUsecase = getAllJobsUsecase;
    this.gettotalCountUsecase = gettotalCountUsecase;
    this.getGraphDataUsecase=getGraphDataUsecase
  }

  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  async createJob(req: Request, res: Response): Promise<void> {
    const jobData: JobModel = JobMapper.toModel(req.body);

    const newJob: Either<ErrorClass, JobEntity> =
      await this.createJobUsecase.execute(jobData);

    newJob.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "Job created successfully", 201);
      }
    );
  }

  async deleteJob(req: Request, res: Response): Promise<void> {
    const jobId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteJobUsecase.execute(jobId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      () => {
        this.sendSuccessResponse(res, {}, "Job deleted successfully", 204);
      }
    );
  }

  async getJobById(req: Request, res: Response): Promise<void> {
    const jobId: string = req.params.id;

    const job: Either<ErrorClass, JobEntity> =
      await this.getJobByIdUsecase.execute(jobId);

    job.cata(
      (error: ErrorClass) => {
        if (error.message === "not found") {
          // Send success response with status code 200
          this.sendSuccessResponse(res, [], "Job not found", 200);
        } else {
          this.sendErrorResponse(res, error, 404);
        }
      },
      (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "Job retrieved successfully");
      }
    );
  }

  async updateJob(req: Request, res: Response): Promise<void> {
    const jobId: string = req.params.id;
    const jobData: JobModel = req.body;

    const existingJob: Either<ErrorClass, JobEntity> =
      await this.getJobByIdUsecase.execute(jobId);

    existingJob.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);

        const updatedJobEntity: JobEntity = JobMapper.toEntity(
          jobData,
          true,
          resData
        );

        const updatedJob: Either<ErrorClass, JobEntity> =
          await this.updateJobUsecase.execute(jobId, updatedJobEntity);

        updatedJob.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500),
          (response: JobEntity) => {
            const responseData = JobMapper.toModel(response);
            this.sendSuccessResponse(
              res,
              responseData,
              "Job updated successfully"
            );
            // console.log(response, "response");
            const pushNotification = new NotificationSender();
            // pushNotification.customNotification(result.applicantId,result.jobId,"appliedJob")
          }
        );
      }
    );
  }

  async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let loginId = req.user;
    // let Id = req.headers.id;
    let Id = req.user;
    // loginId = "1"; // For testing purposes, manually set loginId to "2"

    const query: any = {};

    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = Id;
    query.year = parseInt(req.query.year as string, 10);
    query.months = [parseInt(req.query.month as string, 10)];
    query.jobType = req.query.jobType as string;
    query.feeType = req.query.feeType as string;
    query.sortOrder = req.query.sortOrder as string;
    // query.feeType = req.query.feeType as string;

    const jobs: Either<ErrorClass, JobEntity[]> =
      await this.getAllJobsUsecase.execute(query);
    jobs.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (jobs: JobEntity[]) => {
        if (jobs.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = jobs.map((job: any) => JobMapper.toEntity(job));
          this.sendSuccessResponse(res, resData);
        }
      }
    );
  }

  async getTotalCount(req: Request, res: Response): Promise<void> {
    let id: string = req.user;
    let loginId = id; // For testing purposes, manually set loginId to "2"

    const query: any = {};

    query.q = req.query.q as string;
    // query.year = req.query.year ;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = loginId;
    query.year = parseInt(req.query.year as string, 10);
    query.months = (req.query.months as string || '').split(',').map(month => parseInt(month, 10)).filter(month => !isNaN(month));
    // query.months = [parseInt(req.query.month as string, 10)];
    console.log(query.months,"inisde service")

    
    

    const count: Either<ErrorClass, JobCountEntity> =
      await this.gettotalCountUsecase.execute(query);
    count.cata(
      (error: ErrorClass) => {
        // console.log(error,"error in service"),
        this.sendErrorResponse(res, error, 500)},
      (result: JobCountEntity) => {
        this.sendSuccessResponse(res,  result );
      }
    );
  }
  async getGraphData(req: Request, res: Response): Promise<void> {
    console.log("inside grapgh data")
    let id: string = req.user;
    let loginId = id; // For testing purposes, manually set loginId to "2"

    const query: any = {};

    query.q = req.query.q as string;
    // query.year = req.query.year ;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = loginId;
    query.year = parseInt(req.query.year as string, 10);
    query.months = (req.query.months as string || '').split(',').map(month => parseInt(month, 10)).filter(month => !isNaN(month));
    // query.months = [parseInt(req.query.month as string, 10)];
    console.log(query.months,"inisde service")

    
    

    const graphData: Either<ErrorClass, ExpenditureGraphEntity> =
      await this.getGraphDataUsecase.execute(query);
      graphData.cata(
      (error: ErrorClass) => {
        console.log(error,"error in service"),
        this.sendErrorResponse(res, error, 500)},
      (result: ExpenditureGraphEntity) => {
        console.log(result,"result")
        this.sendSuccessResponse(res,result );
      }
    );
  }
}

