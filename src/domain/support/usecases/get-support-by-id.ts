import { SupportEntity } from "@domain/support/entities/support";
import { SupportRepository } from "@domain/support/repositories/support-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetSupportByIdUsecase {
  execute: (supportId: string) => Promise<Either<ErrorClass, SupportEntity>>;
}

export class GetSupportById implements GetSupportByIdUsecase {
  private readonly supportRepository: SupportRepository;

  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  async execute(supportId: string): Promise<Either<ErrorClass, SupportEntity>> {
    return await this.supportRepository.getSupportById(supportId);
  }
}
