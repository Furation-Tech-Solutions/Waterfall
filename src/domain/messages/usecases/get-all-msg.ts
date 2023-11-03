// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { MessageEntity, MessageModel } from "../entities/msg"; // Import the MessagesModel and MessagesEntity
import { MessagesRepository } from "../repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";
import { Query } from "@data/messages/datasources/msg-datasource";

// Define the interface for the GetAllmessages use case
export interface GetAllMessageUsecase {
  // Method to fetch all messages
  execute: (
    loginId: string,
    query: Query
  ) => Promise<Either<ErrorClass, MessageEntity[]>>;
}

// Implement the GetAllmessages use case
export class GetAllMessage implements GetAllMessageUsecase {
  private readonly messagesRepository: MessagesRepository;

  // Constructor to initialize the MessagesRepository
  constructor(messagesRepository: MessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  // Implementation of the execute method
  // This method retrieves all messages and returns a Promise with an Either result
  async execute(
    loginId: string,
    query: Query
  ): Promise<Either<ErrorClass, MessageEntity[]>> {
    // Delegate the retrieval of all messages to the messagesRepository
    return await this.messagesRepository.getAllMessages(loginId, query);
  }
}
