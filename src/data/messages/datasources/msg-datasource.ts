// Import necessary modules and dependencies
import { Op, Sequelize, where } from "sequelize";
import { MessageEntity, MessageModel } from "@domain/messages/entities/msg"; // Import the MessageModel
import Message from "../model/msg-model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";
import Blocking from "@data/blocking/model/blocking-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
  q?: string;
  page?: number;
  limit?: number;
  toId?: string;
  searchList?: string;
}

// Create MessageDataSource Interface
export interface MessageDataSource {
  createMsg(msg: MessageModel): Promise<any>;
  updateMsg(id: string, data: MessageModel): Promise<any>;
  deleteMsg(id: string): Promise<void>;
  read(id: string): Promise<any | null>;
  getAll(loginId: string, query: Query): Promise<MessageEntity[]>;
}

// Message Data Source communicates with the database
export class MessagesDataSourceImpl implements MessageDataSource {
  constructor(private db: Sequelize) {}

  async createMsg(msg: any): Promise<MessageEntity> {
    // Check if the sender and receiver are blocked
    const isBlocked = await Blocking.findOne({
      where: {
        [Op.or]: [
          {
            fromRealtorId: msg.senderId,
            toRealtorId: msg.receiverId,
          },
          {
            fromRealtorId: msg.receiverId,
            toRealtorId: msg.senderId,
          },
        ],
      },
    });

    if (isBlocked) {
      throw new Error(
        "Message cannot be created as senderId or receiverId is blocked."
      );
    }

    // Create a new message record using the provided data
    const createdMessages = await Message.create(msg);
    return createdMessages.toJSON();
  }

  async deleteMsg(id: string): Promise<void> {
    // Delete the message record where the ID matches the provided ID
    const deletedMessage = await Message.destroy({
      where: {
        id,
      },
    });
  }

  async read(id: string): Promise<MessageEntity> {
    // Read a message record by ID
    const messages = await Message.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Realtors,
          as: "senderData", // Alias for the first association
          foreignKey: "senderId",
        },
        {
          model: Realtors,
          as: "receiverData", // Alias for the second association
          foreignKey: "receiverId",
        },
      ],
    });
    if (messages === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return messages.toJSON();
  }

  async getAll(loginId: string, query: Query): Promise<MessageEntity[]> {
    // Get all message records based on the provided query parameters
    // console.log(+loginId, "login ID")
    const currentPage = query.page || 1;
    const itemsPerPage = query.limit || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    if (query.q === "unread" && loginId) {
      const data = await Message.findAll({
        where: {
          receiverId: loginId,
          seen: false,
        },
        include: [
          {
            model: Realtors,
            as: "senderData",
            foreignKey: "senderId",
          },
          {
            model: Realtors,
            as: "receiverData",
            foreignKey: "receiverId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      if (data.length > 0) {
        return data.map((msg: any) => msg.toJSON());
      }
    } else if (query.searchList && loginId) {
      // If searchList is provided, apply search condition

      const data = await Message.findAll({
        where: {
          [Op.or]: [
            {
              senderId: loginId,
            },
            {
              receiverId: loginId,
            },
          ],
        },
        include: [
          {
            model: Realtors,
            as: "senderData",
            foreignKey: "senderId",
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
            as: "receiverData",
            foreignKey: "receiverId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      if (data.length > 0) {
        return data.map((msg: any) => msg.toJSON());
      }

      const data1 = await Message.findAll({
        where: {
          [Op.or]: [
            {
              senderId: loginId,
            },
            {
              receiverId: loginId,
            },
          ],
          message: {
            [Op.iLike]: `%${query.searchList}%`,
          },
        },
        include: [
          {
            model: Realtors,
            as: "senderData",
            foreignKey: "senderId",
          },
          {
            model: Realtors,
            as: "receiverData",
            foreignKey: "receiverId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return data1.map((msg: any) => msg.toJSON());
    } else if (query.q === "chatscreen" && query.toId && loginId) {
      const data = await Message.findAll({
        where: {
          [Op.or]: [
            {
              senderId: loginId,
              receiverId: query.toId,
            },
            {
              senderId: query.toId,
              receiverId: loginId,
            },
          ],
        },
        include: [
          {
            model: Realtors,
            as: "senderData",
            foreignKey: "senderId",
          },
          {
            model: Realtors,
            as: "receiverData",
            foreignKey: "receiverId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return data.map((msg: any) => msg.toJSON());
    } 
      // If no searchList, get all messages
      const data = await Message.findAll({
        where: {
          [Op.or]: [
            {
              senderId: loginId,
            },
            {
              receiverId: loginId,
            },
          ],
        },
        include: [
          {
            model: Realtors,
            as: "senderData",
            foreignKey: "senderId",
          },
          {
            model: Realtors,
            as: "receiverData",
            foreignKey: "receiverId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return data.map((msg: any) => msg.toJSON());
    
  }

  async updateMsg(id: string, updatedData: any): Promise<MessageEntity> {
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

    if (updatedMessages == null) {
      throw ApiError.notFound();
    }
    return updatedMessages.toJSON();
  }
}
