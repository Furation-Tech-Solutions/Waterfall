import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

export const statusEnum = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  DECLINE: "Decline",
};

const UpcomingTask = sequelize.define("UpcomingTask", {
  jobApplicant: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(statusEnum)),
    allowNull: false,
    defaultValue: "Pending",
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default UpcomingTask;
