import { NextFunction, Request, Response } from "express";
import { JobApplicantEntity, JobApplicantModel, JobApplicantMapper } from "@domain/jobApplicants/entites/jobApplicants";
import { GetJobApplicantByIdUsecase } from "@domain/jobApplicants/usecases/get-jobApplicant-by-id";
import { UpdateJobApplicantUsecase } from "@domain/jobApplicants/usecases/update-jobApplicant";
import { GetAllJobApplicantsUsecase } from "@domain/jobApplicants/usecases/get-all-jobApplicants";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { CreateJobApplicantUsecase } from "@domain/jobApplicants/usecases/create-jobApplicants";

export class JobApplicantService {
    private readonly createJobApplicantUsecase: CreateJobApplicantUsecase;
    private readonly getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase;
    private readonly getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase;
    private readonly updateJobApplicantUsecase: UpdateJobApplicantUsecase;

    constructor(
        createJobApplicantUsecase: CreateJobApplicantUsecase,
        getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase,
        getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase,
        updateJobApplicantUsecase: UpdateJobApplicantUsecase,
    ) {
        this.createJobApplicantUsecase = createJobApplicantUsecase;
        this.getJobApplicantByIdUsecase = getJobApplicantByIdUsecase;
        this.getAllJobApplicantsUsecase = getAllJobApplicantsUsecase;
        this.updateJobApplicantUsecase = updateJobApplicantUsecase;
    }

    async createJobApplicant(req: Request, res: Response): Promise<void> {
        const jobApplicantData: JobApplicantModel = JobApplicantMapper.toModel(req.body);

        const newJobApplicant: Either<ErrorClass, JobApplicantEntity> =
            await this.createJobApplicantUsecase.execute(jobApplicantData);

        newJobApplicant.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: JobApplicantEntity) => {
                const resData = JobApplicantMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }

    async getJobApplicantById(req: Request, res: Response): Promise<void> {
        const jobId: string = req.params.id;

        const job: Either<ErrorClass, JobApplicantEntity> =
            await this.getJobApplicantByIdUsecase.execute(jobId);

        job.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: JobApplicantEntity) => {
                const resData = JobApplicantMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }



    async getAllJobApplicants(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const jobs: Either<ErrorClass, JobApplicantEntity[]> =
            await this.getAllJobApplicantsUsecase.execute();

        jobs.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (jobApplicants: JobApplicantEntity[]) => {
                const resData = jobs.map((jobApplicant: any) =>
                    JobApplicantMapper.toEntity(jobApplicant)
                );
                return res.json(resData);
            }
        );
    }

    async updateJobApplicant(req: Request, res: Response): Promise<void> {


        const jobApplicantId: string = req.params.id;
        const jobApplicantData: JobApplicantModel = req.body;

        const existingJobApplicant: Either<ErrorClass, JobApplicantEntity> =
            await this.getJobApplicantByIdUsecase.execute(jobApplicantId);

        existingJobApplicant.cata(
            (error: ErrorClass) => {
                res.status(error.status).json({ error: error.message });
            },
            async (result: JobApplicantEntity) => {
                const resData = JobApplicantMapper.toEntity(result, true);


                const updatedJobApplicantEntity: JobApplicantEntity = JobApplicantMapper.toEntity(
                    jobApplicantData,
                    true,
                    resData
                );

                const updatedJobApplicant: Either<ErrorClass, JobApplicantEntity> =
                    await this.updateJobApplicantUsecase.execute(
                        jobApplicantId,
                        updatedJobApplicantEntity
                    );

                updatedJobApplicant.cata(
                    (error: ErrorClass) => {
                        res.status(error.status).json({ error: error.message });
                    },
                    (response: JobApplicantEntity) => {
                        const responseData = JobApplicantMapper.toModel(response);

                        res.json(responseData);


                    }
                );
            }
        );
    }
}
