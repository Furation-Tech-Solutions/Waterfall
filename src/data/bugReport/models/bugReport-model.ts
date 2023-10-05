import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

const BugReport = sequelize.define("BugReport", {
  realtor: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: "Realtors", // Make sure this matches your "Jobs" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

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
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL ARRAY type for attachments
    allowNull: true, // Change to false if it should not be nullable
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default BugReport;
