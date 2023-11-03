import { Op, Sequelize, where } from "sequelize";
import { MessageModel } from "@domain/messages/entities/msg"; // Import the MessageModel
import Message from "../model/msg-model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
    q: string;
    page: number;
    limit: number;
    toId: number;
}

// Create MessageDataSource Interface
export interface MessageDataSource {
    createMsg(msg: MessageModel): Promise<any>;
    updateMsg(loginId: string, id: string, data: MessageModel): Promise<any>;
    deleteMsg(loginId: string, id: string): Promise<void>;
    read(loginId: string, id: string): Promise<any | null>;
    getAll(loginId: string, query: Query): Promise<any[]>;
}

// message Data Source communicates with the database
export class messagesDataSourceImpl implements MessageDataSource {
    constructor(private db: Sequelize) { }

    async createMsg(msg: any): Promise<any> {
        // console.log(newMessage);

        const createdMessages = await Message.create(msg);
        return createdMessages.toJSON();
    }

    async deleteMsg(loginId: string, id: string): Promise<void> {
        let loginID = parseInt(loginId);
        // let friendId = parseInt(toId);

        const deletedMessage = await Message.destroy({
            where: {
                id,
            },
        });
    }

    async read(loginId: string, id: string): Promise<any | null> {
        let loginID = parseInt(loginId);

        const messages = await Message.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Realtors,
                    as: "senderData", // Alias for the first association
                    foreignKey: "sender",
                },
                {
                    model: Realtors,
                    as: "ReceiverData", // Alias for the second association
                    foreignKey: "receiver",
                },
            ],
        });
        return messages ? messages.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    async getAll(loginId: string, query: Query): Promise<any[]> {
        let loginID = parseInt(loginId);
        // loginID = 1;

        const currentPage = query.page || 1; // Default to page 1
        console.log(query);


        const itemsPerPage = query.limit || 10; // Default to 10 items per page
        const offset = (currentPage - 1) * itemsPerPage;

        const data = await Message.findAll({
            // where: {
            // },
            include: [
                {
                    model: Realtors,
                    as: "senderData", // Alias for the first association
                    foreignKey: "sender",
                },
                {
                    model: Realtors,
                    as: "ReceiverData", // Alias for the second association
                    foreignKey: "receiver",
                },
            ],
            limit: itemsPerPage, // Limit the number of results per page
            offset: offset, // Calculate the offset based on the current page
        });
        return data.map((msg: any) => msg.toJSON()); // Convert to plain JavaScript objects before returning
    }

    async updateMsg(
        loginId: string,
        id: string,
        updatedData: MessageModel
    ): Promise<any> {
        // Find the record by ID
        let loginID = parseInt(loginId);
        // let toID = parseInt(toId);
        const message: any = await Message.findOne({
            where: {
                id,
            },
        });
        // Update the record with the provided data

        await message.update(updatedData);
        await message.save();

        const updatedMessages = await Message.findOne({
            where: {
                id,
            },
        });

        return updatedMessages ? updatedMessages.toJSON() : null; // Convert to a plain JavaScript object before returning
    }
}
