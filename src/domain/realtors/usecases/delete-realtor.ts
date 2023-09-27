import { type RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";
export interface DeleteRealtorUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteRealtor implements DeleteRealtorUsecase {
  private readonly realtorRepository: RealtorRepository;

  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    return await this.realtorRepository.deleteRealtor(id);
  }
}
