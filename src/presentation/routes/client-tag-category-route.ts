import mongoose from "mongoose";
import { Router } from "express";
import { ClientTagCategoryServices } from "@presentation/services/client-tag-category-services"; // Import the TagCategoryServices
import { ClientTagCategoryDataSourceImpl } from "@data/client-tag-category/datasource/client_tag_Category-datasource"; // Import the TagCategoryDataSourceImpl
import { ClientTagCategoryRepositoryImpl } from "@data/client-tag-category/repository/client_tag_category-repo-impl"; // Import the TagCategoryRepositoryImpl
import { CreateClientTagCategory } from "@domain/client-tag-category/usecases/create-client_tags_category"; // Import tag category-related use cases
import { DeleteClientTagCategory } from "@domain/client-tag-category/usecases/delete-client_tags_category";
import { GetClientTagCategoryById } from "@domain/client-tag-category/usecases/get-client_tag_category-by-id";
import { GetAllClientTagCategories } from "@domain/client-tag-category/usecases/get-all-client_tag_category";
import { UpdateClientTagCategory } from "@domain/client-tag-category/usecases/update-client_tag_category";

import { validateClientTagCategoryInputMiddleware } from "@presentation/middlewares/client-tag-category/validation-client-tag-category";
// Create an instance of the TagCategoryDataSourceImpl and pass the mongoose connection
const clientTagCategoryDataSource = new ClientTagCategoryDataSourceImpl(mongoose.connection);

// Create an instance of the TagCategoryRepositoryImpl and pass the TagCategoryDataSourceImpl
const clienttagCategoryRepository = new ClientTagCategoryRepositoryImpl(clientTagCategoryDataSource);

// Create instances of the required use cases and pass the TagCategoryRepositoryImpl
const createClientTagCategoryUsecase = new CreateClientTagCategory(clienttagCategoryRepository);
const deleteClientTagCategoryUsecase = new DeleteClientTagCategory(clienttagCategoryRepository);
const getClientTagCategoryByIdUsecase = new GetClientTagCategoryById(clienttagCategoryRepository);
const getAllClientTagCategoriesUsecase = new GetAllClientTagCategories(clienttagCategoryRepository);
const updateClientTagCategoryUsecase = new UpdateClientTagCategory(clienttagCategoryRepository);

// Initialize TagCategoryServices and inject required dependencies
const clientTagCategoryService = new ClientTagCategoryServices(
    createClientTagCategoryUsecase,
    deleteClientTagCategoryUsecase,
    getClientTagCategoryByIdUsecase,
    getAllClientTagCategoriesUsecase,
    updateClientTagCategoryUsecase
);

// Create an Express router
export const clientTagCategoryRouter = Router();

// Route handling for creating a new tag category
clientTagCategoryRouter.post(
    "/add",
    validateClientTagCategoryInputMiddleware(false),
    clientTagCategoryService.createClientTagCategory.bind(clientTagCategoryService)
);

// Route handling for deleting a tag category by ID
clientTagCategoryRouter.delete(
    "/:ClientTagCategoryId",
    clientTagCategoryService.deleteClientTagCategory.bind(clientTagCategoryService)
);

// Route handling for getting a tag category by ID
clientTagCategoryRouter.get(
    "/:ClientTagCategoryId",
    clientTagCategoryService.getClientTagCategoryById.bind(clientTagCategoryService)
);

// Route handling for getting all tag categories
clientTagCategoryRouter.get("/", clientTagCategoryService.getAllClientTagCategories.bind(clientTagCategoryService));

// Route handling for updating a tag category by ID
clientTagCategoryRouter.put(
    "/:ClientTagCategoryId",
    validateClientTagCategoryInputMiddleware(true),
    clientTagCategoryService.updateClientTagCategory.bind(clientTagCategoryService)
);

