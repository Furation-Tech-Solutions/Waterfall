import { Op, Sequelize, where } from "sequelize"
import { ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the connectionsModel
import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
    q: string;
    page: number;
    limit: number;
    toId: number;
}

// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {
    createReq(connections: ConnectionsModel): Promise<any>;
    updateReq(loginId: string, id: string, data: ConnectionsModel): Promise<any>;
    deleteReq(loginId: string, id: string): Promise<void>;
    read(loginId: string, id: string): Promise<any | null>;
    getAll(loginId: string, query: Query): Promise<any[]>;

}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
    constructor(private db: Sequelize) { }

    async createReq(newConnection: any): Promise<any> {
        // console.log(newConnection);

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
    async deleteReq(loginId: string, id: string): Promise<void> {

        let loginID = parseInt(loginId);
        // let friendId = parseInt(toId);

        // ============================================
        // you need to pass two id, user and friend id

        const deletedConnection = await Connections.destroy({
            where: {
                id,
            },
            // where: {
            //     id,
            // [Op.or]: [
            //     {
            //         fromId: loginId,
            //         toId: friendId
            //     },
            //     {
            //         fromId: friendId,
            //         toId: loginId
            //     }
            // ]
            // }
        });

        if (deletedConnection == 0) {
            // error
        }

    }
    async read(loginId: string, id: string): Promise<any | null> {
        let loginID = parseInt(loginId);
        // let friendId = parseInt(fromId);

        const connections = await Connections.findOne({
            where: {
                id,
            },
            // where: {
            //     id,
            // fromId: loginId,
            // toId: friendId
            // },
            include: [{
                model: Realtors,
                as: 'fromRealtor', // Alias for the first association
                foreignKey: 'fromId',
            },
            {
                model: Realtors,
                as: 'toRealtor', // Alias for the second association
                foreignKey: 'toId',
            },]
        });
        return connections ? connections.toJSON() : null; // Convert to a plain JavaScript object before returning

    }

    async getAll(loginId: string, query: Query): Promise<any[]> {
        let loginID = parseInt(loginId);

        if (query.q === "connected") {
            const data = await Connections.findAll({
                where: {
                    connected: true
                },
                //-------------------------------------------
                // where: {

                // [Op.or]: [
                //     {
                //         connected: true,
                // toId: loginID,
                // },
                // {
                // connected: true,
                // fromId: loginID,
                //     }
                // ]
                // },
                //-------------------------------------------
                include: [{
                    model: Realtors,
                    as: 'fromRealtor', // Alias for the first association
                    foreignKey: 'fromId',
                },
                {
                    model: Realtors,
                    as: 'toRealtor', // Alias for the second association
                    foreignKey: 'toId',
                },]
            });
            return data.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning 

        } else if (query.q === "mutualfriends") {
            let friendId = query.toId;

            const data = await Connections.findAll({
                where: {
                    [Op.or]: [
                        {
                            connected: true,
                            toId: 1,
                        },
                        {
                            connected: true,
                            fromId: 1,
                        },
                        {
                            connected: true,
                            toId: friendId
                        },
                        {
                            connected: true,
                            fromId: friendId
                        }
                    ]
                },
            });
            console.log(data, "data");
            // Extract and filter the friend IDs that are not equal to 1
            // const friendIds = data.map((friend: any) => (friend.fromId === 1 ? friend.toId : friend.fromId));

            const friendIds = data.map((friend: any) => {
                if (friend.fromId === 1) {
                    return friend.toId;
                } else if (friend.fromId === friendId) {
                    return friend.toId;
                } else if (friend.toId === 1) {
                    return friend.fromId;
                } else if (friend.toId === friendId) {
                    return friend.fromId;
                }
                else {
                    // You can choose to handle other cases here if needed
                    return null; // For example, return null for cases that don't match the conditions
                }
            });

            // Filter out null values if needed
            const filteredFriendIds = friendIds.filter((id) => id !== null);

            console.log(filteredFriendIds);

            console.log(friendIds); // Array of friend IDs that are not equal to 1

            return data.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning 

        }
        else {
            const data = await Connections.findAll({
                // where: {
                // connected: false,
                // toId: loginId,
                // },
                include: [{
                    model: Realtors,
                    as: 'fromRealtor', // Alias for the first association
                    foreignKey: 'fromId',
                },
                {
                    model: Realtors,
                    as: 'toRealtor', // Alias for the second association
                    foreignKey: 'toId',
                },]
            });
            return data.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning 
        }
    }

    async updateReq(loginId: string, id: string, updatedData: ConnectionsModel): Promise<any> {
        // Find the record by ID
        let loginID = parseInt(loginId);
        // let toID = parseInt(toId);
        const connection: any = await Connections.findOne({
            where: {
                id,
            },
            // where: {
            //     [Op.or]: [
            //         {
            //             toId: fromID,
            //             fromId: toID,
            //         },
            //         {
            //             toId: toID,
            //             fromId: fromID,
            //         }
            //     ]
            // },
        });
        // Update the record with the provided data

        await connection.update(updatedData);
        await connection.save();

        const updatedConnections = await Connections.findOne({
            where: {
                id,
            },
            // where: {
            //     toId: toID,
            //     fromId: fromID,
            // }
        });

        return updatedConnections ? updatedConnections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }
}
