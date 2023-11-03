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

export class MessagesRepositoryImpl implements MessagesRepository {
  private readonly messageDataSource: MessageDataSource;
  constructor(messageDataSource: MessageDataSource) {
    this.messageDataSource = messageDataSource;
  }

  async createMessage(
    data: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const createdMessage = await this.messageDataSource.createMsg(
        data
      ); // Use the createdMessage data source

      return Right<ErrorClass, MessageEntity>(createdMessage);
    } catch (error: any) {
      return Left<ErrorClass, MessageEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  async deleteMessage(
    loginId: string,
    id: string
  ): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.messageDataSource.deleteMsg(loginId, id); // Use the messages data source

      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e: any) {
      return Left<ErrorClass, void>(ApiError.customError(400, e.message));
    }
  }

  async updateMessage(
    loginId: string,
    id: string,
    data: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const updatedMessages = await this.messageDataSource.updateMsg(
        loginId,
        id,
        data
      ); // Use the Messages data source
      return Right<ErrorClass, MessageEntity>(updatedMessages);
    } catch (e) {
      return Left<ErrorClass, MessageEntity>(ApiError.badRequest());
    }
  }

  async getAllMessages(
    loginId: string,
    query: Query
  ): Promise<Either<ErrorClass, MessageEntity[]>> {
    try {
      const messages = await this.messageDataSource.getAll(
        loginId,
        query
      ); // Use the messages data source
      return Right<ErrorClass, MessageEntity[]>(messages);
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, MessageEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, MessageEntity[]>(ApiError.badRequest());
    }
  }

  async getMessageById(
    loginId: string,
    id: string
  ): Promise<Either<ErrorClass, MessageEntity>> {
    try {
      const messages = await this.messageDataSource.read(loginId, id); // Use the messages data source
      return messages
        ? Right<ErrorClass, MessageEntity>(messages)
        : Left<ErrorClass, MessageEntity>(ApiError.notFound());
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, MessageEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, MessageEntity>(ApiError.badRequest());
    }
  }
}
