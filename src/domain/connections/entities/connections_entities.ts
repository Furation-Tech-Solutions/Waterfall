// Express API request populate the ConnectionsModel
export class ConnectionsModel {
  constructor(
    public fromId: number = 0,
    public toId: number = 0,
    public connected: boolean = false,
    public sentByMe: boolean = false
  ) { }
}

// ConnectionsEntity provided by Connections Repository is converted to Express API Response
export class ConnectionsEntity {
  constructor(
    public id: string | undefined = undefined, // Set a default value for id
    public fromId: number,
    public toId: number,
    public connected: boolean,
    public sentByMe: boolean,
  ) { }
}

/* ConnectionsMapper provided by Connections Repository is converted to Express API Response */
export class ConnectionMapper {
  static toEntity(
    connectionData: any,
    includeId?: boolean,
    existingConnection?: ConnectionsEntity
  ): ConnectionsEntity {
    if (existingConnection != null) {
      return {
        ...existingConnection,
        fromId:
          connectionData.fromId !== undefined
            ? connectionData.fromId
            : existingConnection.fromId,
        toId:
          connectionData.toId !== undefined
            ? connectionData.toId
            : existingConnection.toId,
        connected:
          connectionData.connected !== undefined
            ? connectionData.connected
            : existingConnection.connected,
        sentByMe:
          connectionData.sentByMe !== undefined
            ? connectionData.sentByMe
            : existingConnection.sentByMe,
      };
    } else {
      const connectionEntity: ConnectionsEntity = {
        id: includeId
          ? connectionData.id
            ? connectionData.id
            : undefined
          : connectionData.id,
        fromId: connectionData.fromId,
        toId: connectionData.toId,
        connected: connectionData.connected,
        sentByMe: connectionData.sentByMe,
      };
      return connectionEntity;
    }
  }

  static toModel(connection: ConnectionsEntity): any {
    return {
      fromId: connection.fromId,
      toId: connection.toId,
      connected: connection.connected,
      sentByMe: connection.sentByMe,
    };
  }
}
