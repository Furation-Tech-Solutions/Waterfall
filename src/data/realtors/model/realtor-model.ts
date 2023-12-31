// Import necessary dependencies
import { sequelize } from "@main/sequelizeClient";
import { DataTypes } from "sequelize";
// type Badge = {
//   badgeName: string;
//   timestamp: Date;
// };

// Define the Sequelize model for Realtors
const Realtors = sequelize.define("Realtors", {
  id: {
    type: DataTypes.STRING, // Use STRING type for the id field
    primaryKey: true,
  },
  // Define the "firstName" field with a data type of STRING
  firstName: {
    type: DataTypes.STRING,
    // allowNull: true, // It cannot be null
    validate: {
      len: [3, 30], // Validate length between 3 and 30 characters
    },
  },
  // Define the "lastName" field with a data type of STRING
  lastName: {
    type: DataTypes.STRING,
    // allowNull: true, // It cannot be null
    validate: {
      len: [3, 30], // Validate length between 3 and 30 characters
    },
  },
  // Define the "email" field with a data type of STRING
  email: {
    type: DataTypes.STRING,
    allowNull: false, // It cannot be null
    unique: true, // It must be unique
    set(value: String) {
      // Set the email field to lowercase before validation
      this.setDataValue("email", value.toLowerCase());
    },
  },
  // Define the "contact" field with a data type of STRING
  contact: {
    type: DataTypes.STRING,
    allowNull: true, // It cannot be null
    unique: true, // It must be uniquevalidate: {
    // validate: {
    //   len: [10, 14], // Validate length between 3 and 30 characters
    // },
  },
  // Define the "DOB" field with a data type of STRING
  DOB: {
    type: DataTypes.STRING,
    allowNull: true, // It cannot be null
  },
  // Define the "gender" field with a data type of STRING
  gender: {
    type: DataTypes.STRING,
    allowNull: false, // It cannot be null
  },
  // Define the "location" field with a data type of STRING
  location: {
    type: DataTypes.STRING,
    allowNull: true, // It cannot be null
    defaultValue: 'ontario',
  },
  // Define the "about" field with a data type of STRING
  about: {
    type: DataTypes.STRING,
    allowNull: true, // It cannot be null
  },
  // Define the "profileImage" field with a data type of STRING
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true, // It cannot be null
  },
  // Define the "countryCode" field with a data type of INTEGER
  countryCode: {
    type: DataTypes.INTEGER,
    allowNull: true, // It cannot be null
    validate: {
      len: [0, 15], // Validate length between 0 and 15 characters
    },
  },
  // Define the "coordinates" field with a data type of JSONB
  coordinates: {
    type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
    allowNull: true, // Set to allowNull: true if coordinates are optional
  },
  recoId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  linkedIn: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  attachmentLink: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  licenseExpirationDate: {
    type: DataTypes.STRING, // Adjust the type based on your requirements
    defaultValue: "",
  },
  deletedStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  badge: {
    type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
    allowNull: true, // Set to allowNull: true if coordinates are optional
    defaultValue: []
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reportCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  firebaseDeviceToken: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  connectedAccountId: {
    type: DataTypes.STRING,
    defaultValue: ""
  }
});

export default Realtors; // Export the Realtors model as the default export
