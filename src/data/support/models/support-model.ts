// Import necessary dependencies
import { DataTypes } from "sequelize"; // Importing DataTypes from Sequelize for defining data types
import { sequelize } from "@main/sequelizeClient"; // Importing the Sequelize instance from the sequelizeClient module

import Realtors from "@data/realtors/model/realtor-model"; // Importing the Realtors model from the specified path

// Define a Sequelize model named "Support"
const Support = sequelize.define("Support", {
  // Define a "realtor" field with INTEGER data type, which cannot be null
  realtor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: 'id' } // Adding a foreign key constraint referencing the 'id' field in the Realtors model
  },
  // Define a "to" field with STRING data type, which cannot be null
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Define a "description" field with STRING data type, which cannot be null
  // and includes validation for length between 1 and 1000 characters
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
  // Define an "attachments" field as an ARRAY of STRING data type
  // This field is nullable, change to false if it should not be nullable
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL ARRAY type for attachments
    allowNull: true, // Change to false if it should not be nullable
  },
  // Define a "timestamp" field with DATE data type and a default value of the current date and time
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Establishing a foreign key relationship: Support belongs to Realtors
Support.belongsTo(Realtors, {
  foreignKey: "realtor", // Using the "realtor" field as the foreign key
  as: "realtorData", // Alias for the relation to access realtor data, e.g., supportInstance.realtorData
});

// Export the "Support" model
export default Support;
