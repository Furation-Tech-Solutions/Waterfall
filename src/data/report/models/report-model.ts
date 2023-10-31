// Import necessary dependencies
import { DataTypes } from "sequelize";
import {sequelize} from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model named "Report"
const Report = sequelize.define("Report", {
  // Define a field "fromRealtor" of type UUID, not nullable
  fromRealtor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: 'id' }
  },

  // Define a field "toRealtor" of type UUID, not nullable
  toRealtor: {
    type: DataTypes.INTEGER, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    references: { model: Realtors, key: 'id' }
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
