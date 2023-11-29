// Import necessary dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model named "Report"
const Report = sequelize.define("Report", {
  // Define a field "fromRealtor" of type INTEGER (assuming it's an ID), not nullable
  fromRealtor: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference to the 'id' field in the 'Realtors' model
  },

  // Define a field "toRealtor" of type INTEGER (assuming it's an ID), not nullable
  toRealtor: {
    type: DataTypes.STRING, // Assuming 'Realtor' is represented by INTEGER in PostgreSQL
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference to the 'id' field in the 'Realtors' model
  },

  // Define a field "description" of type STRING, not nullable
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 1000], // Validation to ensure the length is between 1 and 1000 characters
        msg: "Description length must be between 1 and 1000 characters",
      },
    },
  },

  // Define a field "reportTimestamp" of type DATE with a default value of the current timestamp
  reportTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Default value is the current timestamp
  },
});

// Establish associations
Report.belongsTo(Realtors, {
  foreignKey: "fromRealtor",
  as: "fromRealtorData",
});
Report.belongsTo(Realtors, { foreignKey: "toRealtor", as: "toRealtorData" });

// Export the "Report" model as the default export of this module
export default Report;
