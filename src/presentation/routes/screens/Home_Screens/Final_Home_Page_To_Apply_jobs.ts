import { RealtorEntity, RealtorMapper } from "@domain/realtors/entities/realtors";
import { GetRealtorById } from "@domain/realtors/usecases/get-realtor-by-id";
import { GetRealtorByIdUsecase } from "@domain/realtors/usecases/get-realtor-by-id";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { NextFunction, Request, Response } from "express";
// import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Sequelize, Op } from "sequelize";
// import { RealtorDataSourceImpl } from '@data/realtors/datasources/realtor-data-source';

// const realtorDataSourceImpl = new RealtorDataSourceImpl(Sequelize);

export class RealtorService {
    private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;
    constructor(
        GetRealtorByIdUsecase: GetRealtorByIdUsecase,
    ) {
        this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
    }

    async getRealtorById(req: Request, res: Response): Promise<void> {
        const realtorId: string = req.params.id;

        const realtor: Either<ErrorClass, RealtorEntity> =
            await this.GetRealtorByIdUsecase.execute(realtorId);

        realtor.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: RealtorEntity) => {
                if (!result) {
                    return res.json({ message: "Realtor Name not found." });
                }
                const resData = RealtorMapper.toEntity(result);
                return res.json(resData);
            }
        );
    }
}