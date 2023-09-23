import { NextFunction, Request, Response } from "express";
import {
    ClientTagCategoryEntity,
    ClientTagCategoryMapper,
    ClientTagCategoryModel,
} from "@domain/client-tag-category/entities/client_tag_category_entities"; // Import tag category-related entities and mapper
import { CreateClientTagCategoryUsecase } from "@domain/client-tag-category/usecases/create-client_tags_category"; // Import tag category-related use cases
import { DeleteClientTagCategoryUsecase } from "@domain/client-tag-category/usecases/delete-client_tags_category";
import { GetClientTagCategoryByIdUsecase } from "@domain/client-tag-category/usecases/get-client_tag_category-by-id";
import { GetAllClientagCategoriesUsecase } from "@domain/client-tag-category/usecases/get-all-client_tag_category";
import { UpdateClientTagCategoryUsecase } from "@domain/client-tag-category/usecases/update-client_tag_category";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

export class ClientTagCategoryServices {
    private readonly createClientTagCategoryUsecases: CreateClientTagCategoryUsecase;
    private readonly deleteClientTagCategoryUsecases: DeleteClientTagCategoryUsecase;
    private readonly getClientTagCategoryByIdUsecases: GetClientTagCategoryByIdUsecase;
    private readonly getAllClientTagCategoriesUsecases: GetAllClientagCategoriesUsecase;
    private readonly updateClientTagCategoryUsecases: UpdateClientTagCategoryUsecase;

    constructor(
        createClientTagCategoryUsecases: CreateClientTagCategoryUsecase,
        deleteClientTagCategoryUsecases: DeleteClientTagCategoryUsecase,
        getClientTagCategoryByIdUsecases: GetClientTagCategoryByIdUsecase,
        getAllClientTagCategoriesUsecases: GetAllClientagCategoriesUsecase,
        updateClientTagCategoryUsecases: UpdateClientTagCategoryUsecase,
    ) {
        this.createClientTagCategoryUsecases = createClientTagCategoryUsecases;
        this.deleteClientTagCategoryUsecases = deleteClientTagCategoryUsecases;
        this.getClientTagCategoryByIdUsecases = getClientTagCategoryByIdUsecases;
        this.getAllClientTagCategoriesUsecases = getAllClientTagCategoriesUsecases;
        this.updateClientTagCategoryUsecases = updateClientTagCategoryUsecases;
    }

    async createClientTagCategory(req: Request, res: Response): Promise<void> {
        const clientTagCategoryData: ClientTagCategoryModel = ClientTagCategoryMapper.toModel(req.body);

        const newClientTagCategory: Either<ErrorClass, ClientTagCategoryEntity> =
            await this.createClientTagCategoryUsecases.execute(clientTagCategoryData);

        newClientTagCategory.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: ClientTagCategoryEntity) => {
                const resData = ClientTagCategoryMapper.toEntity(result, true);
                return res.json(resData);
            }
        );
    }

    async deleteClientTagCategory(req: Request, res: Response): Promise<void> {
        const clientTagCategoryId: string = req.params.ClientTagCategoryId;

        const deletedClientTagCategory: Either<ErrorClass, void> =
            await this.deleteClientTagCategoryUsecases.execute(clientTagCategoryId);

        deletedClientTagCategory.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: void) => {
                return res.json({ message: "Client Tag category deleted successfully." });
            }
        );
    }

    async getClientTagCategoryById(req: Request, res: Response): Promise<void> {
        const clientTagCategoryId: string = req.params.ClientTagCategoryId;

        const clientTagCategory: Either<ErrorClass, ClientTagCategoryEntity> =
            await this.getClientTagCategoryByIdUsecases.execute(clientTagCategoryId);

        clientTagCategory.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: ClientTagCategoryEntity) => {
                if (!result) {
                    return res.json({ message: "Client Tag category not found." });
                }
                const resData = ClientTagCategoryMapper.toEntity(result);
                return res.json(resData);
            }
        );
    }

    async getAllClientTagCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const clientTagCategories: Either<ErrorClass, ClientTagCategoryEntity[]> =
            await this.getAllClientTagCategoriesUsecases.execute();

        clientTagCategories.cata(
            (error: ErrorClass) =>
                res.status(error.status).json({ error: error.message }),
            (result: ClientTagCategoryEntity[]) => {
                const responseData = result.map((tagCategory) =>
                    ClientTagCategoryMapper.toEntity(tagCategory)
                );
                return res.json(responseData);
            }
        );
    }

    async updateClientTagCategory(req: Request, res: Response): Promise<void> {
        const clientTagCategoryId: string = req.params.ClientTagCategoryId;
        const clientTagCategoryData: ClientTagCategoryModel = req.body;

        const existingClientTagCategory: Either<ErrorClass, ClientTagCategoryEntity> =
            await this.getClientTagCategoryByIdUsecases.execute(clientTagCategoryId);

        existingClientTagCategory.cata(
            (error: ErrorClass) => {
                res.status(error.status).json({ error: error.message });
            },
            async (existingClientTagCategoryData: ClientTagCategoryEntity) => {
                const updatedClientTagCategoryEntity: ClientTagCategoryEntity = ClientTagCategoryMapper.toEntity(
                    clientTagCategoryData,
                    true,
                    existingClientTagCategoryData
                );

                const updatedClientTagCategory: Either<ErrorClass, ClientTagCategoryEntity> =
                    await this.updateClientTagCategoryUsecases.execute(
                        clientTagCategoryId,
                        updatedClientTagCategoryEntity
                    );

                updatedClientTagCategory.cata(
                    (error: ErrorClass) => {
                        res.status(error.status).json({ error: error.message });
                    },
                    (result: ClientTagCategoryEntity) => {
                        const resData = ClientTagCategoryMapper.toEntity(result, true);
                        res.json(resData);
                    }
                );
            }
        );
    }
}
