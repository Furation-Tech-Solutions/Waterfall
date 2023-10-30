// Import necessary modules and classes
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository"; // Importing PaymentGatewayRepository from a specific location
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing ErrorClass from a specific location
import { Either } from "monet"; // Importing Either from the Monet library

// Define an interface for the DeletePaymentGateway use case
export interface DeletePaymentGatewayUsecase {
  // Define a method 'execute' that takes a 'paymentGatewayId' parameter and returns a Promise of 'Either' containing 'ErrorClass' or 'void'
  execute: (paymentGatewayId: string) => Promise<Either<ErrorClass, void>>;
}

// Define a class called 'DeletePaymentGateway' that implements the 'DeletePaymentGatewayUsecase' interface
export class DeletePaymentGateway implements DeletePaymentGatewayUsecase {
  // Declare a private member 'paymentGatewayRepository' of type 'PaymentGatewayRepository'
  private readonly paymentGatewayRepository: PaymentGatewayRepository;

  // Constructor for the 'DeletePaymentGateway' class that takes a 'paymentGatewayRepository' parameter
  constructor(paymentGatewayRepository: PaymentGatewayRepository) {
    // Initialize the 'paymentGatewayRepository' member with the provided parameter
    this.paymentGatewayRepository = paymentGatewayRepository;
  }

  // Implementation of the 'execute' method defined in the 'DeletePaymentGatewayUsecase' interface
  async execute(paymentGatewayId: string): Promise<Either<ErrorClass, void>> {
    // Call the 'deletePaymentGateway' method from the 'paymentGatewayRepository' and return its result as a Promise
    return await this.paymentGatewayRepository.deletePaymentGateway(paymentGatewayId);
  }
}
