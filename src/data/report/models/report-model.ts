import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

const Report = sequelize.define("Report", {
  fromRealtor: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: "Realtors", // Make sure this matches your "Jobs" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

  toRealtor: {
    type: DataTypes.UUID, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    // references: {
    //   model: "Realtors", // Replace with the actual name of the 'Realtor' table
    //   key: "id", // Replace with the actual primary key of the 'Realtor' table
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
  reportTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default Report;
