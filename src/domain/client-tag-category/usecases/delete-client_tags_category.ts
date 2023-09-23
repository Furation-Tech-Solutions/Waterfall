import { ErrorClass } from "@presentation/error-handling/api-error";
import { ClientTagCategoryEntity, ClientTagCategoryModel } from "../entities/client_tag_category_entities"; // Import the TagCategoryModel and TagCategoryEntity
import { ClientTagCategoryRepository } from "../repositories/client_tag_category-repo"; // Import the TagCategoryRepository
import { Either, Right, Left } from "monet";

export interface DeleteClientTagCategoryUsecase {
    execute: (clientTagCategoryId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteClientTagCategory implements DeleteClientTagCategoryUsecase {
    private readonly clientTagCategoryRepository: ClientTagCategoryRepository;

    constructor(clientTagCategoryRepository: ClientTagCategoryRepository) {
        this.clientTagCategoryRepository = clientTagCategoryRepository;
    }

    async execute(clientTagCategoryId: string): Promise<Either<ErrorClass, void>> {
        return await this.clientTagCategoryRepository.deleteClientTagCategory(clientTagCategoryId);
    }
}
