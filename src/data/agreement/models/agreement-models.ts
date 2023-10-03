import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

export const statusEnum = {
  ACCEPT: "Accept",
  PENDING: "Pending",
  DECLINE: "Decline",
};

const Agreement = sequelize.define("Agreement", {
  jobApplicant: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },
  Agree: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(statusEnum)),
    allowNull: false,
    defaultValue: "Pending",
  },
  agreementTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default Agreement;
