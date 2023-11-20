import { ErrorClass } from "@presentation/error-handling/api-error";
import { MessageEntity, MessageModel } from "../entities/msg"; // Import the MessagesModel and MessagesEntity
import { MessagesRepository } from "../repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";

export interface GetByIdMessageUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, MessageEntity>>;
}

export class GetByIdMessage implements GetByIdMessageUsecase {
  private readonly messagesRepository: MessagesRepository;

  constructor(messagesRepository: MessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, MessageEntity>> {
    return await this.messagesRepository.getMessageById(id);
  }
}

