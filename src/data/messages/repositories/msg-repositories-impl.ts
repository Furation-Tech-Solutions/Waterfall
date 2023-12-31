// Import necessary modules and dependencies
import {
  MessageEntity,
  MessageModel,
} from "@domain/messages/entities/msg"; // Import the MessageModel
import { MessagesRepository } from "@domain/messages/repositories/msg-repository"; // Import the MessagesRepository
import {
  MessageDataSource,
  Query,
} from "../datasources/msg-datasource"; // Import the MessagesDataSource
import { Either, Right, Left } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { string } from "joi";

// Implementation of the MessagesRepository interface
export class MessagesRepositoryImpl implements MessagesRepository {
  private readonly messageDataSource: MessageDataSource;

  constructor(messageDataSource: MessageDataSource) {
    this.messageDataSource = messageDataSource;
  }

  // Create a new message entry
  async createMessage(
    data: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const createdMessage = await this.messageDataSource.createMsg(data); // Use the createdMessage data source

      return Right<ErrorClass, MessageEntity>(createdMessage);
    } catch (error: any) {
      return Left<ErrorClass, MessageEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  // Delete a message entry by ID
  async deleteMessage(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.messageDataSource.deleteMsg(id); // Use the messages data source

      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  // Update a message entry by ID
  async updateMessage(
    id: string,
    data: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const updatedMessages = await this.messageDataSource.updateMsg(id, data); // Use the Messages data source
      return Right<ErrorClass, MessageEntity>(updatedMessages);
    } catch (e) {
      return Left<ErrorClass, MessageEntity>(ApiError.badRequest());
    }
  }

  // Retrieve all message entries
  async getAllMessages(
    loginId: string,
    query: Query
  ): Promise<Either<ErrorClass, MessageEntity[]>> {
    try {
      const messages = await this.messageDataSource.getAll(loginId, query); // Use the messages data source
      // Check if the data length is zero
      if (messages.length === 0) {
        // If data length is zero, send a success response with status code 200
        return Right<ErrorClass, MessageEntity[]>([]);
      }
      return Right<ErrorClass, MessageEntity[]>(messages);
    } catch (e: any) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, MessageEntity[]>(ApiError.notFound());
      } else {
        return Left<ErrorClass, []>(ApiError.customError(400, e.message));
      }
    }
  }

  // Retrieve a message entry by its ID
  async getMessageById(id: string): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const messages = await this.messageDataSource.read(id); // Use the messages data source
      return Right<ErrorClass, MessageEntity>(messages);
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, MessageEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, MessageEntity>(ApiError.badRequest());
    }
  }
  // Delete a message entry by ID
  async deleteMessagesByConnection(
    connectionId: number
  ): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.messageDataSource.deleteMessagesByConnectionId(
        connectionId
      ); // Use the messages data source

      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        console.log(e);
        
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }
}
