import { Sequelize } from "sequelize";
import { JobEntity, JobModel } from "@domain/job/entities/job"; // Import the JobModel
import Job from "..//models/job-model";

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


