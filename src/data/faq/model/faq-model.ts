// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";

// Define a Sequelize model called 'FAQs' with two string fields: 'question' and 'answer'
const FAQs = sequelize.define('FAQs', {
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.STRING, allowNull: false }
});

// Export the 'FAQs' model for use in other parts of the application
export default FAQs;
