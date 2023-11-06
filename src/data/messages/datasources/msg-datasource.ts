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

        const currentPage = query.page || 1;
        const itemsPerPage = query.limit || 10;
        const offset = (currentPage - 1) * itemsPerPage;

        if (query.searchList) {

            const data = await Message.findAll({
                where: {
                    [Op.or]: [
                        {
                            message: {
                                [Op.iLike]: `%${query.searchList}%`,
                            },
                        },
                    ],
                }, // Apply search condition if searchList is provided
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
