// Import necessary modules and types from external dependencies
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway"; // Import PaymentGatewayEntity and PaymentGatewayModel from the paymentGateway module
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository"; // Import PaymentGatewayRepository from the paymentGateway repository module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either type from the 'monet' library

// Define an interface for the CreatePaymentGateway use case
export interface DashboardUsecase {
  execute: (
    loginId: string
  ) => Promise<Either<ErrorClass, any>>;
}

// Implement the CreatePaymentGatewayUsecase interface with the CreatePaymentGateway class
export class Dashboard implements DashboardUsecase {
  private readonly paymentGatewayRepository: PaymentGatewayRepository;

  // Constructor for the CreatePaymentGateway class, taking a PaymentGatewayRepository instance as a parameter
  constructor(paymentGatewayRepository: PaymentGatewayRepository) {
    this.paymentGatewayRepository = paymentGatewayRepository; // Assign the provided PaymentGatewayRepository to the instance variable
  }

  // Implementation of the 'execute' method defined in the CreatePaymentGatewayUsecase interface  async execute(
  async execute(
    loginId: string
  ): Promise<Either<ErrorClass, any>> {
    return await this.paymentGatewayRepository.dashboard(loginId); // Call the 'createPaymentGateway' method of the PaymentGatewayRepository and return the result
  }
}
