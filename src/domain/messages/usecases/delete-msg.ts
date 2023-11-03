// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { MessageEntity, MessageModel } from "../entities/msg"; // Import the MessagesModel and MessagesEntity
import { MessagesRepository } from "../repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";

// Define the interface for the DeleteMessages use case
export interface DeleteMessagesUsecase {
  execute: (fromId: string, toId: string) => Promise<Either<ErrorClass, void>>;
}

// Implement the Deletemessages use case
export class DeleteMessage implements DeleteMessagesUsecase {
  private readonly messagesRepository: MessagesRepository;

  // Constructor to initialize the messagesRepository
  constructor(messagesRepository: MessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  // Implementation of the execute method
  // This method takes an ID and returns a Promise with an Either result
  async execute(loginId: string, id: string): Promise<Either<ErrorClass, void>> {
    // Delegate the deletion of messages to the messagesRepository
    return await this.messagesRepository.deleteMessage(loginId, id);
  }
}
