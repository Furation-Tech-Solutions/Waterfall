// Import necessary modules and classes
import { PaymentGatewayEntity } from "@domain/paymentGateway/entities/paymentGateway"; // Import PaymentGatewayEntity from the paymentGateway module
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository"; // Import PaymentGatewayRepository from the paymentGateway module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either type from the Monet library

// Define an interface for the GetAllPaymentGateways use case
export interface GetAllPaymentGatewaysUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, PaymentGatewayEntity[]>>; // A method 'execute' that returns a Promise of Either<ErrorClass, PaymentGatewayEntity[]>
}

// Implement the GetAllPaymentGatewaysUsecase interface
export class GetAllPaymentGateways implements GetAllPaymentGatewaysUsecase {
  private readonly paymentGatewayRepository: PaymentGatewayRepository; // Private property to store a PaymentGatewayRepository instance

  // Constructor to initialize the GetAllPaymentGateways class with a PaymentGatewayRepository instance
  constructor(paymentGatewayRepository: PaymentGatewayRepository) {
    this.paymentGatewayRepository = paymentGatewayRepository;
  }

  // Implementation of the 'execute' method defined in the interface
  async execute(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity[]>> {
    // Call the 'getPaymentGateways' method from the paymentGateway repository and return the result
    return await this.paymentGatewayRepository.getPaymentGateways(id);
  }
}
