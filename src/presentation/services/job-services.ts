import { NextFunction, Request, Response } from "express";
import { JobEntity, JobModel, JobMapper } from "@domain/job/entites/job";
import { CreateJobUsecase } from "@domain/job/usecases/create-job";
import { DeleteJobUsecase } from "@domain/job/usecases/delete-job";
import { GetJobByIdUsecase } from "@domain/job/usecases/get-job-by-id";
import { UpdateJobUsecase } from "@domain/job/usecases/update-jobs";
import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class JobService {
    private readonly createJobUsecase: CreateJobUsecase;
    private readonly deleteJobUsecase: DeleteJobUsecase;
    private readonly getJobByIdUsecase: GetJobByIdUsecase;
    private readonly updateJobUsecase: UpdateJobUsecase;
    private readonly getAllJobsUsecase: GetAllJobsUsecase;

    constructor(
        createJobUsecase: CreateJobUsecase,
        deleteJobUsecase: DeleteJobUsecase,
        getJobByIdUsecase: GetJobByIdUsecase,
        updateJobUsecase: UpdateJobUsecase,
        getAllJobsUsecase: GetAllJobsUsecase
    ) {
        this.createJobUsecase = createJobUsecase;
        this.deleteJobUsecase = deleteJobUsecase;
        this.getJobByIdUsecase = getJobByIdUsecase;
        this.updateJobUsecase = updateJobUsecase;
        this.getAllJobsUsecase = getAllJobsUsecase;
    }

    async createJob(req: Request, res: Response): Promise<void> {
        const jobData: JobModel = JobMapper.toModel(req.body);

        const newJob: Either<ErrorClass, JobEntity> =
            await this.createJobUsecase.execute(jobData);

        newJob.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: JobEntity) => {
                const resData = JobMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }

    async deleteJob(req: Request, res: Response): Promise<void> {
        const jobId: string = req.params.id;

        const response: Either<ErrorClass, void> =
            await this.deleteJobUsecase.execute(jobId);

        response.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            () => {
                return res.json({ message: "Job deleted successfully." });
            }
        );
    }

    async getJobById(req: Request, res: Response): Promise<void> {
        const jobId: string = req.params.id;

        const job: Either<ErrorClass, JobEntity> =
            await this.getJobByIdUsecase.execute(jobId);

        job.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: JobEntity) => {
                const resData = JobMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }

    async updateJob(req: Request, res: Response): Promise<void> {


        const jobId: string = req.params.id;
        const jobData: JobModel = req.body;

        const existingJob: Either<ErrorClass, JobEntity> =
            await this.getJobByIdUsecase.execute(jobId);

        existingJob.cata(
            (error: ErrorClass) => {
                res.status(error.status).json({ error: error.message });
            },
            async (result: JobEntity) => {
                const resData = JobMapper.toEntity(result, true);


                const updatedJobEntity: JobEntity = JobMapper.toEntity(
                    jobData,
                    true,
                    resData
                );

                const updatedJob: Either<ErrorClass, JobEntity> =
                    await this.updateJobUsecase.execute(
                        jobId,
                        updatedJobEntity
                    );

                updatedJob.cata(
                    (error: ErrorClass) => {
                        res.status(error.status).json({ error: error.message });
                    },
                    (response: JobEntity) => {
                        const responseData = JobMapper.toModel(response);

                        res.json(responseData);


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
        const jobs: Either<ErrorClass, JobEntity[]> =
            await this.getAllJobsUsecase.execute();

        jobs.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (jobs: JobEntity[]) => {
                const resData = jobs.map((job: any) =>
                    JobMapper.toEntity(job)
                );
                return res.json(resData);
            }
        );
    }
}


