// Import necessary dependencies and modules
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway"; // Import PaymentGatewayEntity and PaymentGatewayModel from a specific location
import { Either } from "monet"; // Import the Either type from the Monet library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the specified location
import { Query } from "@data/paymentGateway/datasources/paymentGateway-data-sources";

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
  getPaymentGateways(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity[]>>;

  // Define a method to get a paymentGateway entry by its ID
  getPaymentGatewayById(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity>>;


  // Define a method to create a Connect Express account
  createConnectAccount(loginId: string, data: any): Promise<Either<ErrorClass, any>>;

  //define a method to retrieve accounts
  retrieveAccount(loginId: string,): Promise<Either<ErrorClass, any>>;

  //define a method to update accounts
  updateAccount(loginId: string, data: any): Promise<Either<ErrorClass, any>>;

  // Define a method to delete a Connect Express account
  deleteAccount(loginId: string): Promise<Either<ErrorClass, any>>;

  // Define a method to generate an account link
  generateAccountLink(loginId: string, query: Query): Promise<Either<ErrorClass, any>>;

  // Define a method to process payment
  processPayment(loginId: string, data: any): Promise<Either<ErrorClass, any>>;

  // Define a method to get dashboard
  dashboard(loginId: string): Promise<Either<ErrorClass, any>>;

  // Define a method to check balance
  checkBalance(loginId: string): Promise<Either<ErrorClass, any>>;

  // Define a method to get transactions
  transactions(loginId: string): Promise<Either<ErrorClass, any>>;


}
