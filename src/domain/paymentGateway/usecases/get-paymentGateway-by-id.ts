// Import necessary modules and classes
import { PaymentGatewayEntity } from "@domain/paymentGateway/entities/paymentGateway"; // Import PaymentGatewayEntity class for type usage
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository"; // Import PaymentGatewayRepository interface for dependency injection
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass for error handling
import { Either } from "monet"; // Import Either class for handling either success or error result

// Define an interface for the "GetPaymentGatewayById" use case
export interface GetPaymentGatewayByIdUsecase {
  execute: (paymentGatewayId: string) => Promise<Either<ErrorClass, PaymentGatewayEntity>>;
}

// Implement the "GetPaymentGatewayById" class that implements the use case interface
export class GetPaymentGatewayById implements GetPaymentGatewayByIdUsecase {
  // Private property to store the PaymentGatewayRepository instance
  private readonly paymentGatewayRepository: PaymentGatewayRepository;

  // Constructor to inject the PaymentGatewayRepository dependency
  constructor(paymentGatewayRepository: PaymentGatewayRepository) {
    this.paymentGatewayRepository = paymentGatewayRepository;
  }

  // Implementation of the "execute" method from the interface
  async execute(paymentGatewayId: string): Promise<Either<ErrorClass, PaymentGatewayEntity>> {
    // Call the "getPaymentGatewayById" method of the injected repository to fetch paymentGateway data
    return await this.paymentGatewayRepository.getPaymentGatewayById(paymentGatewayId);
  }
}
