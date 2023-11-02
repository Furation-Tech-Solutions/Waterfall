import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Query } from "@data/connections/datasource/connections_datasource";


export interface ConnectionsRepository {
    createRequest(
        connections: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    deleteRequest(loginId: string, id: string): Promise<Either<ErrorClass, void>>;
    getById(loginId: string, id: string): Promise<Either<ErrorClass, ConnectionsEntity>>;
    updateRequest(
        loginId: string,
        id: string,
        data: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    getAll(loginId: string, query: Query): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
}


