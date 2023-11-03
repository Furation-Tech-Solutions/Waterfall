// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
const Message = sequelize.define('Message', {
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Message.belongsTo(Realtors, { foreignKey: "sender", as: "senderData" });
Message.belongsTo(Realtors, { foreignKey: "receiver", as: "ReceiverData" });

// Export the 'Message' model for use in other parts of the application
export default Message;


