import { Op, Sequelize, where } from "sequelize";
import { ConnectionsEntity, ConnectionMapper, ConnectionsModel } from "@domain/connections/entities/connections_entities";

import Connections from "../models/connections_model";
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";
import { connections } from "mongoose";
import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import Blocking from "@data/blocking/model/blocking-model";
import Message from "@data/messages/model/msg-model";

// Define a JobApplicantQuery object to encapsulate parameters
export interface Query {
  q: string;
  page: number;
  limit: number;
  toId: string;
}


// Create ConnectionsDataSource Interface
export interface ConnectionsDataSource {

  createReq(connections: any): Promise<ConnectionsEntity>;
  updateReq(id: string, loginId: string, data: any): Promise<ConnectionsEntity>;
  deleteReq(id: string, loginId: string): Promise<void>;
  read(id: string): Promise<ConnectionsEntity>;
  check(id: string, loginId: string): Promise<ConnectionsEntity>;
  getAll(loginId: string, query: Query): Promise<ConnectionsEntity[]>;
}

// Connections Data Source communicates with the database
export class ConnectionsDataSourceImpl implements ConnectionsDataSource {
  constructor(private db: Sequelize) {}

  // Create a new connection
  async createReq(newConnection: any): Promise<ConnectionsEntity> {
    if (newConnection.fromId === newConnection.toId) {
      throw new Error(
        "Connection cannot be created as sender and receiver are same."
      );
    }

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

    const isBlocked = await Blocking.findOne({
      where: {
        [Op.or]: [
          {
            fromRealtorId: newConnection.fromId,
            toRealtorId: newConnection.toId,
          },
          {
            fromRealtorId: newConnection.toId,
            toRealtorId: newConnection.fromId,
          },
        ],
      },
    });

    if (isBlocked) {
      throw new Error(
        "Connection cannot be created as sender or receiver is blocked."
      );
    }

    const createdConnections = await Connections.create(newConnection);

    return createdConnections.toJSON();
  }

  // Delete a connection
  async deleteReq(id: string, loginId: string): Promise<void> {

    // Find the connection to be deleted
    const connection: any = await Connections.findOne({
      where: {
        [Op.or]: [
          { toId: id, fromId: loginId },
          { fromId: id, toId: loginId },
        ],
      },
    });
    if (!connection) {
      // Handle error if the connection is not found
      throw ApiError.notFound();
    }

    // Manually delete associated messages
    await Message.destroy({
      where: {
        connectionId: connection.id as number, // Assuming 'id' is of type number
      },
    });

    // Use Sequelize's destroy method to delete the connection
    await connection.destroy();
  }

  // Retrieve a connection by ID
  async read(id: string): Promise<ConnectionsEntity> {
    const connections = await Connections.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Realtors,
          as: "fromData",
          foreignKey: "fromId",
        },
        {
          model: Realtors,
          as: "toData",
          foreignKey: "toId",
        },
        {
          model: Message,
          as: "messagesData", // Include the associated applicants' data
        },
      ],
    });
    if (connections === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return connections.toJSON();
  }

  // Retrieve a connection by ID
  async check(id: string, loginId: string): Promise<ConnectionsEntity> {
    // console.log(id,loginId);
    const connections = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            toId: id,
            fromId: loginId,
          },
          {
            fromId: id,
            toId: loginId,
          },
        ],
      },
    });

    if (connections === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return connections.toJSON();
  }

  // Retrieve connections based on a query
  async getAll(
    loginId: string,
    query: Query
  ): Promise<ConnectionsEntity[] | any[]> {
    const loginID = loginId;
    const currentPage = query.page || 1;
    const itemsPerPage = query.limit || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    // console.log(loginID, query);
    if (query.q === "connected") {
      // Retrieve connected connections
      // const data = await Connections.findAll({
      //   where: {
      //     connected: true,
      //     [Op.or]: [{ toId: loginID }, { fromId: loginID }],
      //   },
      //   include: [
      //     {
      //       model: Realtors,
      //       as: "fromData",
      //       foreignKey: "fromId",
      //     },
      //     {
      //       model: Realtors,
      //       as: "toData",
      //       foreignKey: "toId",
      //     },
      //   ],
      //   limit: itemsPerPage,
      //   offset: offset,
      // });
      // console.log(data);
      const findFriendIds = async (id: string) => {
        const data = await Connections.findAll({
          where: {
            connected: true,
            [Op.or]: [{ toId: id }, { fromId: id }],
          },
        });
        // console.log(data, "data"); //working

        const friendIds: string[] = data
          .map((friend: any) =>
            friend.fromId === id ? friend.toId : friend.fromId
          )
          .filter((id: string | null) => id !== null);
        console.log(friendIds, "friendIds from 199"); // working
        return friendIds;
      };

      const [myFriends] = await Promise.all([findFriendIds(loginID)]);

      const friendsArray: any[] = await Promise.all(
        myFriends.map(async (friendId: string) => {
          // console.log(commonFriendId, "inside"); // working
          const data: any = await Realtors.findByPk(friendId);
          // console.log(data, "datavalue");
          return data?.dataValues;
        })
      );
      // console.log(friendsArray, "friendsarray");
      return friendsArray.filter(Boolean);

      // return data.map((connection: any) => connection.toJSON());
    } else if (query.q === "requests") {
      // Retrieve Request list
      // console.log(loginID);
      // const data = await Connections.findAll({
      //   where: {
      //     connected: false,
      //     toId: loginID,
      //   },
      //   include: [
      //     {
      //       model: Realtors,
      //       as: "fromData",
      //       foreignKey: "fromId",
      //     },
      //     {
      //       model: Realtors,
      //       as: "toData",
      //       foreignKey: "toId",
      //     },
      //   ],
      //   limit: itemsPerPage,
      //   offset: offset,
      // });

      const findFriendIds = async (id: string) => {
        const data = await Connections.findAll({
          where: {
            connected: false,
            [Op.or]: [{ toId: id }, { fromId: id }],
          },
        });
        // console.log(data, "data"); //working

        const friendIds: string[] = data
          .map((friend: any) =>
            friend.fromId === id ? friend.toId : friend.fromId
          )
          .filter((id: string | null) => id !== null);
        // console.log(friendIds, "friendIds from 199");// working
        return friendIds;
      };

      const [myFriends] = await Promise.all([findFriendIds(loginID)]);

      const friendsArray: any[] = await Promise.all(
        myFriends.map(async (friendId: string) => {
          // console.log(commonFriendId, "inside"); // working
          const data: any = await Realtors.findByPk(friendId);
          // console.log(data, "datavalue");
          return data?.dataValues;
        })
      );
      console.log(friendsArray, "friendsarray");
      return friendsArray.filter(Boolean);

      // console.log(data, "Dddddddddddddd")
      // return data.map((connection: any) => connection.toJSON());
    } else if (query.q === "mutualfriends") {
      // Retrieve connections with mutual friends
      const friendId: string = query.toId;
      // console.log(friendId, "friendId from 123");
      // console.log(loginID, "login id from 124");
      const findFriendIds = async (id: string) => {
        const data = await Connections.findAll({
          where: {
            connected: true,
            [Op.or]: [{ toId: id }, { fromId: id }],
          },
        });
        // console.log(data, "data"); //working

        const friendIds: string[] = data
          .map((friend: any) =>
            friend.fromId === id ? friend.toId : friend.fromId
          )
          .filter((id: string | null) => id !== null);
        // console.log(friendIds, "friendIds from 199");// working
        return friendIds;
      };

      const [myFriends, otherFriends] = await Promise.all([
        findFriendIds(loginID),
        findFriendIds(friendId),
      ]);
      // console.log(myFriends, "myfriends  from 146");
      // console.log(otherFriends, "myfriends  from 147");

      const commonFriends: string[] = myFriends.filter((id: string) =>
        otherFriends.includes(id)
      );
      // console.log(commonFriends, "common");
      const friendsArray: any[] = await Promise.all(
        commonFriends.map(async (commonFriendId: string) => {
          // console.log(commonFriendId, "inside"); // working
          const data: any = await Realtors.findByPk(commonFriendId);
          // console.log(data, "datavalue");
          return data?.dataValues;
        })
      );
      // console.log(friendsArray, "friendsarray");
      return friendsArray.filter(Boolean);
    } else if (query.q === "connection-suggestions") {
      // loginID;
      // Retrieve connected connections
      // console.log(loginID);
      // const user: any = await Realtors.findByPk(loginID);
      const user: any = await Realtors.findOne({
        where: { id: loginID, deletedStatus: false },
      });
      // console.log(user.id, "user");
      const findFriendIds = async (id: string) => {
        const data = await Connections.findAll({
          where: {
            connected: true,
            [Op.or]: [{ toId: id }, { fromId: id }],
          },
        });
        // console.log(data,"data"); working

        const friendIds: number[] = data
          .map((friend: any) =>
            friend.fromId === id ? friend.toId : friend.fromId
          )
          .filter((id: number | null) => id !== null);
        // console.log(friendIds, "friendIds from 140");// working
        return friendIds;
      };

      const [myFriends] = await Promise.all([findFriendIds(loginID)]);
      // console.log(myFriends);

      // Get suggestions based on mutual friends and location
      const suggestions = await Realtors.findAll({
        where: {
          id: {
            [Op.not]: loginID, // Exclude the current user
            [Op.notIn]: myFriends.map((friend: any) => friend), // Exclude existing friends
          },
          deletedStatus: false,
          // location: user.location
        },
      });
      // console.log(suggestions,"---------");
      return suggestions.map((connection: any) => connection.toJSON());
    } else {
      // Retrieve all connections
      const data = await Connections.findAll({
        include: [
          {
            model: Realtors,
            as: "fromData",
            foreignKey: "fromId",
          },
          {
            model: Realtors,
            as: "toData",
            foreignKey: "toId",
          },
          {
            model: Message,
            as: "messagesData", // Include the associated applicants' data
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });
      console.log(data);

      return data.map((connection: any) => connection.toJSON());
    }
  }

  // Update a connection by ID
  async updateReq(
    id: string,
    loginId: string,
    updatedData: any
  ): Promise<ConnectionsEntity> {
    // console.log(id, loginId, updatedData);
    const connection: any = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            toId: id,
            fromId: loginId,
          },
          {
            fromId: id,
            toId: loginId,
          },
        ],
      },
    });

    await connection.update(updatedData);
    await connection.save();

    const updatedConnections = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            toId: id,
            fromId: loginId,
          },
          {
            fromId: id,
            toId: loginId,
          },
        ],
      },
    });

    if (updatedConnections == null) {
      throw ApiError.notFound();
    }
    return updatedConnections.toJSON();
  }
}
