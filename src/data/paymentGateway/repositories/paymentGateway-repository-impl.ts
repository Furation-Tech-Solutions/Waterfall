// Import necessary dependencies and modules
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway";
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository";
import { PaymentGatewayDataSource } from "@data/paymentGateway/datasources/paymentGateway-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Implement the PaymentGatewayRepository interface with PaymentGatewayRepositoryImpl class
export class PaymentGatewayRepositoryImpl implements PaymentGatewayRepository {
  // Define a private member "dataSource" of type PaymentGatewayDataSource
  private readonly dataSource: PaymentGatewayDataSource;

  // Constructor that accepts a "dataSource" parameter and sets it as a member
  constructor(dataSource: PaymentGatewayDataSource) {
    this.dataSource = dataSource;
  }

  // Implement the "createPaymentGateway" method defined in the PaymentGatewayRepository interface
  async createPaymentGateway(
    paymentGateway: PaymentGatewayModel
  ): Promise<Either<ErrorClass, PaymentGatewayEntity>> {
    try {
      // Create a new paymentGateway entity using the "dataSource" and return it as a Right Either
      const i = await this.dataSource.create(paymentGateway);
      return Right<ErrorClass, PaymentGatewayEntity>(i);
    } catch (error: any) {
      console.log(error);

      // Handle error cases:
      // If the error is an unauthorized ApiError with a status code of 401, return it as Left
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, PaymentGatewayEntity>(ApiError.unAuthorized());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, PaymentGatewayEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deletePaymentGateway" method defined in the PaymentGatewayRepository interface
  async deletePaymentGateway(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the paymentGateway with the given ID using the "dataSource" and return success as Right
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Implement the "updatePaymentGateway" method defined in the PaymentGatewayRepository interface
  async updatePaymentGateway(
    id: string,
    data: PaymentGatewayModel
  ): Promise<Either<ErrorClass, PaymentGatewayEntity>> {
    try {
      // Update the paymentGateway with the given ID and data using the "dataSource" and return the updated paymentGateway as Right
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, PaymentGatewayEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, PaymentGatewayEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getPaymentGateways" method defined in the PaymentGatewayRepository interface
  async getPaymentGateways(): Promise<Either<ErrorClass, PaymentGatewayEntity[]>> {
    try {
      // Retrieve all paymentGateways using the "dataSource" and return them as Right
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, PaymentGatewayEntity[]>(response);
    } catch (error: any) {
      // Handle error cases:
      // If the error is a not-found ApiError with a status code of 404, return it as Left
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, PaymentGatewayEntity[]>(ApiError.notFound());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, PaymentGatewayEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getPaymentGatewayById" method defined in the PaymentGatewayRepository interface
  async getPaymentGatewayById(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity>> {
    try {
      // Retrieve the paymentGateway with the given ID using the "dataSource"
      const response = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (response === null) {
        return Left<ErrorClass, PaymentGatewayEntity>(ApiError.notFound());
      }

      // Otherwise, return the paymentGateway as Right
      return Right<ErrorClass, PaymentGatewayEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, PaymentGatewayEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
