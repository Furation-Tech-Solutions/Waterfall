// Import necessary modules and dependencies
import { RealtorModel } from "@domain/realtors/entities/realtors";
import Realtor from "../model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize, Op } from "sequelize";

// Define the interface for the RealtorDataSource
export interface RealtorDataSource {
    create(realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    getAllRealtors(query: RealtorQuery): Promise<any[]>; // Return type should be Promise of an array of RealtorEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of RealtorEntity or null
    update(id: string, realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    delete(id: string): Promise<void>;
}

export interface RealtorQuery {
    location?: string;
    gender?: string;
    q?: string;
    page: number;
    limit: number;
}

// Realtor Data Source communicates with the database
export class RealtorDataSourceImpl implements RealtorDataSource {
    constructor(private db: Sequelize) { }

    // Create a new Realtor entry
    async create(realtor: any): Promise<any> {
        // Check if a Realtor with the same email already exists
        const existingRealtors = await Realtor.findOne({
            where: {
                email: realtor.email
            }
        });
        if (existingRealtors) {
            throw ApiError.realtorExist();
        }
        // Create a new Realtor record in the database
        const createdRealtor = await Realtor.create(realtor);
        return createdRealtor.toJSON(); // Return the newly created Realtor as a plain JavaScript object
    }

    async getAllRealtors(query: RealtorQuery): Promise<any[]> {

        const currentPage = query.page || 1; // Default to page 1
        const itemsPerPage = query.limit || 10; // Default to 10 items per page
        const offset = (currentPage - 1) * itemsPerPage;

        // Check for different query parameters and filter data accordingly
        if (query.location != undefined) {
            const data = await Realtor.findAll({
                where: {
                    [Op.or]: [
                        {
                            location: {
                                [Op.iLike]: `%${query.location}%`
                            }
                        }
                    ]
                },
                limit: itemsPerPage, // Limit the number of results per page
                offset: offset, // Calculate the offset based on the current page
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.gender != undefined) {
            const data = await Realtor.findAll({
                where: {
                    [Op.or]: [
                        {
                            gender: {
                                [Op.iLike]: `%${query.gender}%`
                            }
                        }
                    ]
                },
                limit: itemsPerPage, // Limit the number of results per page
                offset: offset, // Calculate the offset based on the current page
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.q != undefined) {
            const data = await Realtor.findAll({
                where: {
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.iLike]: `%${query.q}%`,
                            },
                        },
                        {
                            lastName: {
                                [Op.iLike]: `%${query.q}%`,
                            },
                        },
                        {
                            email: {
                                [Op.iLike]: `%${query.q}%`,
                            },
                        },
                    ]
                },
                limit: itemsPerPage, // Limit the number of results per page
                offset: offset, // Calculate the offset based on the current page
            });
            return data.map((realtor: any) => realtor.toJSON());
        } else {
            // Handle other cases when 'location' is not provided (e.g., return all records)
            const data = await Realtor.findAll({
                limit: itemsPerPage, // Limit the number of results per page
                offset: offset, // Calculate the offset based on the current page
            });

            return data.map((realtor: any) => realtor.toJSON());
        }

    }

    // Retrieve a Realtor entry by its ID
    async read(id: string): Promise<any | null> {
        // Find a Realtor record in the database by its ID
        const realtor = await Realtor.findOne({
            where: {
                id: id,
            },
        });
        return realtor ? realtor.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Update a Realtor entry by ID
    async update(id: string, updatedData: RealtorModel): Promise<any> {
        // Find the record by ID
        const realtor = await Realtor.findByPk(id);

        // Update the record with the provided data if it exists
        if (realtor) {
            await realtor.update(updatedData);
        }
        // Fetch the updated record
        const updatedRealtor = await Realtor.findByPk(id);

        return updatedRealtor ? updatedRealtor.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Delete a Realtor entry by ID
    async delete(id: string): Promise<void> {
        // Delete a Realtor record from the database based on its ID
        await Realtor.destroy({
            where: {
                id: id,
            },
        });
    }
}
