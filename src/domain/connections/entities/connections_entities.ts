// Express API request populate the ConnectionsModel
export class ConnectionsModel {
  constructor(
    public fromId: number = 0,
    public toId: number = 0,
    public from: {} = {},
    public to: {} = {},
    public connected: boolean = false

  ) { }
}

// ConnectionsEntity provided by Connections Repository is converted to Express API Response
export class ConnectionsEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public fromId: number,
    public toId: number,
    public connected: boolean,
    public from: {},
    public to: {},
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
        to: connectionData.to,
        from: connectionData.from
      };
      return connectionEntity;
    }
  }

  static toModel(connection: ConnectionsEntity): any {
    return {
      fromId: connection.fromId,
      toId: connection.toId,
      connected: connection.connected,
      from: connection.from,
      to: connection.to,
    };
  }
}
