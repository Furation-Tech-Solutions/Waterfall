// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model named "Report"
const Report = sequelize.define("Report", {
  // Define a field "fromRealtor" of type UUID, not nullable
  fromRealtor: {
    type: DataTypes.UUID,
    allowNull: false,
    // Uncomment and configure references if needed
    // references: {
    //   model: "Realtors", // Make sure this matches your "Realtors" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

  // Define a field "toRealtor" of type UUID, not nullable
  toRealtor: {
    type: DataTypes.UUID, // Assuming 'Realtor' is represented by UUID in PostgreSQL
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

// Immediately invoked function to synchronize the Sequelize model with the database
// (async () => {
//   await sequelize.sync({ force: false }); // Set  to drop and recreate tables
//   // Code to run after synchronization can be added here
// })();

// Export the "Report" model as the default export of this module
export default Report;
