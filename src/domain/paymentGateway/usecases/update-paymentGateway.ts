// Import necessary dependencies and modules
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway";
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the "UpdatePaymentGateway" use case
export interface UpdatePaymentGatewayUsecase {
  // Define a method "execute" that takes a paymentGatewayId (string) and paymentGatewayData (PaymentGatewayModel)
  // It returns a Promise that resolves to an Either type with an ErrorClass or a PaymentGatewayEntity
  execute: (
    paymentGatewayId: string,
    paymentGatewayData: PaymentGatewayModel
  ) => Promise<Either<ErrorClass, PaymentGatewayEntity>>;
}

// Implement the "UpdatePaymentGateway" use case by creating a class that implements the interface
export class UpdatePaymentGateway implements UpdatePaymentGatewayUsecase {
  // Define a private member "paymentGatewayRepository" of type PaymentGatewayRepository
  private readonly paymentGatewayRepository: PaymentGatewayRepository;

  // Constructor that accepts a "paymentGatewayRepository" parameter and sets it as a member
  constructor(paymentGatewayRepository: PaymentGatewayRepository) {
    this.paymentGatewayRepository = paymentGatewayRepository;
  }

  // Implement the "execute" method defined in the interface
  async execute(
    paymentGatewayId: string,
    paymentGatewayData: PaymentGatewayModel
  ): Promise<Either<ErrorClass, PaymentGatewayEntity>> {
    // Call the "updatePaymentGateway" method from the "paymentGatewayRepository" with the provided parameters
    // and return the result as a Promise
    return await this.paymentGatewayRepository.updatePaymentGateway(paymentGatewayId, paymentGatewayData);
  }
}
