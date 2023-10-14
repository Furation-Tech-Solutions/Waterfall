// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called "BugReport"
const BugReport = sequelize.define("BugReport", {
  // Define a field "realtor" of type UUID and make it non-nullable
  realtor: {
    type: DataTypes.UUID,
    allowNull: false,
    // You can optionally add references to another model here if needed
  },

  // Define a field "description" of type STRING, make it non-nullable,
  // and add validation to ensure its length is between 1 and 1000 characters
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 1000],
        msg: "Description length must be between 1 and 1000 characters",
      },
    },
  },

  // Define a field "attachments" of type ARRAY of STRINGS (PostgreSQL ARRAY type)
  // This field is nullable, but you can change it to false if it should not be nullable
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },

  // Define a field "timestamp" of type DATE with a default value of the current timestamp
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Export the "BugReport" model for use in other parts of the application
export default BugReport;
