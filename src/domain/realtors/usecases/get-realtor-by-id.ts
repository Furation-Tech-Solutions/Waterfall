import { RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetRealtorByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, RealtorEntity>>;
}

export class GetRealtorById implements GetRealtorByIdUsecase {
  private readonly realtorRepository:RealtorRepository;

  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, RealtorEntity>> {
    return await this.realtorRepository.getRealtorById(id);
  }
}