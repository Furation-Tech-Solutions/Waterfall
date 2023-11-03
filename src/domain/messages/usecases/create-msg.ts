// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { MessageEntity, MessageModel } from "../entities/msg"; // Import the MessagesModel and MessagesEntity
import { MessagesRepository } from "../repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";

// Define the interface for the Createmessages use case
export interface CreateMessagesUsecase {
  execute: (messagesData: MessageModel) => Promise<Either<ErrorClass, MessageEntity>>;
}

// Implement the Createmessages use case
export class CreateMessages implements CreateMessagesUsecase {
  private readonly messagesRepository: MessagesRepository;

  // Constructor to initialize the MessagesRepository
  constructor(messagesRepository: MessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  // Implementation of the execute method
  // This method takes messageModel data and returns a Promise with an Either result
  async execute(messageData: MessageModel): Promise<Either<ErrorClass, MessageEntity>> {
    // Delegate the creation of messages to the messagesRepository
    return await this.messagesRepository.createMessage(messageData);
  }
}
