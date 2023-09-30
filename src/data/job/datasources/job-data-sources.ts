import { Sequelize } from "sequelize";
import { JobEntity, JobModel } from "@domain/job/entites/job"; // Import the JobModel
import Job from "..//models/job-model";
import ApiError from "@presentation/error-handling/api-error";

// Create JobDataSource Interface
export interface JobDataSource {
  create(job: JobModel): Promise<JobEntity>;
  update(id: string, job: JobModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<JobEntity | null>;
  getAll(): Promise<JobEntity[]>;
}

// Job Data Source communicates with the database
export class JobDataSourceImpl implements JobDataSource {
  constructor(private db: Sequelize) {}

  async create(job: any): Promise<JobEntity> {
    const createdJob = await Job.create(job);

    return createdJob.toJSON();
  }

  async delete(id: string): Promise<void> {
    await Job.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<JobEntity | null> {
    const job = await Job.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return job ? job.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<JobEntity[]> {
    const job = await Job.findAll({});
    return job.map((job: any) => job.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: JobModel): Promise<any> {
    // Find the record by ID
    const job = await Job.findByPk(id);

    // Update the record with the provided data
    if (job) {
      await job.update(updatedData);
    }
    // Fetch the updated record
    const updatedJob = await Job.findByPk(id);

    return updatedJob ? updatedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}

// import {
//     JobEntity,
//     JobModel,
// } from "@domain/job/entites/job";
// import { Job } from "@data/job/models/job-model";
// import mongoose from "mongoose";
// import ApiError from "@presentation/error-handling/api-error";

// export interface JobDataSource {
//     create(job: JobModel): Promise<JobEntity>;
//     update(id: string, job: JobModel): Promise<any>;
//     delete(id: string): Promise<void>;
//     getById(id: string): Promise<JobEntity | null>;
//     getAllJobs(): Promise<JobEntity[]>;
// }

// export class JobDataSourceImpl implements JobDataSource {
//     constructor(private db: mongoose.Connection) { }

//     async create(job: JobModel): Promise<JobEntity> {

//         const jobData = new Job(job);

//         const createdJob = await jobData.save();

//         return createdJob.toObject();
//     }

//     async update(id: string, job: JobModel): Promise<any> {
//         try {

//             const updatedJob = await Job.findByIdAndUpdate(
//                 id,
//                 job,
//                 {
//                     new: true,
//                 }
//             ); // No need for conversion here
//             return updatedJob ? updatedJob.toObject() : null; // Convert to plain JavaScript object before returning
//         } catch (error) {
//             throw ApiError.badRequest();
//         }
//     }

//     async delete(id: string): Promise<void> {
//         await Job.findByIdAndDelete(id);
//     }

//     async getById(id: string): Promise<JobEntity | null> {
//         const job = await Job.findById(id);
//         return job ? job.toObject() : null; // Convert to plain JavaScript object before returning
//     }

//     async getAllJobs(): Promise<JobEntity[]> {
//         try {
//             const jobs = await Job.find();
//             return jobs.map((job: mongoose.Document) =>
//                 job.toObject()
//             ); // Convert to plain JavaScript objects before returning
//         } catch (error) {
//             throw ApiError.notFound();
//         }
//     }
// }
