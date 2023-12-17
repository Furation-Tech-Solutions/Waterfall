// Import necessary dependencies and types
import { NextFunction, Request, Response } from "express";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import {
  ConnectionsEntity,
  ConnectionMapper,
  ConnectionsModel,
} from "@domain/connections/entities/connections_entities"; // Import Connections-related entities and mapper

import { CreateRequestUsecase } from "@domain/connections/usecases/create_request"; // Import Connections-related use cases
import { DeleteRequestUsecase } from "@domain/connections/usecases/delete_Request";
import { GetByIdUsecase } from "@domain/connections/usecases/get_by_id";
import { UpdateRequestUsecase } from "@domain/connections/usecases/update_Request";
import { GetAllUsecase } from "@domain/connections/usecases/get_all";
import { Either } from "monet";

// Define a class for handling Connections-related services
export class ConnectionsServices {
  private readonly createRequestUsecase: CreateRequestUsecase;
  private readonly deleteRequestUsecase: DeleteRequestUsecase;
  private readonly getByIdUsecase: GetByIdUsecase;
  private readonly getAllUsecase: GetAllUsecase;
  private readonly updateRequestUsecase: UpdateRequestUsecase;

  constructor(
    createRequestUsecase: CreateRequestUsecase,
    deleteRequestUsecase: DeleteRequestUsecase,
    getByIdUsecase: GetByIdUsecase,
    getAllUsecase: GetAllUsecase,
    updateRequestUsecase: UpdateRequestUsecase
  ) {
    this.createRequestUsecase = createRequestUsecase;
    this.deleteRequestUsecase = deleteRequestUsecase;
    this.getByIdUsecase = getByIdUsecase;
    this.getAllUsecase = getAllUsecase;
    this.updateRequestUsecase = updateRequestUsecase;
  }

  // Helper method to send success response
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

  // Helper method to send error response
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

  // Handler for creating new connections
  async createRequest(req: Request, res: Response): Promise<void> {
    const Data: ConnectionsModel = ConnectionMapper.toModel(req.body);

    const newConnections: Either<ErrorClass, ConnectionsEntity> =
      await this.createRequestUsecase.execute(Data);

    newConnections.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400), // Bad Request
      (result: ConnectionsEntity) => {
        const resData = ConnectionMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Connection created successfully",
          201
        );
      }
    );
  }

  // Handler for deleting connections by ID
  async deleteRequest(req: Request, res: Response): Promise<void> {
    let id = req.params.id;

    const deletedConnections: Either<ErrorClass, void> =
      await this.deleteRequestUsecase.execute(id);

    deletedConnections.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Connection deleted successfully",
          204
        ); // No Content
      }
    );
  }

  // Handler for getting connections by ID
  async getById(req: Request, res: Response): Promise<void> {
    let loginId = req.body.fromId;
    let id = req.params.id;

    const connections: Either<ErrorClass, ConnectionsEntity> =
      await this.getByIdUsecase.execute(id);

    connections.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      (result: ConnectionsEntity) => {
        if (!result) {
          this.sendErrorResponse(res, new ApiError(400, " not found"));
        } else {
          const resData = ConnectionMapper.toEntity(result);
          this.sendSuccessResponse(
            res,
            resData,
            "Connection retrieved successfully"
          );
        }
      }
    );
  }

  // Handler for getting all connections
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        let toId = req.headers.toid;
        let loginId = req.headers.fromid as string;


    const query: any = {};

    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.toId = toId;

    const clientConnections: Either<ErrorClass, any[]> =
      await this.getAllUsecase.execute(loginId, query);

    clientConnections.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Internal Server Error
      (result: ConnectionsEntity[]) => {
        // console.log(result, "clientConnections");
        // const responseData = result.map((connection) =>
        //   ConnectionMapper.toEntity(connection)
        // );
        this.sendSuccessResponse(
          res,
          result,
          "Connections retrieved successfully"
        );
      }
    );
  }

  // Handler for updating connections by ID
  async updateRequests(req: Request, res: Response): Promise<void> {
    const Data: ConnectionsModel = req.body;
    let loginId = req.body.fromId;
    let id = req.params.id;

    const existingConnections: Either<ErrorClass, ConnectionsEntity> =
      await this.getByIdUsecase.execute(id);

    existingConnections.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      async (existingData: ConnectionsEntity) => {
        const resData = ConnectionMapper.toEntity(existingData, true);

        const updatedConnectionsEntity: ConnectionsEntity =
          ConnectionMapper.toEntity(Data, true, resData);

        const updatedConnections: Either<ErrorClass, ConnectionsEntity> =
          await this.updateRequestUsecase.execute(
            id,
            updatedConnectionsEntity
          );

        updatedConnections.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (result: ConnectionsEntity) => {
            const resData = ConnectionMapper.toEntity(result, true);
            this.sendSuccessResponse(
              res,
              resData,
              "Connection updated successfully"
            );
          }
        );
      }
    );
  }
}
