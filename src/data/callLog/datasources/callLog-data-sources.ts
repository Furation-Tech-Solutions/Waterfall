import { Sequelize } from "sequelize";
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog"; // Import the JobModel
import CallLog from "@data/callLog/models/callLog-model";

// Create CallLogDataSource Interface
export interface CallLogDataSource {
  create(callLog: CallLogModel): Promise<CallLogEntity>;
  update(id: string, callLog: CallLogModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<CallLogEntity | null>;
  getAll(): Promise<CallLogEntity[]>;
}

// CallLog Data Source communicates with the database
export class CallLogDataSourceImpl implements CallLogDataSource {
  constructor(private db: Sequelize) {}

  async create(callLog: any): Promise<CallLogEntity> {
    const createdCallLog = await CallLog.create(callLog);

    return createdCallLog.toJSON();
  }

  async delete(id: string): Promise<void> {
    await CallLog.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<CallLogEntity | null> {
    const callLog = await CallLog.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return callLog ? callLog.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<CallLogEntity[]> {
    const callLog = await CallLog.findAll({});
    return callLog.map((callLog: any) => callLog.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: CallLogModel): Promise<any> {
    // Find the record by ID
    const callLog = await CallLog.findByPk(id);

    // Update the record with the provided data
    if (callLog) {
      await callLog.update(updatedData);
    }
    // Fetch the updated record
    const updatedCallLog = await CallLog.findByPk(id);

    return updatedCallLog ? updatedCallLog.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}

