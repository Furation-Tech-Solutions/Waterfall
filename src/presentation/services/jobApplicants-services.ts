import { NextFunction, Request, Response } from "express";
import {
  JobApplicantEntity,
  JobApplicantModel,
  JobApplicantMapper,
} from "@domain/jobApplicants/entites/jobApplicants";
import { GetJobApplicantByIdUsecase } from "@domain/jobApplicants/usecases/get-jobApplicant-by-id";
import { UpdateJobApplicantUsecase } from "@domain/jobApplicants/usecases/update-jobApplicant";
import { GetAllJobApplicantsUsecase } from "@domain/jobApplicants/usecases/get-all-jobApplicants";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { CreateJobApplicantUsecase } from "@domain/jobApplicants/usecases/create-jobApplicants";
import { DeleteJobApplicantUsecase } from "@domain/jobApplicants/usecases/delete-jobApplicant";
import { NotificationSender } from "./push-notification-services";
import { JobApplicantsResponse } from "types/jobApplicant/responseType";

export class JobApplicantService {
  private readonly createJobApplicantUsecase: CreateJobApplicantUsecase;
  private readonly getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase;
  private readonly getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase;
  private readonly updateJobApplicantUsecase: UpdateJobApplicantUsecase;
  private readonly deleteJobApplicantUsecase: DeleteJobApplicantUsecase;

  constructor(
    createJobApplicantUsecase: CreateJobApplicantUsecase,
    getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase,
    getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase,
    updateJobApplicantUsecase: UpdateJobApplicantUsecase,
    deleteJobApplicantUsecase: DeleteJobApplicantUsecase
  ) {
    this.createJobApplicantUsecase = createJobApplicantUsecase;
    this.getJobApplicantByIdUsecase = getJobApplicantByIdUsecase;
    this.getAllJobApplicantsUsecase = getAllJobApplicantsUsecase;
    this.updateJobApplicantUsecase = updateJobApplicantUsecase;
    this.deleteJobApplicantUsecase = deleteJobApplicantUsecase;
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
      documentCount: data.totalCount,
      data: data.allAplicants,
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

  async createJobApplicant(req: Request, res: Response): Promise<void> {
    const jobApplicantData: JobApplicantModel = JobApplicantMapper.toModel(
      req.body
    );

    const newJobApplicant: Either<ErrorClass, JobApplicantEntity> =
      await this.createJobApplicantUsecase.execute(jobApplicantData);

    newJobApplicant.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: JobApplicantEntity) => {
        const resData = JobApplicantMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Job applicant created successfully",
          201
        );
        const pushNotification = new NotificationSender();
        pushNotification.customNotification(
          result.applicantId,
          result.jobId,
          "appliedJob"
        );
      }
    );
    // const pushNotification=new NotificationSender()
  }

  async getJobApplicantById(req: Request, res: Response): Promise<void> {
    const jobId: string = req.params.id;

    const job: Either<ErrorClass, JobApplicantEntity> =
      await this.getJobApplicantByIdUsecase.execute(jobId);

    job.cata(
      (error: ErrorClass) => {
        if (error.message === "not found") {
          // Send success response with status code 200
          this.sendSuccessResponse(res, [], "JobApplicant not found", 200);
        } else {
          this.sendErrorResponse(res, error, 404);
        }
      },
      (result: JobApplicantEntity) => {
        const resData = JobApplicantMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Job applicant retrieved successfully"
        );
      }
    );
  }

  async getAllJobApplicants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let Id = req.headers.id;
    let Id = req.user;

    const query: any = {};

    query.q = req.query.q as string;
    query.id = Id;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);

    const jobApplicants: Either<ErrorClass, JobApplicantsResponse> =
      await this.getAllJobApplicantsUsecase.execute(query);

    jobApplicants.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (jobApplicants: JobApplicantsResponse) => {
        if (jobApplicants.jobApplicants.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const allAplicants = jobApplicants.jobApplicants.map(
            (jobApplicant: any) => JobApplicantMapper.toEntity(jobApplicant)
          );
          const totalCount = jobApplicants.totalCount;

          const resData = {
            allAplicants,
            totalCount,
          };

          this.sendSuccessResponse(res, resData);
        }
      }
    );
  }

  async updateJobApplicant(req: Request, res: Response): Promise<void> {
    const jobApplicantId: string = req.params.id;
    const jobApplicantData: JobApplicantModel = req.body;

    const existingJobApplicant: Either<ErrorClass, JobApplicantEntity> =
      await this.getJobApplicantByIdUsecase.execute(jobApplicantId);

    existingJobApplicant.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (result: JobApplicantEntity) => {
        const resData = JobApplicantMapper.toEntity(result, true);

        const updatedJobApplicantEntity: JobApplicantEntity =
          JobApplicantMapper.toEntity(jobApplicantData, true, resData);

        const updatedJobApplicant: Either<ErrorClass, JobApplicantEntity> =
          await this.updateJobApplicantUsecase.execute(
            jobApplicantId,
            updatedJobApplicantEntity
          );

        updatedJobApplicant.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500),
          (response: JobApplicantEntity) => {
            const responseData = JobApplicantMapper.toModel(response);
            // console.log(responseData, "responseData");
            this.sendSuccessResponse(
              res,
              responseData,
              "Job applicant updated successfully"
            );
            if (response.applicantStatus == "Accept") {
              const pushNotification = new NotificationSender();
              pushNotification.customNotification(
                req.user,
                result.applicantId,
                "applicantStatusAccept"
              );
            } else if (response.applicantStatus == "Decline") {
              const pushNotification = new NotificationSender();
              pushNotification.customNotification(
                req.user,
                result.applicantId,
                "applicantStatusDecline"
              );
            }
          }
        );
      }
    );
    // const pushNotification=new NotificationSender()
  }

  async deleteJobApplicant(req: Request, res: Response): Promise<void> {
    const jobApplicantId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteJobApplicantUsecase.execute(jobApplicantId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Job applicant deleted successfully",
          204
        );
      }
    );
  }
}
