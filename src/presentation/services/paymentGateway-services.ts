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
import { CheckBalanceUsecase } from "@domain/paymentGateway/usecases/checkBalance";
import { CreateConnectAccountUsecase } from "@domain/paymentGateway/usecases/createConnectAccount";
import { DashboardUsecase } from "@domain/paymentGateway/usecases/dashboard";
import { DeleteAccountUsecase } from "@domain/paymentGateway/usecases/deleteAccount";
import { GenerateAccountLinkUsecase } from "@domain/paymentGateway/usecases/generateAccountLink";
import { ProcessPaymentUsecase } from "@domain/paymentGateway/usecases/processPayment";
import { RetrieveAccountUsecase } from "@domain/paymentGateway/usecases/retrieveAccount";
import { TransactionsUsecase } from "@domain/paymentGateway/usecases/transactions";
import { UpdateAccountUsecase } from "@domain/paymentGateway/usecases/updateAccount";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class PaymentGatewayService {
  private readonly createPaymentGatewayUsecase: CreatePaymentGatewayUsecase;
  private readonly deletePaymentGatewayUsecase: DeletePaymentGatewayUsecase;
  private readonly getPaymentGatewayByIdUsecase: GetPaymentGatewayByIdUsecase;
  private readonly updatePaymentGatewayUsecase: UpdatePaymentGatewayUsecase;
  private readonly getAllPaymentGatewaysUsecase: GetAllPaymentGatewaysUsecase;
  private readonly checkBalanceUsecase: CheckBalanceUsecase;
  private readonly createConnectAccountUsecase: CreateConnectAccountUsecase;
  private readonly dashboardUsecase: DashboardUsecase;
  private readonly deleteAccountUsecase: DeleteAccountUsecase;
  private readonly generateAccountLinkUsecase: GenerateAccountLinkUsecase;
  private readonly processPaymentUsecase: ProcessPaymentUsecase;
  private readonly retrieveAccountUsecase: RetrieveAccountUsecase;
  private readonly transactionsUsecase: TransactionsUsecase;
  private readonly updateAccountUsecase: UpdateAccountUsecase;



  constructor(
    createPaymentGatewayUsecase: CreatePaymentGatewayUsecase,
    deletePaymentGatewayUsecase: DeletePaymentGatewayUsecase,
    getPaymentGatewayByIdUsecase: GetPaymentGatewayByIdUsecase,
    updatePaymentGatewayUsecase: UpdatePaymentGatewayUsecase,
    getAllPaymentGatewaysUsecase: GetAllPaymentGatewaysUsecase,
    checkBalanceUsecase: CheckBalanceUsecase,
    createConnectAccountUsecase: CreateConnectAccountUsecase,
    dashboardUsecase: DashboardUsecase,
    deleteAccountUsecase: DeleteAccountUsecase,
    generateAccountLinkUsecase: GenerateAccountLinkUsecase,
    processPaymentUsecase: ProcessPaymentUsecase,
    retrieveAccountUsecase: RetrieveAccountUsecase,
    transactionsUsecase: TransactionsUsecase,
    updateAccountUsecase: UpdateAccountUsecase

  ) {
    this.createPaymentGatewayUsecase = createPaymentGatewayUsecase;
    this.deletePaymentGatewayUsecase = deletePaymentGatewayUsecase;
    this.getPaymentGatewayByIdUsecase = getPaymentGatewayByIdUsecase;
    this.updatePaymentGatewayUsecase = updatePaymentGatewayUsecase;
    this.getAllPaymentGatewaysUsecase = getAllPaymentGatewaysUsecase;
    this.checkBalanceUsecase = checkBalanceUsecase;
    this.createConnectAccountUsecase = createConnectAccountUsecase;
    this.dashboardUsecase = dashboardUsecase;
    this.deleteAccountUsecase = deleteAccountUsecase;
    this.generateAccountLinkUsecase = generateAccountLinkUsecase;
    this.processPaymentUsecase = processPaymentUsecase;
    this.retrieveAccountUsecase = retrieveAccountUsecase;
    this.transactionsUsecase = transactionsUsecase;
    this.updateAccountUsecase = updateAccountUsecase;

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
    const paymentGatewayData: PaymentGatewayModel =
      PaymentGatewayMapper.toModel(req.body);

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
      (error: ErrorClass) => {
        if (error.message === "not found") {
          // Send success response with status code 200
          this.sendSuccessResponse(res, [], "PaymentGateway not found", 200);
        } else {
          this.sendErrorResponse(res, error, 404);
        }
      },
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

        const updatedPaymentGatewayEntity: PaymentGatewayEntity =
          PaymentGatewayMapper.toEntity(paymentGatewayData, true, resData);

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
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    );
  }

  async checkBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const check: Either<ErrorClass, any> =
      await this.checkBalanceUsecase.execute(id);

    check.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }

  async createConnectAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data: any = req.body;
    const id: string = req.user;
    console.log(id);
    const create: Either<ErrorClass, any> =
      await this.createConnectAccountUsecase.execute(id, data);

    create.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }

    )
  }

  async dashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const dashboard: Either<ErrorClass, any> =
      await this.dashboardUsecase.execute(id);

    dashboard.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }

  async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const deleteAccount: Either<ErrorClass, any> =
      await this.deleteAccountUsecase.execute(id);

    deleteAccount.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )

  }

  async generateAccountLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const generateAccountLink: Either<ErrorClass, any> =
      await this.generateAccountLinkUsecase.execute(id);

    generateAccountLink.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }

  async processPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const processPayment: Either<ErrorClass, any> =
      await this.processPaymentUsecase.execute(id, data);

    processPayment.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  } // processPayment

  async retrieveAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const retrieveAccount: Either<ErrorClass, any> =
      await this.retrieveAccountUsecase.execute(id);

    retrieveAccount.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }

  async transactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const transactions: Either<ErrorClass, any> =
      await this.transactionsUsecase.execute(id);

    transactions.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }

  async updateAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.user;
    const data: any = req.body;
    const updateAccount: Either<ErrorClass, any> =
      await this.updateAccountUsecase.execute(id, data);

    updateAccount.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: any) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const resData = result.map((paymentGateway: any) =>
            PaymentGatewayMapper.toEntity(paymentGateway)
          );
          this.sendSuccessResponse(res, resData);
        }
      }
    )
  }
}
