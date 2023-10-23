import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

export interface ConnectionsRepository {
    createRequest(
        connections: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    deleteRequest(fromId: string, toId: string): Promise<Either<ErrorClass, void>>;
    getById(fromId: string, toId: string): Promise<Either<ErrorClass, ConnectionsEntity>>;
    updateRequest(
        fromId: string,
        toId: string,
        data: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    getAll(id: string, query: string): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
}


