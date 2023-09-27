import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface UpdateRealtorUsecase {
  execute: (
    realtorId: string,
    realtorData: RealtorModel
  ) => Promise<Either<ErrorClass, RealtorEntity>>;
}

export class UpdateRealtor implements UpdateRealtorUsecase {
  private readonly realtorRepository: RealtorRepository;

  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  async execute(realtorId: string, realtorData: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    return await this.realtorRepository.updateRealtor(realtorId, realtorData);
  }
}
