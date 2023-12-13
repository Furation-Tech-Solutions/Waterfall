// Import necessary modules and dependencies
import { DataTypes } from 'sequelize';
import { sequelize } from '@main/sequelizeClient';

import Realtors from '@data/realtors/model/realtor-model';
import Job from '@data/job/models/job-model';

// Define a Sequelize model called 'FeedBacks' with several fields
const FeedBacks = sequelize.define("FeedBacks", {
  fromRealtorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },
  toRealtorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { len: [1, 5] }, // Validation rule for the 'rating' field
  },
  description: { type: DataTypes.STRING, allowNull: false },
});

// Establish associations with the Realtors and Job models using foreign keys
FeedBacks.belongsTo(Realtors, {
  foreignKey: "fromRealtorId",
  as: "fromRealtorIdData",
});
FeedBacks.belongsTo(Realtors, {
  foreignKey: "toRealtorId",
  as: "toRealtorIdData",
});
FeedBacks.belongsTo(Job, { foreignKey: "jobId", as: "jobIdData" });

// Export the 'FeedBacks' model for use in other parts of the application
export default FeedBacks;
