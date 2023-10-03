import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

const Agreement = sequelize.define("Agreement", {
  Realtor: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },

  Job: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default Agreement;
