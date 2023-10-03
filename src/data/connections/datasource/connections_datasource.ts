import { Sequelize } from "sequelize"
import { ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the connectionsModel
import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";

// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {
    create(connections: ConnectionsModel): Promise<any>;
    update(id: string, data: ConnectionsModel): Promise<any>;
    delete(id: string): Promise<void>;
    read(id: string): Promise<any | null>;
    getAll(): Promise<any[]>;
}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
    constructor(private db: Sequelize) { }

    async create(newConnection: any): Promise<any> {

        const existingConnection1 = await Connections.findOne({
            where: {
                fromId: newConnection.fromId,
                toId: newConnection.toId
            }
        });

        const existingConnection2 = await Connections.findOne({
            where: {
                fromId: newConnection.toId,
                toId: newConnection.fromId
            }
        });

        if (existingConnection1 || existingConnection2) {
            throw ApiError.emailExist();
        }
        const createdConnections = await Connections.create(newConnection);
        return createdConnections.toJSON();
    }

    async delete(id: string): Promise<void> {
        await Connections.destroy({
            where: {
                id: id,
            },
        });
    }

    async read(id: string): Promise<any | null> {
        const connections = await Connections.findOne({
            where: {
                id: id,
            },
        });
        return connections ? connections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    async getAll(): Promise<any[]> {
        const connections = await Connections.findAll({});
        return connections.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning
    }

    async update(id: string, updatedData: ConnectionsModel): Promise<any> {
        // Find the record by ID
        const connection = await Connections.findByPk(id);


        // Update the record with the provided data
        if (connection) {
            await connection.update(updatedData);
        }
        // Fetch the updated record
        const updatedConnections = await Connections.findByPk(id);

        return updatedConnections ? updatedConnections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }
}
