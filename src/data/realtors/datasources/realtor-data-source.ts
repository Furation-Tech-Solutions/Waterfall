// Import necessary modules and dependencies
import { RealtorModel } from "@domain/realtors/entities/realtors";
import Realtor from "../model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";

// Define the interface for the RealtorDataSource
export interface RealtorDataSource {
    create(realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    getAllRealtors(): Promise<any[]>; // Return type should be Promise of an array of RealtorEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of RealtorEntity or null
    update(id: string, realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    delete(id: string): Promise<void>;
}

// Realtor Data Source communicates with the database
export class RealtorDataSourceImpl implements RealtorDataSource {
    constructor(private db: Sequelize) { }

    // Create a new Realtor entry
    async create(realtor: any): Promise<any> {
        console.log(realtor, "datasource-20");
        const existingRealtors = await Realtor.findOne({
            where: {
                email: realtor.email
            }
        });
        console.log(existingRealtors, "datasource-26");
        if (existingRealtors) {
            throw ApiError.realtorExist();
        }
        const createdRealtor = await Realtor.create(realtor);
        return createdRealtor.toJSON();
    }

    // Retrieve all Realtor entries
    async getAllRealtors(): Promise<any[]> {
        const realtor = await Realtor.findAll({});
        return realtor.map((realtor: any) => realtor.toJSON()); // Convert to plain JavaScript objects before returning
    }

    // Retrieve a Realtor entry by its ID
    async read(id: string): Promise<any | null> {
        const realtor = await Realtor.findOne({
            where: {
                id: id,
            },
            // include: 'tags', // Replace 'tags' with the actual name of your association
        });
        return realtor ? realtor.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Update a Realtor entry by ID
    async update(id: string, updatedData: RealtorModel): Promise<any> {
        // Find the record by ID
        const realtor = await Realtor.findByPk(id);

        // Update the record with the provided data
        if (realtor) {
            await realtor.update(updatedData);
        }
        // Fetch the updated record
        const updatedRealtor = await Realtor.findByPk(id);

        return updatedRealtor ? updatedRealtor.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Delete a Realtor entry by ID
    async delete(id: string): Promise<void> {
        await Realtor.destroy({
            where: {
                id: id,
            },
        });
    }
}
