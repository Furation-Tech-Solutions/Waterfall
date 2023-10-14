// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called 'FeedBacks' with several fields
const FeedBacks = sequelize.define('FeedBacks', {
  fromRealtor: { type: DataTypes.STRING, allowNull: false },
  toRealtor: { type: DataTypes.STRING, allowNull: false },
  jobId: { type: DataTypes.STRING, allowNull: false },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { len: [1, 5] } // Validation rule for the 'rating' field
  },
  description: { type: DataTypes.STRING, allowNull: false }
});

// Export the 'FeedBacks' model for use in other parts of the application
export default FeedBacks;
