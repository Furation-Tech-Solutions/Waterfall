import {
  MessageEntity,
  MessageModel,
} from "../entities/msg"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Query } from "@data/connections/datasource/connections_datasource";

export interface MessagesRepository {
  // Method to create a message entity
  createMessage(
    message: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>>;
  // Method to delete a message entity by its ID
  deleteMessage(loginId: string, id: string): Promise<Either<ErrorClass, void>>;
  getMessageById(
    loginId: string,
    id: string
  ): Promise<Either<ErrorClass, MessageEntity>>;
  updateMessage(
    loginId: string,
    id: string,
    data: MessageModel
  ): Promise<Either<ErrorClass, MessageEntity>>;
  getAllMessages(
    loginId: string,
    query: Query
  ): Promise<Either<ErrorClass, MessageEntity[]>>;
}
