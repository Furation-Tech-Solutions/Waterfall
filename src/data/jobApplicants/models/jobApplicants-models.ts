import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

export const statusEnum = {
  ACCEPT: "Accept",
  PENDING: "Pending",
  DECLINE: "Decline",
};
export const jobStatusEnum = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  DECLINE: "Decline",
};
const JobApplicant = sequelize.define("JobApplicant", {
  job: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: "Job", // Make sure this matches your "Jobs" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

  applicant: {
    type: DataTypes.UUID, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    // references: {
    //   model: "Realtor", // Replace with the actual name of the 'Realtor' table
    //   key: "id", // Replace with the actual primary key of the 'Realtor' table
    // },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
    validate: {
      isIn: {
        args: [Object.values(statusEnum)],
        msg: "Invalid status",
      },
    },
  },
  agreement: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  jobStatus: {
    type: DataTypes.ENUM(...Object.values(jobStatusEnum)),
    allowNull: false,
    defaultValue: "Pending",
  },
  appliedTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  // agreement: {
  //     type: DataTypes.UUID, // Assuming 'Agreement' is represented by UUID in PostgreSQL
  //     references: {
  //         model: 'Agreement', // Replace with the actual name of the 'Agreement' table
  //         key: 'id', // Replace with the actual primary key of the 'Agreement' table
  //     },
  // },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default JobApplicant;