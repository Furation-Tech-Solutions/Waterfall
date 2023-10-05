import { ConnectionsEntity, ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the ConnectionsModel
import { ConnectionsRepository } from "@domain/connections/repositories/connections_repo"; // Import the ConnectionsRepository
import { ConnectionsDataSource } from "../datasource/connections_datasource"; // Import the ConnectionsDataSource
import { Either, Right, Left } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { string } from "joi";

export class ConnectionsRepositoryImpl implements ConnectionsRepository {
    private readonly connectionsDataSource: ConnectionsDataSource;
    constructor(connectionsDataSource: ConnectionsDataSource) {
        this.connectionsDataSource = connectionsDataSource;
    }

    async createConnections(data: ConnectionsModel): Promise<Either<ErrorClass, ConnectionsEntity>> {
        try {
            const createdConnections = await this.connectionsDataSource.create(data); // Use the Connections data source
            return Right<ErrorClass, ConnectionsEntity>(createdConnections);
        } catch (error: any) {
            if (error instanceof ApiError && error.name === "conflict") {
                return Left<ErrorClass, ConnectionsEntity>(ApiError.connectionExist());
            }
            return Left<ErrorClass, ConnectionsEntity>(ApiError.customError(400, error.message));
        }
    }

    async deleteConnections(id: string): Promise<Either<ErrorClass, void>> {
        try {
            const result = await this.connectionsDataSource.delete(id); // Use the Connections data source
            return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, void>(ApiError.notFound());
            }
            return Left<ErrorClass, void>(ApiError.badRequest());
        }
    }

    async updateConnections(id: string, data: ConnectionsModel): Promise<Either<ErrorClass, ConnectionsEntity>> {
        try {
            const updatedConnections = await this.connectionsDataSource.update(id, data); // Use the Connections data source
            return Right<ErrorClass, ConnectionsEntity>(updatedConnections);
        } catch (e) {
            if (e instanceof ApiError && e.name === "conflict") {
                return Left<ErrorClass, ConnectionsEntity>(ApiError.connectionExist());
            }
            return Left<ErrorClass, ConnectionsEntity>(ApiError.badRequest());
        }
    }

    async getAllConnections(): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
        try {
            const connections = await this.connectionsDataSource.getAll(); // Use the connections data source
            return Right<ErrorClass, ConnectionsEntity[]>(connections);
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ConnectionsEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, ConnectionsEntity[]>(ApiError.badRequest());
        }
    }

    async getConnectionsById(id: string): Promise<Either<ErrorClass, ConnectionsEntity>> {
        try {
            const connections = await this.connectionsDataSource.read(id); // Use the connections data source
            return connections
                ? Right<ErrorClass, ConnectionsEntity>(connections)
                : Left<ErrorClass, ConnectionsEntity>(ApiError.notFound());
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ConnectionsEntity>(ApiError.notFound());
            }
            return Left<ErrorClass, ConnectionsEntity>(ApiError.badRequest());
        }
    }

    async getAllConnectionRequests(id: string): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
        try {
            const connections = await this.connectionsDataSource.getAllRequest(id); // Use the connections data source
            return Right<ErrorClass, ConnectionsEntity[]>(connections);
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ConnectionsEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, ConnectionsEntity[]>(ApiError.badRequest());
        }
    }

    async getAllConnectedConnections(id: string): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
        try {
            const connections = await this.connectionsDataSource.getAllconnected(id); // Use the connections data source
            return Right<ErrorClass, ConnectionsEntity[]>(connections);
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ConnectionsEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, ConnectionsEntity[]>(ApiError.badRequest());
        }
    }


}
