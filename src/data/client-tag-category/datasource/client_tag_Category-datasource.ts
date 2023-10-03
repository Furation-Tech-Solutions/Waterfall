import { Sequelize } from "sequelize"
import { ClientTagCategoryModel } from "@domain/client-tag-category/entities/client_tag_category_entities"; // Import the TagCategoryModel
import ClientTagCategory from "..//models/client_tag_category_model";
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
    constructor(private db: Sequelize) { }

    async create(clientTagCategory: any): Promise<any> {
        console.log(clientTagCategory, "datasouce-20");
        const existingClientTagCategories = await ClientTagCategory.findOne({
            where: {
                name: clientTagCategory.name
            }
        });
        console.log(existingClientTagCategories, "datasouce-26");
        if (existingClientTagCategories) {
            throw ApiError.emailExist();
        }
        const createdClientTagCategory = await ClientTagCategory.create(clientTagCategory);
        return createdClientTagCategory.toJSON();
    }

    async delete(id: string): Promise<void> {
        await ClientTagCategory.destroy({
            where: {
                id: id,
            },
        });
    }

    async read(id: string): Promise<any | null> {
        const clientTagCategory = await ClientTagCategory.findOne({
            where: {
                id: id,
            },
            // include: 'tags', // Replace 'tags' with the actual name of your association
        });
        return clientTagCategory ? clientTagCategory.toJSON() : null; // Convert to a plain JavaScript object before returning
    }

    async getAll(): Promise<any[]> {
        const clientTagCategories = await ClientTagCategory.findAll({});
        return clientTagCategories.map((clientTagCategory: any) => clientTagCategory.toJSON()); // Convert to plain JavaScript objects before returning
    }

    async update(id: string, updatedData: ClientTagCategoryModel): Promise<any> {
        // Find the record by ID
        const clientTagCategory = await ClientTagCategory.findByPk(id);


        // Update the record with the provided data
        if (clientTagCategory) {
            await clientTagCategory.update(updatedData);
        }
        // Fetch the updated record
        const updatedClientTagCategory = await ClientTagCategory.findByPk(id);

        return updatedClientTagCategory ? updatedClientTagCategory.toJSON() : null; // Convert to a plain JavaScript object before returning
    }
}
