import { Sequelize } from "sequelize";
import { JobApplicantEntity, JobApplicantModel } from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import ApiError from "@presentation/error-handling/api-error";

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  create(jobApplicant: JobApplicantModel): Promise<any>;
  update(id: string, jobApplicant: JobApplicantModel): Promise<any>;
  read(id: string): Promise<JobApplicantEntity | null>;
  getAll(): Promise<JobApplicantEntity[]>;
}

// jobApplicant Data Source communicates with the database
export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
  constructor(private db: Sequelize) {}

  async create(jobApplicant: any): Promise<any> {
    const createdJobApplicant = await JobApplicant.create(jobApplicant);
    return createdJobApplicant.toJSON();
  }

  async read(id: string): Promise<JobApplicantEntity | null> {
    const jobApplicant = await JobApplicant.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return jobApplicant ? jobApplicant.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<JobApplicantEntity[]> {
    const jobApplicant = await JobApplicant.findAll({});
    return jobApplicant.map((jobA: any) => jobA.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: JobApplicantModel): Promise<any> {
    // Find the record by ID
    const jobApplicant = await JobApplicant.findByPk(id);

    // Update the record with the provided data
    if (jobApplicant) {
      await jobApplicant.update(updatedData);
    }
    // Fetch the updated record
    const updatedJobApplicant = await JobApplicant.findByPk(id);

    return updatedJobApplicant ? updatedJobApplicant.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

}
// import {
//     JobApplicantEntity,
//     JobApplicantModel,
// } from "@domain/jobApplicants/entites/jobApplicants";
// import { JobApplicant } from "@data/jobApplicants/models/jobApplicants-models";
// import mongoose from "mongoose";
// import ApiError from "@presentation/error-handling/api-error";

// export interface JobApplicantDataSource {
//     create(jobApplicant: JobApplicantModel): Promise<JobApplicantEntity>;
//     update(id: string, jobApplicant: JobApplicantModel): Promise<any>;
//     getById(id: string): Promise<JobApplicantEntity | null>;
//     getAllJobApplicants(): Promise<JobApplicantEntity[]>;
// }

// export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
//     constructor(private db: mongoose.Connection) { }

//     async create(jobApplicant: JobApplicantModel): Promise<JobApplicantEntity> {

//         const jobApplicantData = new JobApplicant(jobApplicant);

//         const createdJobApplicant = await jobApplicantData.save();

//         return createdJobApplicant.toObject();
//     }

//     async update(id: string, jobApplicant: JobApplicantModel): Promise<any> {
//         try {

//             const updatedJobApplicant = await JobApplicant.findByIdAndUpdate(
//                 id,
//                 jobApplicant,
//                 {
//                     new: true,
//                 }
//             ); // No need for conversion here
//             return updatedJobApplicant ? updatedJobApplicant.toObject() : null; // Convert to plain JavaScript object before returning
//         } catch (error) {
//             throw ApiError.badRequest();
//         }
//     }

//     async getById(id: string): Promise<JobApplicantEntity | null> {
//         const jobApplicant = await JobApplicant.findById(id);
//         return jobApplicant ? jobApplicant.toObject() : null; // Convert to plain JavaScript object before returning
//     }

//     async getAllJobApplicants(): Promise<JobApplicantEntity[]> {
//         try {
//             const jobApplicants = await JobApplicant.find();
//             return jobApplicants.map((jobApplicant: mongoose.Document) =>
//                 jobApplicant.toObject()
//             ); // Convert to plain JavaScript objects before returning
//         } catch (error) {
//             throw ApiError.notFound();
//         }
//     }
// }
