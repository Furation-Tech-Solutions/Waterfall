// Import necessary dependencies and modules
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway"; // Import PaymentGatewayEntity and PaymentGatewayModel from a specific location
import { Either } from "monet"; // Import the Either type from the Monet library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the specified location

// Define an interface for the PaymentGatewayRepository
export interface PaymentGatewayRepository {
  // Define a method to create a new paymentGateway entry
  createPaymentGateway(
    paymentGateway: PaymentGatewayModel
  ): Promise<Either<ErrorClass, PaymentGatewayEntity>>;

  // Define a method to delete a paymentGateway entry by its ID
  deletePaymentGateway(id: string): Promise<Either<ErrorClass, void>>;

  // Define a method to update a paymentGateway entry by its ID and data
  updatePaymentGateway(
    id: string,
    data: PaymentGatewayModel
  ): Promise<Either<ErrorClass, PaymentGatewayEntity>>;

  // Define a method to get all paymentGateway entries
  getPaymentGateways(): Promise<Either<ErrorClass, PaymentGatewayEntity[]>>;

  // Define a method to get a paymentGateway entry by its ID
  getPaymentGatewayById(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity>>;
}
