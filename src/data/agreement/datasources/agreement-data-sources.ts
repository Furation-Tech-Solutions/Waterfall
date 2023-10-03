import { Sequelize } from "sequelize";
import { AgreementEntity, AgreementModel } from "@domain/agreement/entities/agreement";
import Agreement from "@data/agreement/models/agreement-models";

// Create AgreementDataSource Interface
export interface AgreementDataSource {
  create(agreement: AgreementModel): Promise<AgreementEntity>;
  update(id: string, agreement: AgreementModel): Promise<any>;
  read(id: string): Promise<AgreementEntity | null>;
  getAll(): Promise<AgreementEntity[]>;
}

// Agreement Data Source communicates with the database
export class AgreementDataSourceImpl implements AgreementDataSource {
  constructor(private db: Sequelize) {}

  async create(agreement: any): Promise<AgreementEntity> {
    const createdAgreement = await Agreement.create(agreement);

    return createdAgreement.toJSON();
  }

  async read(id: string): Promise<AgreementEntity | null> {
    const agreement = await Agreement.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return agreement ? agreement.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<AgreementEntity[]> {
    const agreement = await Agreement.findAll({});
    return agreement.map((agreement: any) => agreement.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: AgreementModel): Promise<any> {
    // Find the record by ID
    const agreement = await Agreement.findByPk(id);

    // Update the record with the provided data
    if (agreement) {
      await agreement.update(updatedData);
    }
    // Fetch the updated record
    const updatedAgreement = await Agreement.findByPk(id);

    return updatedAgreement ? updatedAgreement.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}