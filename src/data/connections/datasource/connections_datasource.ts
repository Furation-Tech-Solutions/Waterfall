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
        // loginID = 1;

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

            const findFriendIds = async (id: number) => {

                const data = await Connections.findAll({
                    where: {
                        [Op.or]: [
                            {
                                connected: true,
                                toId: id,
                            },
                            {
                                connected: true,
                                fromId: id,
                            },
                        ]
                    },
                });
                // Extract and filter the friend IDs that are not equal to 1
                const friendIds = data.map((friend: any) => (friend.fromId === id ? friend.toId : friend.fromId));

                // Filter out null values if needed
                const filteredFriendIds = friendIds.filter((id) => id !== null);    

                // console.log(filteredFriendIds);

                return filteredFriendIds;
            };

            const myFriends = await findFriendIds(loginID);
            const otherFriends = await findFriendIds(friendId);
            // console.log(myFriends, "myfriends");
            // console.log(otherFriends, "otherFriends");
            // Find the common numbers
            const commonFriends = myFriends.filter(id => otherFriends.includes(id));
            // console.log(commonFriends, "commonFriends");

            //------------------------------------------------------------------------------------------------------------
            const data = await Connections.findAll({
                where: {
                    [Op.or]: [
                        {
                            connected: true,
                            toId: loginID,
                        },
                        {
                            connected: true,
                            fromId: loginID,
                        },
                    ]
                },
            });

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
