import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { RealtorEntity } from "../entities/realtors";
import { RealtorRepository } from "../repositories/realtor-repository";

export interface LoginRealtorUsecase {
  execute: (email: string, firebaseDeviceToken: string) => Promise<Either<ErrorClass, RealtorEntity>>;
}

export class LoginRealtor implements LoginRealtorUsecase {
  private readonly realtorRepository: RealtorRepository; // Change to BookingRequestRepository

  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }
  async execute(realtor_email: string, firebaseDeviceToken: string): Promise<Either<ErrorClass, RealtorEntity>> {
    return await this.realtorRepository.loginRealtor(realtor_email, firebaseDeviceToken); // Change to getBookingRequestById

  }
}