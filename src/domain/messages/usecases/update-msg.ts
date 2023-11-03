import { ErrorClass } from "@presentation/error-handling/api-error";
import { MessageEntity, MessageModel } from "../entities/msg"; // Import the MessagesModel and MessagesEntity
import { MessagesRepository } from "../repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";

export interface UpdateMessageUsecase {
  execute: (
    loginId: string,
    id: string,
    Data: MessageEntity
  ) => Promise<Either<ErrorClass, MessageEntity>>;
}

export class UpdateMessage implements UpdateMessageUsecase {
  private readonly messagesRepository: MessagesRepository;

  constructor(messagesRepository: MessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  async execute(
    loginId: string,
    id: string,
    Data: MessageEntity
  ): Promise<Either<ErrorClass, MessageEntity>> {
    return await this.messagesRepository.updateMessage(loginId, id, Data);
  }
}
