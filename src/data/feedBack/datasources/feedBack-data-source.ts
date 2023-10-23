// Import necessary modules and dependencies
import { FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";

// Define the interface for the FeedBackDataSource
export interface FeedBackDataSource {
    create(feedBack: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
    getAllFeedBacks(): Promise<any[]>; // Return type should be Promise of an array of FeedBackEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of FeedBackEntity or null
    update(id: string, feedBack: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
    delete(id: string): Promise<void>;
}

// FeedBack Data Source communicates with the database
export class FeedBackDataSourceImpl implements FeedBackDataSource {
    constructor(private db: Sequelize) { }

    // Create a new feedback entry
    async create(feedBack: any): Promise<any> {
        console.log(feedBack, "datasource-20");
        const existingFeedBack = await FeedBack.findOne({
            where: {
                jobId: feedBack.jobId
            }
        });
        console.log(existingFeedBack, "datasource-26");
        if (existingFeedBack) {
            throw ApiError.feedBackGiven();
        }
        const createdFeedBack = await FeedBack.create(feedBack);
        return createdFeedBack.toJSON();
    }

    // Retrieve all feedback entries
    async getAllFeedBacks(): Promise<any[]> {
        const data = await FeedBack.findAll({
            include: [{
                model: Realtors,
                as: 'from', // Alias for the first association
                foreignKey: 'fromRealtor',
            },
            {
                model: Realtors,
                as: 'to', // Alias for the second association
                foreignKey: 'toRealtor',
            },
            // {
            //     model: Jobs,
            //     as: 'job', // Alias for the third association
            //     foreignKey: 'jobId',
            // },
            ],
        });
        return data.map((feedBack: any) => feedBack.toJSON()); // Convert to plain JavaScript objects before returning
    }

    // Retrieve a feedback entry by its ID
    async read(id: string): Promise<any | null> {
        const feedBack = await FeedBack.findOne({
            where: {
                id: id,
            },
            // include: 'tags', // Replace 'tags' with the actual name of your association
        });
        return feedBack ? feedBack.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Update a feedback entry by ID
    async update(id: string, updatedData: FeedBackModel): Promise<any> {
        // Find the record by ID
        const feedBack = await FeedBack.findByPk(id);

        // Update the record with the provided data
        if (feedBack) {
            await feedBack.update(updatedData);
        }
        // Fetch the updated record
        const updatedFeedBack = await FeedBack.findByPk(id);

        return updatedFeedBack ? updatedFeedBack.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    // Delete a feedback entry by ID
    async delete(id: string): Promise<void> {
        await FeedBack.destroy({
            where: {
                id: id,
            },
        });
    }
}
