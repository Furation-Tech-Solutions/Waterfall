import { Sequelize, where } from "sequelize"
import { ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the connectionsModel
import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {
    createReq(connections: ConnectionsModel): Promise<any>;
    updateReq(id: string, data: ConnectionsModel): Promise<any>;
    deleteReq(id: string): Promise<void>;
    read(id: string): Promise<any | null>;
    getAll(): Promise<any[]>;

}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
    constructor(private db: Sequelize) { }

    async createReq(newConnection: any): Promise<any> {

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

    async deleteReq(id: string): Promise<void> {
        // Find the record by ID
        const connection: any = await Connections.findByPk(id);
        // Update the record with the provided data

        const from: any = await Realtors.findByPk(connection.fromId);
        const to: any = await Realtors.findByPk(connection.toId);

        // from.friends.push(updatedData.toId);
        for (let i = 0; i < from.friends.length; i++) {
            if (from.friends[i] == connection.toId) {
                from.friends.splice(i, 1);
            }
        }

        await Realtors.update(from.dataValues, {
            where: {
                id: from.id,
            }
        });

        for (let i = 0; i < to.friends.length; i++) {
            if (to.friends[i] == connection.fromId) {
                to.friends.splice(i, 1);
            }
        }

        await Realtors.update(to.dataValues, {
            where: {
                id: to.id,
            }
        });



        await Connections.destroy({
            where: {
                id: id
            },
        });
    }

    async read(id: string): Promise<any | null> {
        const connections = await Connections.findOne({
            where: {
                id: id
            },
        });
        return connections ? connections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    async getAll(): Promise<any[]> {
        const connections = await Connections.findAll();
        return connections.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning
    }

    async updateReq(id: string, updatedData: ConnectionsModel): Promise<any> {
        // Find the record by ID
        const connection: any = await Connections.findByPk(id);
        // Update the record with the provided data

        await connection.update(updatedData);
        await connection.save();

        const from: any = await Realtors.findByPk(updatedData.fromId);
        from.friends.push(updatedData.toId);
        await Realtors.update(from.dataValues, {
            where: {
                id: from.id,
            }
        });

        const to: any = await Realtors.findByPk(updatedData.toId);
        to.friends.push(updatedData.fromId);
        await Realtors.update(to.dataValues, {
            where: {
                id: to.id,
            }
        });

        const updatedConnections = await Connections.findByPk(id);

        return updatedConnections ? updatedConnections.toJSON() : null; // Convert to a plain JavaScript object before returning
    }


}



// import { Sequelize, where } from "sequelize"
// import { ConnectionsModel } from "@domain/connections/entities/connections_entities"; // Import the connectionsModel
// import Connections from "../models/connections_model";
// import ApiError from "@presentation/error-handling/api-error";
// import Realtors from "@data/realtors/model/realtor-model";

// // Create ConnectionsDataSource Interface
// export interface ConnectionsDataSource {
//     createReq(connections: ConnectionsModel): Promise<any>;
//     updateReq(id: string, data: ConnectionsModel): Promise<any>;
//     deleteReq(id: string): Promise<void>;
//     read(id: string): Promise<any | null>;
//     getAll(): Promise<any[]>;

// }

// // Connections Data Source communicates with the database
// export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
//     constructor(private db: Sequelize) { }

//     async createReq(newConnection: any): Promise<any> {

//         const existingConnection1 = await Connections.findOne({
//             where: {
//                 fromId: newConnection.fromId,
//                 toId: newConnection.toId
//             }
//         });

//         const existingConnection2 = await Connections.findOne({
//             where: {
//                 fromId: newConnection.toId,
//                 toId: newConnection.fromId
//             },
//         });

//         if (existingConnection1 || existingConnection2) {
//             throw ApiError.emailExist();
//         }
//         const createdConnections = await Connections.create(newConnection);
//         return createdConnections.toJSON();
//     }

//     async deleteReq(id: string): Promise<void> {
//         // Find the record by ID
//         const connection: any = await Connections.findByPk(id);
//         // Update the record with the provided data

//         const from: any = await Realtors.findByPk(connection.fromId);
//         const to: any = await Realtors.findByPk(connection.toId);

//         // from.friends.push(updatedData.toId);
//         for (let i = 0; i < from.friends.length; i++) {
//             if (from.friends[i] == connection.toId) {
//                 from.friends.splice(i, 1);
//             }
//         }

//         await Realtors.update(from.dataValues, {
//             where: {
//                 id: from.id,
//             }
//         });

//         for (let i = 0; i < to.friends.length; i++) {
//             if (to.friends[i] == connection.fromId) {
//                 to.friends.splice(i, 1);
//             }
//         }

//         await Realtors.update(to.dataValues, {
//             where: {
//                 id: to.id,
//             }
//         });



//         await Connections.destroy({
//             where: {
//                 id: id
//             },
//         });
//     }

//     async read(id: string): Promise<any | null> {
//         const connections = await Connections.findOne({
//             where: {
//                 id: id
//             },
//             include: [
//                 {
//                   model: Realtors,
//                   as: 'fromRealtor'
//                 },
//                 {
//                   model: Realtors,
//                   as: 'toRealtor'                
//                 },
//               ],
//         });
//         return connections ? connections.toJSON() : null; // Convert to a plain JavaScript object before returning
//     }

//     async getAll(): Promise<any[]> {
//         const connections = await Connections.findAll();
//         return connections.map((connection: any) => connection.toJSON()); // Convert to plain JavaScript objects before returning
//     }

//     async updateReq(id: string, updatedData: ConnectionsModel): Promise<any> {
//         // Find the record by ID
//         const connection: any = await Connections.findByPk(id);
//         // Update the record with the provided data

//         await connection.update(updatedData);
//         await connection.save();

//         const from: any = await Realtors.findByPk(updatedData.fromId);
//         from.friends.push(updatedData.toId);
//         await Realtors.update(from.dataValues, {
//             where: {
//                 id: from.id,
//             }
//         });

//         const to: any = await Realtors.findByPk(updatedData.toId);
//         to.friends.push(updatedData.fromId);
//         await Realtors.update(to.dataValues, {
//             where: {
//                 id: to.id,
//             }
//         });

//         const updatedConnections = await Connections.findByPk(id);

//         return updatedConnections ? updatedConnections.toJSON() : null; // Convert to a plain JavaScript object before returning
//     }


// }
