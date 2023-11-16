// Import necessary modules and dependencies
import { Op, Sequelize, where } from "sequelize";
import { MessageModel } from "@domain/messages/entities/msg"; // Import the MessageModel
import Message from "../model/msg-model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
    q?: string;
    page?: number;
    limit?: number;
    toId?: number;
    searchList?: string;
}

// Create MessageDataSource Interface
export interface MessageDataSource {
    createMsg(msg: MessageModel): Promise<any>;
    updateMsg(loginId: string, id: string, data: MessageModel): Promise<any>;
    deleteMsg(loginId: string, id: string): Promise<void>;
    read(loginId: string, id: string): Promise<any | null>;
    getAll(loginId: string, query: Query): Promise<any[]>;
}

// Message Data Source communicates with the database
export class MessagesDataSourceImpl implements MessageDataSource {
    constructor(private db: Sequelize) { }

    async createMsg(msg: any): Promise<any> {
        // Create a new message record using the provided data
        const createdMessages = await Message.create(msg);
        return createdMessages.toJSON(); // Convert to a plain JavaScript object before returning
    }

    async deleteMsg(loginId: string, id: string): Promise<void> {
        // Delete the message record where the ID matches the provided ID
        const deletedMessage = await Message.destroy({
            where: {
                id,
            },
        });
    }

    async read(loginId: string, id: string): Promise<any | null> {
        // Read a message record by ID
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
        // Get all message records based on the provided query parameters
        const currentPage = query.page || 1;
        const itemsPerPage = query.limit || 10;
        const offset = (currentPage - 1) * itemsPerPage;

        if (query.searchList) {
            // If searchList is provided, apply search condition
            const data = await Message.findAll({
                where: {
                    [Op.or]: [
                        {
                            message: {
                                [Op.iLike]: `%${query.searchList}%`,
                            },
                        },
                    ],
                },
                include: [
                    {
                        model: Realtors,
                        as: "senderData",
                        foreignKey: "sender",
                    },
                    {
                        model: Realtors,
                        as: "ReceiverData",
                        foreignKey: "receiver",
                    },
                ],
                limit: itemsPerPage,
                offset: offset,
            });

            if (data.length > 0) {
                return data.map((msg: any) => msg.toJSON());
            }

            const data1 = await Message.findAll({
                include: [
                    {
                        model: Realtors,
                        as: "senderData",
                        foreignKey: "sender",
                        where: {
                            [Op.or]: [
                                {
                                    firstName: {
                                        [Op.iLike]: `%${query.searchList}%`,
                                    },
                                },
                                {
                                    lastName: {
                                        [Op.iLike]: `%${query.searchList}%`,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        model: Realtors,
                        as: "ReceiverData",
                        foreignKey: "receiver",
                    },
                ],
                limit: itemsPerPage,
                offset: offset,
            });

            return data1.map((msg: any) => msg.toJSON());
        } else {
            // If no searchList, get all messages
            const data = await Message.findAll({
                include: [
                    {
                        model: Realtors,
                        as: "senderData",
                        foreignKey: "sender",
                    },
                    {
                        model: Realtors,
                        as: "ReceiverData",
                        foreignKey: "receiver",
                    },
                ],
                limit: itemsPerPage,
                offset: offset,
            });

            return data.map((msg: any) => msg.toJSON());
        }
    }

    async updateMsg(
        loginId: string,
        id: string,
        updatedData: MessageModel
    ): Promise<any> {
        // Update a message record by ID
        const message: any = await Message.findOne({
            where: {
                id,
            },
        });

        // If the message record is found, update it with the provided data
        await message.update(updatedData);
        await message.save();

        // Fetch the updated message record
        const updatedMessages = await Message.findOne({
            where: {
                id,
            },
        });

        return updatedMessages ? updatedMessages.toJSON() : null; // Convert to a plain JavaScript object before returning
    }
}
