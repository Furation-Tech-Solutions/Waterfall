import { ErrorClass } from "@presentation/error-handling/api-error";
import { ClientTagCategoryEntity, ClientTagCategoryModel } from "../entities/client_tag_category_entities"; // Import the TagCategoryModel and TagCategoryEntity
import { ClientTagCategoryRepository } from "../repositories/client_tag_category-repo"; // Import the TagCategoryRepository
import { Either, Right, Left } from "monet";

export interface CreateClientTagCategoryUsecase {
    execute: (clientTagCategoryData: ClientTagCategoryModel) => Promise<Either<ErrorClass, ClientTagCategoryEntity>>;
}

export class CreateClientTagCategory implements CreateClientTagCategoryUsecase {
    private readonly clientTagCategoryRepository: ClientTagCategoryRepository;
    constructor(clientTagCategoryRepository: ClientTagCategoryRepository) {
        this.clientTagCategoryRepository = clientTagCategoryRepository;
    }
    async execute(clientTagCategoryData: ClientTagCategoryModel): Promise<Either<ErrorClass, ClientTagCategoryEntity>> {
        return await this.clientTagCategoryRepository.createClientTagCategory(clientTagCategoryData);
    }
}
