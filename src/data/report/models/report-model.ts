// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model named "Report"
const Report = sequelize.define("Report", {
  // Define a field "fromRealtor" of type INTEGER, not nullable
  fromRealtor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Uncomment and configure references if needed
    // references: {
    //   model: "Realtors", // Make sure this matches your "Realtors" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

  // Define a field "toRealtor" of type INTEGER, not nullable
  toRealtor: {
    type: DataTypes.INTEGER, // Assuming 'Realtor' is represented by INTEGER in PostgreSQL
    allowNull: false,
    // Uncomment and configure references if needed
    // references: {
    //   model: "Realtors", // Replace with the actual name of the 'Realtor' table
    //   key: "id", // Replace with the actual primary key of the 'Realtor' table
    // },
  },

  // Define a field "description" of type STRING, not nullable
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

  // Define a field "reportTimestamp" of type DATE with a default value of the current timestamp
  reportTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Export the "Report" model as the default export of this module
export default Report;
