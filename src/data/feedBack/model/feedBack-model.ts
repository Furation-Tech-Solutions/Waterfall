// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";

// Define a Sequelize model called 'FeedBacks' with several fields
const FeedBacks = sequelize.define('FeedBacks', {
  fromRealtor: { type: DataTypes.INTEGER, allowNull: false, references: { model: Realtors, key: 'id' } },
  toRealtor: { type: DataTypes.INTEGER, allowNull: false, references: { model: Realtors, key: 'id' } },
  jobId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Jobs, key: 'id' } },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { len: [1, 5] } // Validation rule for the 'rating' field
  },
  description: { type: DataTypes.STRING, allowNull: false }
});

// Export the 'FeedBacks' model for use in other parts of the application
export default FeedBacks;
