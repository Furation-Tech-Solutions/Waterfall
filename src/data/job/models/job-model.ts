import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

export const numberOfApplicantsEnum = {
  FROM1TO5: "1To5",
  FROM5TO10: "5To10",
  FROM10TO15: "10To15",
  FROM15TO20: "15To20",
  FROM20TO25: "20To25",
  FROM25TO30: "25To30",
};

export const jobTypeEnum = {
  SHOWINGPROPERTYtTOCLIENT: "Showing property to client",
  ONETIMEVISIT: "One time visit",
  HELPWITHOPENHOUSE: "Help with open house",
  WRITINGCMA: "Writing CMA",
  WRITINGANOFFER: "Writing an offer",
  HELPINGWITHMOREINSPECTION: "Helping with more inspection",
  OTHERS: "Others",
};

export const feeTypeEnum = {
  FIXRATE: "Fix Rate",
  FLATFEE: "Flat Fee",
};

const Job = sequelize.define("Job", {
  jobOwner: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numberOfApplicants: {
    type: DataTypes.ENUM(...Object.values(numberOfApplicantsEnum)),
    allowNull: false,
  },
  fromTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobType: {
    type: DataTypes.ENUM(...Object.values(jobTypeEnum)),
    allowNull: false,
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feeType: {
    type: DataTypes.ENUM(...Object.values(feeTypeEnum)),
    allowNull: false,
  },
  fee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL ARRAY type for attachments
    allowNull: true, // Change to false if it should not be nullable
  },
  applyBy: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
});

  (async () => {
    await sequelize.sync({ force: true });
    // Code here
  })();

export default Job;

// const mongoose = require("mongoose");

// export const numberOfApplicantsEnum = {
//     FROM1TO5: "1To5",
//     FROM5TO10: "5To10",
//     FROM10TO15: "10To15",
//     FROM15TO20: "15To20",
//     FROM20TO25: "20To25",
//     FROM25TO30: "25To30",
// };

// export const jobTypeEnum = {
//     SHOWINGPROPERTYtTOCLIENT: "Showing property to client",
//     ONETIMEVISIT: "One time visit",
//     HELPWITHOPENHOUSE: "Help with open house",
//     WRITINGCMA: "Writing CMA",
//     WRITINGANOFFER: "Writing an offer",
//     HELPINGWITHMOREINSPECTION: "Helping with more inspection",
//     OTHERS: "Others",
// };

// export const feeTypeEnum = {
//     FIXRATE: "Fix Rate",
//     FLATFEE: "Flat Fee",
// };

// const jobSchema = new mongoose.Schema({
//     jobOwner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Realtor", // Reference to the User who created the job
//         required: true,
//     },
//     location: {
//         type: String,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         required: true,
//     },
//     numberOfApplicants: {
//         type: String,
//         enum: Object.values(numberOfApplicantsEnum),
//         required: true,
//     },
//     fromTime: {
//         type: String,
//         required: true,
//     },
//     toTime: {
//         type: String,
//         required: true,
//     },
//     jobType: {
//         type: String,
//         enum: Object.values(jobTypeEnum),
//         required: true,
//     },
//     clientEmail: {
//         type: String,
//         required: true,
//     },
//     clientPhoneNumber: {
//         type: String,
//         required: true,
//     },
//     feeType: {
//         type: String,
//         enum: Object.values(feeTypeEnum),
//         required: true,
//     },
//     fee: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     attachments: [
//         {
//             type: String, // You can store attachment URLs or file paths as strings
//         },
//     ],
//     applyBy: {
//         type: Date,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// export const Job = mongoose.model("Job", jobSchema);
