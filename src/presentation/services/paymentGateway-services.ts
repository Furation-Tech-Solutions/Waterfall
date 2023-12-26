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

export class PaymentGatewayService {
  private readonly createPaymentGatewayUsecase: CreatePaymentGatewayUsecase;
  private readonly deletePaymentGatewayUsecase: DeletePaymentGatewayUsecase;
  private readonly getPaymentGatewayByIdUsecase: GetPaymentGatewayByIdUsecase;
  private readonly updatePaymentGatewayUsecase: UpdatePaymentGatewayUsecase;
  private readonly getAllPaymentGatewaysUsecase: GetAllPaymentGatewaysUsecase;

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

  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  async createPaymentGateway(req: Request, res: Response): Promise<void> {
    const paymentGatewayData: PaymentGatewayModel = PaymentGatewayMapper.toModel(
      req.body
    );

    const newPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.createPaymentGatewayUsecase.execute(paymentGatewayData);

    newPaymentGateway.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "PaymentGateway data created successfully",
          201
        );
      }
    );
  }

  async deletePaymentGateway(req: Request, res: Response): Promise<void> {
    const paymentGatewayId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deletePaymentGatewayUsecase.execute(paymentGatewayId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "PaymentGateway data deleted successfully",
          204
        );
      }
    );
  }

  async getPaymentGatewayById(req: Request, res: Response): Promise<void> {
    const paymentGatewayId: string = req.params.id;

    const paymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.getPaymentGatewayByIdUsecase.execute(paymentGatewayId);

    paymentGateway.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "PaymentGateway data retrieved successfully"
        );
      }
    );
  }

  async updatePaymentGateway(req: Request, res: Response): Promise<void> {
    const paymentGatewayId: string = req.params.id;
    const paymentGatewayData: PaymentGatewayModel = req.body;

    const existingPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
      await this.getPaymentGatewayByIdUsecase.execute(paymentGatewayId);

    existingPaymentGateway.cata(
      (error: ErrorClass) => {
        this.sendErrorResponse(res, error, 404);
      },
      async (result: PaymentGatewayEntity) => {
        const resData = PaymentGatewayMapper.toEntity(result, true);

        const updatedPaymentGatewayEntity: PaymentGatewayEntity = PaymentGatewayMapper.toEntity(
          paymentGatewayData,
          true,
          resData
        );

        const updatedPaymentGateway: Either<ErrorClass, PaymentGatewayEntity> =
          await this.updatePaymentGatewayUsecase.execute(
            paymentGatewayId,
            updatedPaymentGatewayEntity
          );

        updatedPaymentGateway.cata(
          (error: ErrorClass) => {
            this.sendErrorResponse(res, error, 500);
          },
          (response: PaymentGatewayEntity) => {
            const responseData = PaymentGatewayMapper.toModel(response);
            this.sendSuccessResponse(
              res,
              responseData,
              "PaymentGateway data updated successfully"
            );
          }
        );
      }
    );
  }

  async getAllPaymentGateways(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paymentGateways: Either<ErrorClass, PaymentGatewayEntity[]> =
      await this.getAllPaymentGatewaysUsecase.execute();

    paymentGateways.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: PaymentGatewayEntity[]) => {
        const resData = result.map((paymentGateway: any) =>
          PaymentGatewayMapper.toEntity(paymentGateway)
        );
        this.sendSuccessResponse(res, resData);
      }
    );
  }
}
