// Import necessary dependencies and types
import { NextFunction, Request, Response } from "express";
import { ErrorClass } from "@presentation/error-handling/api-error";
import {
    ConnectionsEntity,
    ConnectionMapper,
    ConnectionsModel,
} from "@domain/connections/entities/connections_entities"; // Import Connections-related entities and mapper
import { CreateConnectionsUsecase } from "@domain/connections/usecases/create_connections"; // Import Connections-related use cases
import { DeleteConnectionsUsecase } from "@domain/connections/usecases/delete_connections";
import { GetConnectionsByIdUsecase } from "@domain/connections/usecases/get_by_id_connections";
import { GetAllConnectionsUsecase } from "@domain/connections/usecases/get_all_connections";
import { UpdateConnectionsUsecase } from "@domain/connections/usecases/update_connections";
import { Either } from "monet";

// Define a class for handling Connections-related services
export class ConnectionsServices {
    private readonly createConnectionsUsecase: CreateConnectionsUsecase;
    private readonly deleteConnectionsUsecase: DeleteConnectionsUsecase;
    private readonly getConnectionsByIdUsecase: GetConnectionsByIdUsecase;
    private readonly getAllConnectionsUsecase: GetAllConnectionsUsecase;
    private readonly updateConnectionsUsecase: UpdateConnectionsUsecase;

    constructor(
        createConnectionsUsecase: CreateConnectionsUsecase,
        deleteConnectionsUsecase: DeleteConnectionsUsecase,
        getConnectionsByIdUsecase: GetConnectionsByIdUsecase,
        getAllConnectionsUsecase: GetAllConnectionsUsecase,
        updateConnectionsUsecase: UpdateConnectionsUsecase,
    ) {
        this.createConnectionsUsecase = createConnectionsUsecase;
        this.deleteConnectionsUsecase = deleteConnectionsUsecase;
        this.getConnectionsByIdUsecase = getConnectionsByIdUsecase;
        this.getAllConnectionsUsecase = getAllConnectionsUsecase;
        this.updateConnectionsUsecase = updateConnectionsUsecase;
    }

    // Handler for creating new connections
    async createConnections(req: Request, res: Response): Promise<void> {
        // Extract data from the request body and map it to the ConnectionsModel
        const Data: ConnectionsModel = ConnectionMapper.toModel(req.body);

        console.log(Data, "service-42");

        // Execute the createConnections use case to create a new connection
        const newConnections: Either<ErrorClass, ConnectionsEntity> =
            await this.createConnectionsUsecase.execute(Data);

        console.log(newConnections, "service-47");

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
    async deleteConnections(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;

        // Execute the deleteConnections use case to delete a connection by ID
        const deletedConnections: Either<ErrorClass, void> =
            await this.deleteConnectionsUsecase.execute(id);

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
    async getConnectionsById(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;

        // Execute the getConnectionsById use case to retrieve a connection by ID
        const connections: Either<ErrorClass, ConnectionsEntity> =
            await this.getConnectionsByIdUsecase.execute(id);

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
    async getAllConnections(
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
    async updateConnections(req: Request, res: Response): Promise<void> {
        const id: string = req.params.id;
        const Data: ConnectionsModel = req.body;

        // Execute the getConnectionsById use case to retrieve existing connection data
        const existingConnections: Either<ErrorClass, ConnectionsEntity> =
            await this.getConnectionsByIdUsecase.execute(id);

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
                    await this.updateConnectionsUsecase.execute(
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
