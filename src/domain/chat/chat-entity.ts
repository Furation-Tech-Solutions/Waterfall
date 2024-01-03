
export class ChatModel {
    
    constructor(
      public userOne: string = "",
      public userTwo: string = "",
      public lastMessage: string | null = null,
      public lastMessageTime: Date | null = null,
      public chatMessageCount: number = 0,
    ) {}
  }

  
  export class ChatEntity {
    constructor(
      public id: number | undefined = undefined,
      public userOne: string,
      public userTwo: string,
      public lastMessage: string | null,
      public lastMessageTime: Date | null,
      public chatMessageCount: number,
      public chatData: {}
    ) {}
  }

  export class ChatMapper {
    static toEntity(
      chatData: any,
      includeId?: boolean,
      existingChat?: ChatEntity
    ): ChatEntity {
      if (existingChat != null) {
        // If existingChat is provided, merge the data from chatData with the existingChat
        return {
          ...existingChat,
          userOne:
            chatData.userOne !== undefined
              ? chatData.userOne
              : existingChat.userOne,
          userTwo:
            chatData.userTwo !== undefined
              ? chatData.userTwo
              : existingChat.userTwo,
          lastMessage:
            chatData.lastMessage !== undefined
              ? chatData.lastMessage
              : existingChat.lastMessage,
          lastMessageTime:
            chatData.lastMessageTime !== undefined
              ? chatData.lastMessageTime
              : existingChat.lastMessageTime,
          chatMessageCount:
            chatData.chatMessageCount !== undefined
              ? chatData.chatMessageCount
              : existingChat.chatMessageCount,
          chatData: chatData.chatData || existingChat.chatData,
        };
      } else {
        // If existingChat is not provided, create a new ChatEntity using chatData
        const chatEntity: ChatEntity = {
          id: includeId
            ? chatData.id !== undefined
              ? chatData.id
              : undefined
            : chatData.id,
          userOne: chatData.userOne,
          userTwo: chatData.userTwo,
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime,
          chatMessageCount: chatData.chatMessageCount,
          chatData: chatData.chatData,
        };
        return chatEntity;
      }
    }

    static toModel(chatData: ChatEntity): any {
        return {
            userOne: chatData.userOne,
            userTwo: chatData.userTwo,
            lastMessage: chatData.lastMessage,
            lastMessageTime: chatData.lastMessageTime,
            chatMessageCount: chatData.chatMessageCount,
            chatData: chatData.chatData,
        };
      }
  }