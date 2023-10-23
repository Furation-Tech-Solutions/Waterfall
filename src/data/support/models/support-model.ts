// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model named "Support"
const Support = sequelize.define("Support", {
  // Define a "realtor" field with UUID data type, which cannot be null
  realtor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: 'id' }
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
Realtors.hasMany(Support);
Support.belongsTo(Realtors, {
  foreignKey: "realtor",
  as: "realtorData",
});
// Export the "Support" model
export default Support;
