import { Request, Response } from 'express';
// import { , ChatMapper } from '@domain/chat/chat-entity';
import { Op } from "sequelize";
import Chat from '@data/chat/models/chat-models';
import { ChatMapper } from '@domain/chat/chat-entity';

// Create a new chat
export const createChat = async (userOne: string, userTwo: string): Promise<void> => {
  try {
    // Ensure that the chat does not already exist for the given users
    const existingChat = await Chat.findOne({
      where: {
        [Op.or]: [
          { userOne, userTwo },
          { userOne: userTwo, userTwo: userOne },
        ],
      },
    });

    if (existingChat) {
     throw Error("chat already exist")
    }

    // Create a new chat
    const newChat = await Chat.create({
      userOne,
      userTwo,
      lastMessage: null,
      lastMessageTime: null,
      chatMessageCount: 0,
    });

    const chatEntity = ChatMapper.toEntity(newChat.get(), true);
    return 
  } catch (error) {
        throw Error("error while creating chat.")
  }
};
