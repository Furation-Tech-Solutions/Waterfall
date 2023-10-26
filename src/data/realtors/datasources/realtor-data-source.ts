// Import necessary modules and dependencies
import { RealtorModel } from "@domain/realtors/entities/realtors";
import Realtor from "../model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize, Op } from "sequelize";
import { IRFilter } from "types/realtor/filter-type";

// Define the interface for the RealtorDataSource
export interface RealtorDataSource {
    create(realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    // getAllRealtors(): Promise<any[]>; // Return type should be Promise of an array of RealtorEntity
    getAllRealtors(query: object, page: number, limit: number): Promise<any[]>; // Return type should be Promise of an array of RealtorEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of RealtorEntity or null
    update(id: string, realtor: RealtorModel): Promise<any>; // Return type should be Promise of RealtorEntity
    delete(id: string): Promise<void>;
}

interface RealtorQuery {
    location?: string;
    gender?: string;
    searchList?: string;
    page?: number;
    limit?: number;
    // Add other properties as needed
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

    async getAllRealtors(query: RealtorQuery, page: number, limit: number): Promise<any[]> {
        console.log("=-=-=-=->",query);
        
        
        if (query.searchList != undefined && query.location != undefined) {
            const data = await Realtor.findAll({
                where: {
                    firstName: {
                        [Op.iLike]: `%${query.searchList}%`
                    },
                    location: {
                        [Op.iLike]: `%${query.location}%`
                    }
                },
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.location != undefined) {
            const data = await Realtor.findAll({
                where: {
                    [Op.or]: [
                        {
                            location: {
                                [Op.iLike]: `%${query.location}%`
                            },
                        }
                    ]
                }
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.gender != undefined) {
            const data = await Realtor.findAll({
                limit: parseInt(limit.toString()),
                where: {
                    [Op.or]: [
                        {
                            gender: {
                                [Op.iLike]: `%${query.gender}%`
                            }
                        }
                    ]
                }
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.searchList != undefined) {
            const data = await Realtor.findAll({
                where: {
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.iLike]: `%${query.searchList}%`,
                            }
                        },
                        {
                            lastName: {
                                [Op.iLike]: `%${query.searchList}%`,
                            },
                        },
                        {
                            email: {
                                [Op.iLike]: `%${query.searchList}%`,
                            },
                        },
                        {
                            contact: {
                                [Op.iLike]: `%${query.searchList}%`,
                            },
                        }
                    ],
                },
            });
            return data.map((realtor: any) => realtor.toJSON());
        }
        else if (query.page != undefined && query.limit != undefined) {
            let page = parseInt(query.page.toString())
            const offset = (page - 1) * limit;
            const data = await Realtor.findAll({
                offset: offset, // Offset based on the current page
                limit: parseInt(query.limit.toString())
            });
            return data.map((realtor: any) => realtor.toJSON());
        } else {
            // Handle other cases when 'location' is not provided (e.g., return all records)
            const data = await Realtor.findAll({});
            return data.map((realtor: any) => realtor.toJSON());
        }
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
