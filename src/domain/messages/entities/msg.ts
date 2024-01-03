// Define a class for the MessageModel, representing the structure of data sent in Express API requests
export class MessageModel {
  constructor(
    public chatId: string = "",
    public message: string = "",
    public seen: boolean=false,
  ) {}
}

// Define a class for the MessageEntity, representing data provided by the Message Repository and converted to an Express API response
export class MessageEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public chatId: string,
    public message: string,
    public seen: boolean,
    public chatData: {}
  ) {}
}

// Define a MessageMapper class to handle the mapping between MessageModel and MessageEntity
export class MessageMapper {
  static toEntity(
    messageData: any,
    includeId?: boolean,
    existingMessage?: MessageEntity
  ): MessageEntity {
    if (existingMessage != null) {
      // If existingMessage is provided, merge the data from messageData with the existingMessage
      return {
        ...existingMessage,
        chatId:
          messageData.chatId !== undefined
            ? messageData.chatId
            : existingMessage.chatId,
        message:
          messageData.message !== undefined
            ? messageData.message
            : existingMessage.message,
        seen:
          messageData.seen !== undefined
            ? messageData.seen
            : existingMessage.seen,
      };
    } else {
      // If existingMessage is not provided, create a new MessageEntity using messageData
      const messageEntity: MessageEntity = {
        id: includeId
          ? messageData.id
            ? messageData.id
            : undefined
          : messageData.id,
        chatId: messageData.chatId,
        message: messageData.message,
        seen: messageData.seen,
        chatData: messageData.chatData,
      };
      return messageEntity;
    }
  }

  // Convert a MessageEntity to a format suitable for a model
  static toModel(message: MessageEntity): any {
    return {
      chatId: message.chatId,
      message: message.message,
      seen: message.seen,
      chatData: message.chatData,
    };
  }
}
