import { NextFunction, Request, Response } from "express";
import {
  PaymentGatewayEntity,
  PaymentGatewayModel,
  PaymentGatewayMapper,
} from "@domain/paymentGateway/entities/paymentGateway";
import { CreatePaymentGatewayUsecase } from "@domain/paymentGateway/usecases/create-paymentGateway";
import { DeletePaymentGatewayUsecase } from "@domain/paymentGateway/usecases/delete-paymentGateway";
import { GetPaymentGatewayByIdUsecase } from "@domain/paymentGateway/usecases/get-paymentGateway-by-id";
import { UpdatePaymentGatewayUsecase } from "@domain/paymentGateway/usecases/update-paymentGateway";
import { GetAllPaymentGatewaysUsecase } from "@domain/paymentGateway/usecases/get-all-paymentGateway";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Create a class for the PaymentGatewayService
export class PaymentGatewayService {
  private readonly createPaymentGatewayUsecase: CreatePaymentGatewayUsecase;
  private readonly deletePaymentGatewayUsecase: DeletePaymentGatewayUsecase;
  private readonly getPaymentGatewayByIdUsecase: GetPaymentGatewayByIdUsecase;
  private readonly updatePaymentGatewayUsecase: UpdatePaymentGatewayUsecase;
  private readonly getAllPaymentGatewaysUsecase: GetAllPaymentGatewaysUsecase;

  // Constructor to initialize dependencies
  constructor(
    createPaymentGatewayUsecase: CreatePaymentGatewayUsecase,
    deletePaymentGatewayUsecase: DeletePaymentGatewayUsecase,
    getPaymentGatewayByIdUsecase: GetPaymentGatewayByIdUsecase,
    updatePaymentGatewayUsecase: UpdatePaymentGatewayUsecase,
    getAllPaymentGatewaysUsecase: GetAllPaymentGatewaysUsecase
  ) {
    this.createPaymentGatewayUsecase = createPaymentGatewayUsecase;
    this.deletePaymentGatewayUsecase = deletePaymentGatewayUsecase;
    this.getPaymentGatewayByIdUsecase = getPaymentGatewayByIdUsecase;
    this.updatePaymentGatewayUsecase = updatePaymentGatewayUsecase;
    this.getAllPaymentGatewaysUsecase = getAllPaymentGatewaysUsecase;
  }

  // Function to create a new paymentGateway
  async createPaymentGateway(req: Request, res: Response): Promise<void> {
    // Extract paymentGateway data from the request body
    const paymentGatewayData: PaymentGatewayModel = PaymentGatewayMapper.toModel(req.body);

    // Execute the createPaymentGatewayUsecase and handle the result using Either
    const newPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.createPaymentGatewayUsecase.execute(paymentGatewayData);

    // Handle the result and send a JSON response
    newPaymentGateway.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to delete a paymentGateway
  async deletePaymentGateway(req: Request, res: Response): Promise<void> {
    // Extract paymentGateway ID from the request parameters
    const paymentGatewayId: string = req.params.id;

    // Execute the deletePaymentGatewayUsecase and handle the result using Either
    const response: Either<ErrorClass, void> =
      await this.deletePaymentGatewayUsecase.execute(paymentGatewayId);

    // Handle the result and send a JSON response
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "PaymentGateway deleted successfully." });
      }
    );
  }

  // Function to get a paymentGateway by ID
  async getPaymentGatewayById(req: Request, res: Response): Promise<void> {
    // Extract paymentGateway ID from the request parameters
    const paymentGatewayId: string = req.params.id;

    // Execute the getPaymentGatewayByIdUsecase and handle the result using Either
    const paymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.getPaymentGatewayByIdUsecase.execute(paymentGatewayId);

    // Handle the result and send a JSON response
    paymentGateway.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to update a paymentGateway
  async updatePaymentGateway(req: Request, res: Response): Promise<void> {
    // Extract paymentGateway ID from the request parameters
    const paymentGatewayId: string = req.params.id;
    // Extract paymentGateway data from the request body
    const paymentGatewayData: PaymentGatewayModel = req.body;

    // Execute the getPaymentGatewayByIdUsecase to fetch the existing paymentGateway
    const existingPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.getPaymentGatewayByIdUsecase.execute(paymentGatewayId);

    // Handle the result of fetching the existing paymentGateway
    existingPaymentGateway.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);

        // Map the updated paymentGateway data to an entity
        const updatedPaymentGatewayEntity: PaymentGatewayEntity = PaymentGatewayMapper.toEntity(
          paymentGatewayData,
          true,
          resData
        );

        // Execute the updatePaymentGatewayUsecase and handle the result using Either
        const updatedPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
          await this.updatePaymentGatewayUsecase.execute(
            paymentGatewayId,
            updatedPaymentGatewayEntity
          );

        // Handle the result and send a JSON response
        updatedPaymentGateway.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: PaymentGatewayEntity) => {
            const responseData = PaymentGatewayMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  // Function to get all paymentGateways
  async getAllPaymentGateways(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllPaymentGatewaysUsecase and handle the result using Either
    const paymentGateways: Either<ErrorClass, PaymentGatewayEntity[]> =
      await this.getAllPaymentGatewaysUsecase.execute();

    // Handle the result and send a JSON response
    paymentGateways.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (paymentGateways: PaymentGatewayEntity[]) => {
        const resData = paymentGateways.map((paymentGateway: any) =>
          PaymentGatewayMapper.toEntity(paymentGateway)
        );
        return res.json(resData);
      }
    );
  }
}
