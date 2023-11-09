// Import necessary modules and dependencies
import { FQAModel } from "@domain/fqa/entities/fqa";
import FQA from "../model/fqa-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";

// Define the interface for the FQADataSource
export interface FQADataSource {
    create(fqa: FQAModel): Promise<any>; // Return type should be Promise of FQAEntity
    getAllFQAs(): Promise<any[]>; // Return type should be Promise of an array of FQAEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of FQAEntity or null
    update(id: string, fqa: FQAModel): Promise<any>; // Return type should be Promise of FQAEntity
    delete(id: string): Promise<void>;
}

// FQA Data Source communicates with the database
export class FQADataSourceImpl implements FQADataSource {
    constructor(private db: Sequelize) { }

    // Create a new FQA (Frequently Asked Question) entry
    async create(fqa: any): Promise<any> {
        // Check if the question already exists
        const existingFQA = await FQA.findOne({
            where: {
                question: fqa.question
            }
        });

        if (existingFQA) {
            throw ApiError.questionExist();
        }

        // Create a new FQA entry
        const createdFQA = await FQA.create(fqa);
        return createdFQA.toJSON();
    }

    // Retrieve all FQA entries
    async getAllFQAs(): Promise<any[]> {
        // Retrieve all FQA entries from the database
        const fqa = await FQA.findAll({});
        return fqa.map((fqa: any) => fqa.toJSON()); // Convert to plain JavaScript objects before returning
    }

    // Retrieve an FQA entry by its ID
    async read(id: string): Promise<any | null> {
        // Find the FQA entry by ID
        const fqa = await FQA.findOne({
            where: {
                id: id,
            },
        });

        return fqa ? fqa.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Update an FQA entry by ID
    async update(id: string, updatedData: FQAModel): Promise<any> {
        // Find the FQA record by ID
        const fqa = await FQA.findByPk(id);

        // Update the FQA record with the provided data
        if (fqa) {
            await fqa.update(updatedData);
        }

        // Fetch the updated FQA record
        const updatedFQA = await FQA.findByPk(id);

        return updatedFQA ? updatedFQA.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Delete an FQA entry by ID
    async delete(id: string): Promise<void> {
        // Delete the FQA entry from the database
        await FQA.destroy({
            where: {
                id: id,
            },
        });
    }
}
