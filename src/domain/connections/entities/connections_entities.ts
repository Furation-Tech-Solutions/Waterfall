// Express API request populate the ConnectionsModel
export class ConnectionsModel {
  constructor(
    public fromId: string = "",
    public toId: string = "",
    public fromData: {} = {},
    public toData: {} = {},
    public connected: boolean = false
  ) {}
}

// ConnectionsEntity provided by Connections Repository is converted to Express API Response
export class ConnectionsEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public fromId: string,
    public toId: string,
    public connected: boolean,
    public fromData: {},
    public toData: {}
  ) {}
}

/* ConnectionsMapper provided by Connections Repository is converted to Express API Response */
export class ConnectionMapper {
  static toEntity(
    connectionData: any,
    includeId?: boolean,
    existingConnection?: ConnectionsEntity
  ): ConnectionsEntity {
    if (existingConnection != null) {
      // Update the existing connection or maintain previous values
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
      // Create a new ConnectionsEntity
      const connectionEntity: ConnectionsEntity = {
        id: includeId
          ? connectionData.id
            ? connectionData.id
            : undefined
          : connectionData.id,
        fromId: connectionData.fromId,
        toId: connectionData.toId,
        connected: connectionData.connected,
        toData: connectionData.toData,
        fromData: connectionData.fromData,
      };
      return connectionEntity;
    }
  }

  static toModel(connection: ConnectionsEntity): any {
    // Map ConnectionsEntity to an object compatible with the model
    return {
      fromId: connection.fromId,
      toId: connection.toId,
      connected: connection.connected,
      fromData: connection.fromData,
      toData: connection.toData,
    };
  }
}
