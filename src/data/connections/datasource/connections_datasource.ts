import { Op, Sequelize, where } from "sequelize"
import { ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the connectionsModel
import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {
    createReq(connections: ConnectionsModel): Promise<any>;
    updateReq(fromId: string, toId: string, data: ConnectionsModel): Promise<any>;
    deleteReq(fromId: string, toId: string): Promise<void>;
    read(fromId: string, toId: string): Promise<any | null>;
    getAll(fromId: string, toId: string): Promise<any[]>;

}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
    constructor(private db: Sequelize) { }

    async createReq(newConnection: any): Promise<any> {

        const existingConnection = await Connections.findOne({
            where: {
                [Op.or]: [
                    {
                        fromId: newConnection.fromId,
                        toId: newConnection.toId
                    },
                    {
                        fromId: newConnection.toId,
                        toId: newConnection.fromId
                    }
                ]
            }
        });

        if (existingConnection) {
            throw ApiError.emailExist();
        }
        const createdConnections = await Connections.create(newConnection);
        return createdConnections.toJSON();
    }
    async deleteReq(fromId: string, toId: string): Promise<void> {

        let loginId = parseInt(fromId);
        let friendId = parseInt(toId);

        // ============================================
        // you need to pass two id, user and friend id

        const deletedConnection = await Connections.destroy({
            where: {
                [Op.or]: [
                    {
                        fromId: loginId,
                        toId: friendId
                    },
                    {
                        fromId: friendId,
                        toId: loginId
                    }
                ]
            }
        });

        if (deletedConnection == 0) {
            // error
        }

    }
    async read(fromId: string, toId: string): Promise<any | null> {
        let loginId = parseInt(toId);
        let friendId = parseInt(fromId);

        const connections = await Connections.findOne({
            where: {
                fromId: loginId,
                toId: friendId
            },
            include: [{
                model: Realtors,
                as: 'from', // Alias for the first association
                foreignKey: 'fromId',
            },
            {
                model: Realtors,
                as: 'to', // Alias for the second association
                foreignKey: 'toId',
            },
        ]
        });
        return connections ? connections.toJSON() : null; // Convert to a plain JavaScript object before returning

    }
  
    async getAll(id: string, query: string): Promise<any[]> {
        let loginId = parseInt(id);
        let q = query;
        console.log(query, loginId);
        if (q === "connected") {
            const data = await Connections.findAll({
                where: {
                    [Op.or]: [
                        {
                            connected: true,
                            toId: loginId,
                        },
                        {
                            connected: true,
                            fromId: loginId,
                        }
                    ]
                },
                include: [{
                    model: Realtors,
                    as: 'from', // Alias for the first association
                    foreignKey: 'fromId',
                },
                {
                    model: Realtors,
                    as: 'to', // Alias for the second association
                    foreignKey: 'toId',
                },
                ],
            });
            return data.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning 

        }
        else {
            const data = await Connections.findAll({
                where: {
                    connected: false,
                    toId: loginId,
                },
                include: [{
                    model: Realtors,
                    as: 'from', // Alias for the first association
                    foreignKey: 'fromId',
                },
                {
                    model: Realtors,
                    as: 'to', // Alias for the second association
                    foreignKey: 'toId',
                },
                ],
            });
            return data.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning 
        }
    }

    async updateReq(fromId: string, toId: string, updatedData: ConnectionsModel): Promise<any> {
        // Find the record by ID
        console.log("============>", fromId, toId);
        let fromID = parseInt(fromId);
        let toID = parseInt(toId);
        const connection: any = await Connections.findOne({
            // where: {
            //     toId: toID,
            //     fromId: fromID,
            // }
            where: {
                [Op.or]: [
                    {
                        toId: fromID,
                        fromId: toID,
                    },
                    {
                        toId: toID,
                        fromId: fromID,
                    }
                ]
            },
        });
        // Update the record with the provided data

        await connection.update(updatedData);
        await connection.save();

        const updatedConnections = await Connections.findOne({
            where: {
                toId: toID,
                fromId: fromID,
            }
        });

        return updatedConnections ? updatedConnections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }


}
