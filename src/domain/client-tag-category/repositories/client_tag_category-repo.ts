import { ClientTagCategoryEntity, ClientTagCategoryModel } from "../entities/client_tag_category_entities"; // Import the TagCategoryEntity and TagCategoryModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

export interface ClientTagCategoryRepository {
    createClientTagCategory(
        tagCategory: ClientTagCategoryModel
    ): Promise<Either<ErrorClass, ClientTagCategoryEntity>>;
    deleteClientTagCategory(id: string): Promise<Either<ErrorClass, void>>;
    getTagClientCategoryById(id: string): Promise<Either<ErrorClass, ClientTagCategoryEntity>>;
    updateClientTagCategory(
        id: string,
        data: ClientTagCategoryModel
    ): Promise<Either<ErrorClass, ClientTagCategoryEntity>>;
    getAllClientTagCategories(): Promise<Either<ErrorClass, ClientTagCategoryEntity[]>>;
}
