// Import necessary dependencies and types
import { NextFunction, Request, Response } from "express";
import { ErrorClass } from "@presentation/error-handling/api-error";
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
import { GetAllRequestsUsecase } from "@domain/connections/usecases/get_all_Requests";
import { GetAllConnectionsUsecase } from "@domain/connections/usecases/get_all_Connections";
import { Either } from "monet";

// Define a class for handling Connections-related services
export class ConnectionsServices {
    private readonly createRequestUsecase: CreateRequestUsecase;
    private readonly deleteRequestUsecase: DeleteRequestUsecase;
    private readonly getByIdUsecase: GetByIdUsecase;
    private readonly getAllUsecase: GetAllUsecase;
    private readonly updateRequestUsecase: UpdateRequestUsecase;
    private readonly getAllRequestsUsecase: GetAllRequestsUsecase;
    private readonly getAllConnectionsUsecase: GetAllConnectionsUsecase;

    constructor(
        createRequestUsecase: CreateRequestUsecase,
        deleteRequestUsecase: DeleteRequestUsecase,
        getByIdUsecase: GetByIdUsecase,
        getAllUsecase: GetAllUsecase,
        updateRequestUsecase: UpdateRequestUsecase,
        getAllRequestsUsecase: GetAllRequestsUsecase,
        getAllConnectionsUsecase: GetAllConnectionsUsecase
    ) {
        this.createRequestUsecase = createRequestUsecase;
        this.deleteRequestUsecase = deleteRequestUsecase;
        this.getByIdUsecase = getByIdUsecase;
        this.getAllUsecase = getAllUsecase;
        this.updateRequestUsecase = updateRequestUsecase;
        this.getAllRequestsUsecase = getAllRequestsUsecase;
        this.getAllConnectionsUsecase = getAllConnectionsUsecase;
    }

    // Handler for creating new connections
    async createRequest(req: Request, res: Response): Promise<void> {
        // Extract data from the request body and map it to the ConnectionsModel
        const Data: ConnectionsModel = ConnectionMapper.toModel(req.body);

        // Execute the createConnections use case to create a new connection
        const newConnections: Either<ErrorClass, ConnectionsEntity> =
            await this.createRequestUsecase.execute(Data);

        // Handle the result of the use case execution
        newConnections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: ConnectionsEntity) => {
                // Handle success case
                const resData = ConnectionMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }

    // Handler for deleting connections by ID
    async deleteRequest(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;

        // Execute the deleteConnections use case to delete a connection by ID
        const deletedConnections: Either<ErrorClass, void> =
            await this.deleteRequestUsecase.execute(id);

        // Handle the result of the use case execution
        deletedConnections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: void) => {
                // Handle success case
                return res.json({ message: "Connection deleted successfully." });
            }
        );
    }

    // Handler for getting connections by ID
    async getById(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;

        // Execute the getConnectionsById use case to retrieve a connection by ID
        const connections: Either<ErrorClass, ConnectionsEntity> =
            await this.getByIdUsecase.execute(id);

        // Handle the result of the use case execution
        connections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: ConnectionsEntity) => {
                // Handle success case
                if (!result) {
                    return res.json({ message: "Connection not found." });
                }
                const resData = ConnectionMapper.toEntity(result);
                return res.json(resData);
            }
        );
    }


    // Handler for getting all connections
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // Execute the getAllConnections use case to retrieve all connections
        const clientConnections: Either<ErrorClass, ConnectionsEntity[]> =
            await this.getAllUsecase.execute();

        // Handle the result of the use case execution
        clientConnections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: ConnectionsEntity[]) => {
                // Handle success case
                const responseData = result.map((connection) =>
                    ConnectionMapper.toEntity(connection)
                );
                return res.json(responseData);
            }
        );
    }

    // Handler for getting all connections
    async AllRequests(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // Execute the getAllConnections use case to retrieve all connections
        const clientConnections: Either<ErrorClass, ConnectionsEntity[]> =
            await this.getAllRequestsUsecase.execute();

        // Handle the result of the use case execution
        clientConnections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: ConnectionsEntity[]) => {
                // Handle success case
                const responseData = result.map((connection) =>
                    ConnectionMapper.toEntity(connection)
                );
                return res.json(responseData);
            }
        );
    }

    // Handler for getting all connections
    async AllConnections(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // Execute the getAllConnections use case to retrieve all connections
        const clientConnections: Either<ErrorClass, ConnectionsEntity[]> =
            await this.getAllConnectionsUsecase.execute();

        // Handle the result of the use case execution
        clientConnections.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }), // Handle error case
            (result: ConnectionsEntity[]) => {
                // Handle success case
                const responseData = result.map((connection) =>
                    ConnectionMapper.toEntity(connection)
                );
                return res.json(responseData);
            }
        );
    }

    // Handler for updating connections by ID
    async updateRequests(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;
        const Data: ConnectionsModel = req.body;

        // Execute the getConnectionsById use case to retrieve existing connection data
        const existingConnections: Either<ErrorClass, ConnectionsEntity> =
            await this.getByIdUsecase.execute(id);

        // Handle the result of retrieving existing data
        existingConnections.cata(
            (error: ErrorClass) => {
                res.status(error.status).json({ error: error.message }); // Handle error case
            },
            async (existingData: ConnectionsEntity) => {
                // Map the updated data to the existing connection entity
                const updatedConnectionsEntity: ConnectionsEntity = ConnectionMapper.toEntity(
                    Data,
                    true,
                    existingData
                );

                // Execute the updateConnections use case to update the connection
                const updatedConnections: Either<ErrorClass, ConnectionsEntity> =
                    await this.updateRequestUsecase.execute(
                        id,
                        updatedConnectionsEntity
                    );

                // Handle the result of the use case execution
                updatedConnections.cata(
                    (error: ErrorClass) => {
                        res.status(error.status).json({ error: error.message }); // Handle error case
                    },
                    (result: ConnectionsEntity) => {
                        // Handle success case
                        const resData = ConnectionMapper.toEntity(result, true);
                        res.json(resData);
                    }
                );
            }
        );
    }


}
