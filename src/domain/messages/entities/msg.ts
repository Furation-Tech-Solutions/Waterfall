
export const messageTypeEnum = {
  TEXT: "Text",
  IMAGE: "Image",
  OTHERS: "Others",
};

export class MessageModel {
  constructor(
    public senderId: string = "",
    public receiverId: string = "",
    public connectionId: number = 0,
    public message: string = "",
    public messageType: string = "",
    public status: { senderId: string; receiverId: string }= {
      senderId: "Read",
      receiverId: "Unread",
    }
  ) {}
}

export class MessageEntity {
  constructor(
    public id: number | undefined = undefined,
    public senderId: string,
    public receiverId: string,
    public connectionId: number,
    public message: string,
    public messageType: string,
    public status: { senderId: string; receiverId: string },
  ) {}
}

export class MessageMapper {
  static toEntity(
    messageData: any,
    includeId?: boolean,
    existingMessage?: MessageEntity
  ): MessageEntity {
    if (existingMessage != null) {
      return {
        ...existingMessage,
        senderId: messageData.senderId ?? existingMessage.senderId,
        receiverId: messageData.receiverId ?? existingMessage.receiverId,
        connectionId: messageData.connectionId ?? existingMessage.connectionId,
        message: messageData.message ?? existingMessage.message,
        messageType: messageData.messageType ?? existingMessage.messageType,
        status: messageData.status ?? existingMessage.status,
      };
    } else {
      const messageEntity: MessageEntity = {
        id: includeId ? messageData.id ?? undefined : messageData.id,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        connectionId: messageData.connectionId,
        message: messageData.message,
        messageType: messageData.messageType,
        status: messageData.status,
      };
      return messageEntity;
    }
  }

  static toModel(message: MessageEntity): any {
    return {
      senderId: message.senderId,
      receiverId: message.receiverId,
      connectionId: message.connectionId,
      message: message.message,
      messageType: message.messageType,
      status: message.status,
    };
  }
}



// export { MessageModel, MessageEntity, MessageMapper };
