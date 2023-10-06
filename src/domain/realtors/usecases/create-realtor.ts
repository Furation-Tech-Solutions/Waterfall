import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateRealtorUsecase {
  execute: (realtorData: RealtorModel) => Promise<Either<ErrorClass, RealtorEntity>>;
}

export class CreateRealtor implements CreateRealtorUsecase {
  private readonly RealtorRepository: RealtorRepository;

  constructor(RealtorRepository: RealtorRepository) {
    this.RealtorRepository = RealtorRepository;
  }

  async execute(realtorData: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    return await this.RealtorRepository.createRealtor(realtorData);
  }
}