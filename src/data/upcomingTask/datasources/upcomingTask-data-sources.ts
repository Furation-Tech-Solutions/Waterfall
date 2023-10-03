import { Sequelize } from "sequelize";
import {
  UpcomingTaskEntity,
  UpcomingTaskModel,
} from "@domain/upcomingTask/entities/upcomingTask";
import UpcomingTask from "@data/upcomingTask/models/upcomingTasks-models";

// Create UpcomingTaskDataSource Interface
export interface UpcomingTaskDataSource {
  create(upcomingTask: UpcomingTaskModel): Promise<UpcomingTaskEntity>;
  update(id: string, upcomingTask: UpcomingTaskModel): Promise<any>;
  read(id: string): Promise<UpcomingTaskEntity | null>;
  getAll(): Promise<UpcomingTaskEntity[]>;
}

// UpcomingTask Data Source communicates with the database
export class UpcomingTaskDataSourceImpl implements UpcomingTaskDataSource {
  constructor(private db: Sequelize) {}

  async create(upcomingTask: any): Promise<UpcomingTaskEntity> {
    const createdUpcomingTask = await UpcomingTask.create(upcomingTask);

    return createdUpcomingTask.toJSON();
  }

  async read(id: string): Promise<UpcomingTaskEntity | null> {
    const upcomingTask = await UpcomingTask.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return upcomingTask ? upcomingTask.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<UpcomingTaskEntity[]> {
    const upcomingTask = await UpcomingTask.findAll({});
    return upcomingTask.map((upcomingTask: any) => upcomingTask.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: UpcomingTaskModel): Promise<any> {
    // Find the record by ID
    const upcomingTask = await UpcomingTask.findByPk(id);

    // Update the record with the provided data
    if (upcomingTask) {
      await upcomingTask.update(updatedData);
    }
    // Fetch the updated record
    const updatedUpcomingTask = await UpcomingTask.findByPk(id);

    return updatedUpcomingTask ? updatedUpcomingTask.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
