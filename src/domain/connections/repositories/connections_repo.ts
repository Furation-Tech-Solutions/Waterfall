import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

export interface ConnectionsRepository {
    createConnections(
        connections: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    deleteConnections(id: string): Promise<Either<ErrorClass, void>>;
    getConnectionsById(id: string): Promise<Either<ErrorClass, ConnectionsEntity>>;
    updateConnections(
        id: string,
        data: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    getAllConnections(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
}
