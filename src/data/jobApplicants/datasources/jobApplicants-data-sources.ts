// Import necessary modules and dependencies
import { Op, Sequelize } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
// import { JobStatusEnum } from "types/jobApplicant/upcomingTaskInterface";
import { Query } from "types/jobApplicant/upcomingTaskInterface";




const currentDate = new Date();
const nextDay = new Date();
nextDay.setDate(nextDay.getDate() + 1);

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: JobApplicantModel): Promise<any>;

  // Method to update an existing job applicant by ID
  update(id: string, jobApplicant: JobApplicantModel): Promise<any>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(id: string, q: string): Promise<any[]>;

  // Method to delete a jobApplicant record by ID
  delete(id: string): Promise<void>;
}

interface JobApplicantQuery {
  q?: string;
  // Add other properties as needed
}

// jobApplicant Data Source communicates with the database
export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
  constructor(private db: Sequelize) { }

  // Method to create a new job applicant
  async create(jobApplicant: any): Promise<any> {
    // Create a new job applicant record in the database
    const createdJobApplicant = await JobApplicant.create(jobApplicant);

    // Convert the created record to a plain JavaScript object and return it
    return createdJobApplicant.toJSON();
  }

  // Method to read a job applicant by ID
  async read(id: string): Promise<JobApplicantEntity | null> {
    // Find a job applicant record in the database by ID
    const jobApplicant = await JobApplicant.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  async getAll(id: string, q: string): Promise<any[]> {
    let loginId = parseInt(id);
    // let ownerId = parseInt(id);
    // const typedQuery = query as Query;
    // const isAgreementTrue = // No need to convert, it's already a boolean
    console.log("data source ", id, q);

    if (q === "upcomingTask") {
      {
        // console.log(typedQuery);

        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
            applicant: loginId,
          },
          include: [
            {
              model: Job,
              as: "jobdata",
              foreignKey: "job",
              //  where: {
              //    date: {
              //      [Op.gte]: currentDate,
              //      [Op.lt]: nextDay,
              //    },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicant",
            },
          ],
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    }
    else if (q === "jobAssigned") {
      {

        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
          },
          include: [
            {
              model: Job,
              as: "jobdata",
              foreignKey: "job",
              where: {
                jobOwner: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicant",
            },
          ],
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    }
    else if (q == "active") { // Check if the query parameter is "active"
      const data = await JobApplicant.findAll({
        where: {
          applicantStatus: "Pending", // Filter by applicantStatus
          agreement: true, // Filter by agreement
        },
        include: [
          {
            model: Job,
            as: "jobdata",
            foreignKey: "job",
          },
          {
            model: Realtors,
            as: "applicantData",
            foreignKey: "applicant",
          },
        ],
      });
      console.log("---------->", data);
      return data.map((jobA: any) => jobA.toJSON());
    }
    else if (q == "PaymentPending") { // Check if the query parameter is "active"
      const data = await JobApplicant.findAll({
        where: {
          jobStatus: "JobCompleted", // Filter by applicantStatus
          paymentStatus: false, // Filter by agreement
        },
        include: [
          {
            model: Job,
            as: "jobdata",
            foreignKey: "job",
          },
          {
            model: Realtors,
            as: "applicantData",
            foreignKey: "applicant",
          },
        ],
      });
      console.log("---------->", data);
      return data.map((jobA: any) => jobA.toJSON());
    }
    else if (q == "Completed") { // Check if the query parameter is "active"
      const data = await JobApplicant.findAll({
        where: {
          paymentStatus: true, // Filter by agreement
        },
        include: [
          {
            model: Job,
            as: "jobdata",
            foreignKey: "job",
          },
          {
            model: Realtors,
            as: "applicantData",
            foreignKey: "applicant",
          },
        ],
      });
      console.log("---------->", data);
      return data.map((jobA: any) => jobA.toJSON());
    } else {
      const jobApplicant = await JobApplicant.findAll({
        include: [
          {
            model: Job,
            as: "jobdata",
            foreignKey: "job",
          },
          {
            model: Realtors,
            as: "applicantData",
            foreignKey: "applicant",
          },
        ],
      });
      return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
    }

  }

  // async getAll(id: string, query: object): Promise<any[]> {
  //   let loginId = parseInt(id);
  //   let ownerId = parseInt(id);
  //   const typedQuery = query as Query;
  //   // const isAgreementTrue = // No need to convert, it's already a boolean

  //  if (typedQuery.jobStatus === "Pending" && typedQuery.agreement===true) {
  //   console.log(typedQuery);

  //    const jobApplicant = await JobApplicant.findAll({
  //      where: {
  //        agreement: true, // Now, it's a boolean
  //        jobStatus: "Pending",
  //        applicant: loginId,
  //      },
  //      include: [
  //        {
  //          model: Job,
  //          as: "jobdata",
  //          foreignKey: "job",
  //         //  where: {
  //         //    date: {
  //         //      [Op.gte]: currentDate,
  //         //      [Op.lt]: nextDay,
  //         //    },
  //         //  },
  //        },
  //        {
  //          model: Realtors,
  //          as: "applicantData",
  //          foreignKey: "applicant",
  //        },
  //      ],
  //    });

  //    return jobApplicant.map((jobA: any) => jobA.toJSON());
  //  }
  //  else if (typedQuery.jobStatus === "Pending" && typedQuery.agreement === true) {
  //    console.log(typedQuery);

  //    const jobApplicant = await JobApplicant.findAll({
  //      where: {
  //        agreement: true, // Now, it's a boolean
  //        jobStatus: "Pending",
  //        jobdata: { jobOwner: ownerId },
  //      },
  //      include: [
  //        {
  //          model: Job,
  //          as: "jobdata",
  //          foreignKey: "job",
  //          //  where: {
  //          //    date: {
  //          //      [Op.gte]: currentDate,
  //          //      [Op.lt]: nextDay,
  //          //    },
  //          //  },
  //        },
  //        {
  //          model: Realtors,
  //          as: "applicantData",
  //          foreignKey: "applicant",
  //        },
  //      ],
  //    });

  //    return jobApplicant.map((jobA: any) => jobA.toJSON());
  //  } else {
  //    const jobApplicant = await JobApplicant.findAll({
  //      include: [
  //        {
  //          model: Job,
  //          as: "jobdata",
  //          foreignKey: "job",
  //        },
  //        {
  //          model: Realtors,
  //          as: "applicantData",
  //          foreignKey: "applicant",
  //        },
  //      ],
  //    });
  //    return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
  //  }
  // }

  // Method to update an existing job applicant by ID
  async update(id: string, updatedData: JobApplicantModel): Promise<any> {
    // Find the job applicant record in the database by ID
    const jobApplicant = await JobApplicant.findByPk(id);

    // Update the job applicant record with the provided data if found
    if (jobApplicant) {
      await jobApplicant.update(updatedData);
    }

    // Fetch the updated job applicant record
    const updatedJobApplicant = await JobApplicant.findByPk(id);

    // If an updated job applicant record is found, convert it to a plain JavaScript object before returning
    return updatedJobApplicant ? updatedJobApplicant.toJSON() : null;
  }
  // Method to delete a jobApplicant record by ID
  async delete(id: string): Promise<void> {
    // Delete the jobApplicant record where the ID matches the provided ID
    await JobApplicant.destroy({
      where: {
        id: id,
      },
    });
  }
}
