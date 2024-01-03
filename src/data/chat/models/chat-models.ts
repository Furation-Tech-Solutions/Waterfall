import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Message from "@data/messages/model/msg-model";

const Chat = sequelize.define("Chat", {
  // Define the 'sender' field
  userOne: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  // Define the 'receiver' field
  userTwo: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  lastMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastMessageTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  chatMessageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

});

// Establish associations with the 'Realtors' model using foreign keys
Chat.belongsTo(Realtors, { foreignKey: "userOne", as: "userOneData" });
Chat.belongsTo(Realtors, { foreignKey: "userTwo", as: "userTwoData" });
Chat.hasMany(Realtors, { foreignKey: "userOne", as: "user1Data" });
Chat.hasMany(Realtors, { foreignKey: "userTwo", as: "user2Data" });



export default Chat;


