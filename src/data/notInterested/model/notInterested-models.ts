// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import { notInterestedRouter } from "@presentation/routes/notInterested-routes";

// Define a Sequelize model named "NotInterested"
const NotInterested = sequelize.define("NotInterested", {
  // Define a field "Realtor" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  realtor: {
    type: DataTypes.INTEGER, // Data type for jobOwner is UUID
    allowNull: false, // It cannot be null
    references: { model: Realtors, key: "id" },
  },
  // Define a field "Job" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  job: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },
  },
});

Realtors.hasMany(NotInterested);
NotInterested.belongsTo(Realtors, {
  foreignKey: "realtor",
  as: "realtorData",
});
NotInterested.belongsTo(Job, {
  foreignKey: "job",
  as: "jobData",
});

// notInterestedRouter.belongsTo(realtor, { foreignKey: 'fromId', as: 'fromRealtor' });
// Connections.belongsTo(Realtors, { foreignKey: 'toId', as: 'toRealtor' });

// Export the "NotInterested" model as the default export
export default NotInterested;
