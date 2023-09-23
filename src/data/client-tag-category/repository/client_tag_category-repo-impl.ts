import { ClientTagCategoryEntity, ClientTagCategoryModel } from "@domain/client-tag-category/entities/client_tag_category_entities"; // Import the TagCategoryModel
import { ClientTagCategoryRepository } from "@domain/client-tag-category/repositories/client_tag_category-repo"; // Import the TagCategoryRepository
import { ClientTagCategoryDataSource } from "../datasource/client_tag_Category-datasource"; // Import the TagCategoryDataSource
import { Either, Right, Left } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";

export class ClientTagCategoryRepositoryImpl implements ClientTagCategoryRepository {
    private readonly clientTagCategoryDataSource: ClientTagCategoryDataSource;
    constructor(clientTagCategoryDataSource: ClientTagCategoryDataSource) {
        this.clientTagCategoryDataSource = clientTagCategoryDataSource;
    }

    async createClientTagCategory(clientTagCategory: ClientTagCategoryModel): Promise<Either<ErrorClass, ClientTagCategoryEntity>> {
        try {
            const createdTagCategory = await this.clientTagCategoryDataSource.create(clientTagCategory); // Use the tag category data source
            return Right<ErrorClass, ClientTagCategoryEntity>(createdTagCategory);
        } catch (error) {
            if (error instanceof ApiError && error.name === "conflict") {
                return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.clienttagExist());
            }
            return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.badRequest());
        }
    }

    async deleteClientTagCategory(id: string): Promise<Either<ErrorClass, void>> {
        try {
            const result = await this.clientTagCategoryDataSource.delete(id); // Use the tag category data source
            return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, void>(ApiError.notFound());
            }
            return Left<ErrorClass, void>(ApiError.badRequest());
        }
    }

    async updateClientTagCategory(id: string, data: ClientTagCategoryModel): Promise<Either<ErrorClass, ClientTagCategoryEntity>> {
        try {
            const updatedTagCategory = await this.clientTagCategoryDataSource.update(id, data); // Use the tag category data source
            return Right<ErrorClass, ClientTagCategoryEntity>(updatedTagCategory);
        } catch (e) {
            if (e instanceof ApiError && e.name === "conflict") {
                return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.clienttagExist());
            }
            return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.badRequest());
        }
    }

    async getAllClientTagCategories(): Promise<Either<ErrorClass, ClientTagCategoryEntity[]>> {
        try {
            const tagCategories = await this.clientTagCategoryDataSource.getAll(); // Use the tag category data source
            return Right<ErrorClass, ClientTagCategoryEntity[]>(tagCategories);
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ClientTagCategoryEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, ClientTagCategoryEntity[]>(ApiError.badRequest());
        }
    }

    async getTagClientCategoryById(id: string): Promise<Either<ErrorClass, ClientTagCategoryEntity>> {
        try {
            const tagCategory = await this.clientTagCategoryDataSource.read(id); // Use the tag category data source
            return tagCategory
                ? Right<ErrorClass, ClientTagCategoryEntity>(tagCategory)
                : Left<ErrorClass, ClientTagCategoryEntity>(ApiError.notFound());
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.notFound());
            }
            return Left<ErrorClass, ClientTagCategoryEntity>(ApiError.badRequest());
        }
    }
}
