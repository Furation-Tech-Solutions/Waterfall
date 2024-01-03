// Import necessary dependencies and modules
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway";
import { PaymentGatewayRepository } from "@domain/paymentGateway/repositories/paymentGateway-repository";
import { PaymentGatewayDataSource, Query } from "@data/paymentGateway/datasources/paymentGateway-data-sources";
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
  async getPaymentGateways(id: string): Promise<Either<ErrorClass, PaymentGatewayEntity[]>> {
    try {
      // Retrieve all paymentGateways using the "dataSource" and return them as Right
      const response = await this.dataSource.getAll(id);
      // Check if the data length is zero
      if (response.length === 0) {
        // If data length is zero, send a success response with status code 200
        return Right<ErrorClass, PaymentGatewayEntity[]>([]);
      }

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

  async createConnectAccount(loginId: string, data: any): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.createAccount(loginId, data);

      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.name === "applicant_conflict") {
        return Left<ErrorClass, any>(ApiError.applicantExist());
      }
      return Left<ErrorClass, any>(
        ApiError.customError(400, error.message)
      );
    }
  }

  async retrieveAccount(loginId: string,): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.retrieveAcc(loginId);

      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.name === "data not found") {
        return Left<ErrorClass, any>(ApiError.dataNotFound());
      }
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));


    }
  }

  async updateAccount(loginId: string, data: any): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.updateAcc(loginId, data);

      return Right<ErrorClass, any>(response);

    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));

    }

  }

  async deleteAccount(loginId: string): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.deleteAcc(loginId);

      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async generateAccountLink(loginId: string, query: Query): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.generateAccLink(loginId, query);
      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async processPayment(loginId: string, data: any): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.prosPayment(loginId, data);
      return Right<ErrorClass, any>(response);

    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async dashboard(loginId: string): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.dash(loginId);
      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async checkBalance(loginId: string): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.cBalance(loginId);
      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async transactions(loginId: string): Promise<Either<ErrorClass, any>> {
    try {
      const response = await this.dataSource.trans(loginId);
      return Right<ErrorClass, any>(response);
    } catch (error: any) {
      return Left<ErrorClass, any>(ApiError.customError(HttpStatus.BAD_REQUEST, error.message));
    }
  }


}
