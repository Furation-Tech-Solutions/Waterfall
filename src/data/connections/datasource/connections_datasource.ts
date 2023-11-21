import { Op, Sequelize } from "sequelize";
import { ConnectionsModel } from "@domain/connections/entities/connections_entities";
import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
  q: string;
  page: number;
  limit: number;
  toId: number;
}

// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {
  createReq(connections: ConnectionsModel): Promise<any>;
  updateReq(id: string, data: ConnectionsModel): Promise<any>;
  deleteReq(id: string): Promise<void>;
  read(id: string): Promise<any | null>;
  getAll(loginId: string, query: Query): Promise<any[]>;
}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
  constructor(private db: Sequelize) { }

  // Create a new connection
  async createReq(newConnection: any): Promise<any> {
    const existingConnection = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            fromId: newConnection.fromId,
            toId: newConnection.toId,
          },
          {
            fromId: newConnection.toId,
            toId: newConnection.fromId,
          },
        ],
      },
    });

    if (existingConnection) {
      throw ApiError.emailExist();
    }

    const createdConnections = await Connections.create(newConnection);
    return createdConnections.toJSON();
  }

  // Delete a connection
  async deleteReq(id: string): Promise<void> {
    const deletedConnection = await Connections.destroy({
      where: {
        id,
      },
    });

    if (deletedConnection === 0) {
      // Handle error if deletion was not successful
    }
  }

  // Retrieve a connection by ID
  async read(id: string): Promise<any | null> {
    const connections = await Connections.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Realtors,
          as: "fromRealtor",
          foreignKey: "fromId",
        },
        {
          model: Realtors,
          as: "toRealtor",
          foreignKey: "toId",
        },
      ],
    });

    return connections ? connections.toJSON() : null;
  }

  // Retrieve connections based on a query
  async getAll(loginId: string, query: Query): Promise<any[]> {
    const loginID = parseInt(loginId);
    const currentPage = query.page || 1;
    const itemsPerPage = query.limit || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    if (query.q === "connected") {
      // Retrieve connected connections
      const data = await Connections.findAll({
        where: {
          connected: true,
        },
        include: [
          {
            model: Realtors,
            as: "fromRealtor",
            foreignKey: "fromId",
          },
          {
            model: Realtors,
            as: "toRealtor",
            foreignKey: "toId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return data.map((connection: any) => connection.toJSON());
    } else if (query.q === "mutualfriends") {
      // Retrieve connections with mutual friends
      const friendId: number = query.toId;
      const findFriendIds = async (id: number) => {
        const data = await Connections.findAll({
          where: {
            connected: true,
            [Op.or]: [{ toId: id }, { fromId: id }],
          },
        });

        const friendIds: number[] = data
          .map((friend: any) =>
            friend.fromId === id ? friend.toId : friend.fromId
          )
          .filter((id: number | null) => id !== null);

        return friendIds;
      };

      const [myFriends, otherFriends] = await Promise.all([
        findFriendIds(loginID),
        findFriendIds(friendId),
      ]);

      const commonFriends: number[] = myFriends.filter((id: number) =>
        otherFriends.includes(id)
      );

      const friendsArray: any[] = await Promise.all(
        commonFriends.map(async (commonFriendId: number) => {
          const data: any = await Connections.findByPk(commonFriendId, {
            include: [
              {
                model: Realtors,
                as: "fromRealtor",
                foreignKey: "fromId",
              },
              {
                model: Realtors,
                as: "toRealtor",
                foreignKey: "toId",
              },
            ],
          });
          return data?.dataValues;
        })
      );

      return friendsArray.filter(Boolean);
    } else {
      // Retrieve all connections
      const data = await Connections.findAll({
        include: [
          {
            model: Realtors,
            as: "fromRealtor",
            foreignKey: "fromId",
          },
          {
            model: Realtors,
            as: "toRealtor",
            foreignKey: "toId",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return data.map((connection: any) => connection.toJSON());
    }
  }

  // Update a connection by ID
  async updateReq(
    id: string,
    updatedData: ConnectionsModel
  ): Promise<any> {
    const connection: any = await Connections.findOne({
      where: {
        id,
      },
    });

    await connection.update(updatedData);
    await connection.save();

    const updatedConnections = await Connections.findOne({
      where: {
        id,
      },
    });

    return updatedConnections ? updatedConnections.toJSON() : null;
  }
}
