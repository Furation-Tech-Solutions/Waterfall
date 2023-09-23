import mongoose from "mongoose";
import { ClientTagCategoryModel } from "@domain/client-tag-category/entities/client_tag_category_entities"; // Import the TagCategoryModel
import { ClientTagCategory } from "../models/client_tag_category_model";
import ApiError from "@presentation/error-handling/api-error";

// Create CLientTagCategoryDataSource Interface
export interface ClientTagCategoryDataSource {
    create(clientTagCategory: ClientTagCategoryModel): Promise<any>;
    update(id: string, tagCategory: ClientTagCategoryModel): Promise<any>;
    delete(id: string): Promise<void>;
    read(id: string): Promise<any | null>;
    getAll(): Promise<any[]>;
}

// TagCategory Data Source communicates with the database
export class ClientTagCategoryDataSourceImpl implements ClientTagCategoryDataSource {
    constructor(private db: mongoose.Connection) { }

    async create(clientTagCategory: ClientTagCategoryModel): Promise<any> {
        const existingClientTagCategory = await ClientTagCategory.findOne({ name: clientTagCategory.name });
        if (existingClientTagCategory) {
            throw ApiError.emailExist();
        }
        const clientTagCategoryData = new ClientTagCategory(clientTagCategory);
        const createdClientTagCategory = await clientTagCategoryData.save();
        return createdClientTagCategory.toObject();
    }

    async delete(id: string): Promise<void> {
        await ClientTagCategory.findByIdAndDelete(id);
    }

    async read(id: string): Promise<any | null> {
        const clientTagCategory = await ClientTagCategory.findById(id).populate('tags');
        return clientTagCategory ? clientTagCategory.toObject() : null; // Convert to a plain JavaScript object before returning
    }

    async getAll(): Promise<any[]> {
        const clientTagCategories = await ClientTagCategory.find().populate('tags');
        return clientTagCategories.map((clientTagCategory) => clientTagCategory.toObject()); // Convert to plain JavaScript objects before returning
    }

    async update(id: string, clientTagCategory: ClientTagCategoryModel): Promise<any> {
        const updatedClientTagCategory = await ClientTagCategory.findByIdAndUpdate(id, clientTagCategory, {
            new: true,
        }).populate('tags'); // No need for conversion here
        return updatedClientTagCategory ? updatedClientTagCategory.toObject() : null; // Convert to a plain JavaScript object before returning
    }
}
