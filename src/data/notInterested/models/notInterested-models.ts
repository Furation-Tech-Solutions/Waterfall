// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model named "NotInterested"
const NotInterested = sequelize.define("NotInterested", {
  // Define a field "Realtor" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  Realtor: {
    type: DataTypes.STRING,
    allowNull: false, // The field cannot be null
  },

  // Define a field "Job" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  Job: {
    type: DataTypes.STRING,
    allowNull: false, // The field cannot be null
  },
});

// Export the "NotInterested" model as the default export
export default NotInterested;
