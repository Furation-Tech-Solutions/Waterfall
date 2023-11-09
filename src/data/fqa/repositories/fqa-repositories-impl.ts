// Import necessary modules and dependencies
import { FQAModel, FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { FQADataSource } from "@data/fqa/datasources/fqa-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

// Define the implementation class for the FQARepository interface
export class FQARepositoryImpl implements FQARepository {
    private readonly fqaDataSource: FQADataSource;

    constructor(fqaDataSource: FQADataSource) {
        this.fqaDataSource = fqaDataSource;
    }

    // Create a new FQA (Frequently Asked Question) entry
    async createFQA(fqa: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
        try {
            // Use the fqa data source to create a new FQA entry
            const fqas = await this.fqaDataSource.create(fqa);
            return Right<ErrorClass, FQAEntity>(fqas);
        } catch (error: any) {
            // Handle potential conflicts or custom errors during creation
            if (error instanceof ApiError && error.name === "question_conflict") {
                return Left<ErrorClass, FQAEntity>(ApiError.questionExist());
            }
            return Left<ErrorClass, FQAEntity>(ApiError.customError(400, error.message));
        }
    }

    // Retrieve all FQA entries
    async getFQAs(): Promise<Either<ErrorClass, FQAEntity[]>> {
        try {
            // Use the fqa data source to retrieve all FQA entries
            const fqas = await this.fqaDataSource.getAllFQAs();
            return Right<ErrorClass, FQAEntity[]>(fqas);
        } catch (e) {
            // Handle errors, such as not found or bad request, during retrieval
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, FQAEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, FQAEntity[]>(ApiError.badRequest());
        }
    }

    // Retrieve an FQA entry by its ID
    async getFQAById(id: string): Promise<Either<ErrorClass, FQAEntity>> {
        try {
            // Use the fqa data source to retrieve an FQA entry by ID
            const fqa = await this.fqaDataSource.read(id);
            return fqa
                ? Right<ErrorClass, FQAEntity>(fqa)
                : Left<ErrorClass, FQAEntity>(ApiError.notFound());
        } catch (e) {
            // Handle errors, such as not found or bad request, during retrieval by ID
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, FQAEntity>(ApiError.notFound());
            }
            return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
        }
    }

    // Update an FQA entry by ID
    async updateFQA(id: string, data: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
        try {
            // Use the fqa data source to update an FQA entry by ID
            const updatedFQA = await this.fqaDataSource.update(id, data);
            return Right<ErrorClass, FQAEntity>(updatedFQA);
        } catch (e) {
            // Handle conflicts or bad request errors during update
            if (e instanceof ApiError && e.name === "conflict") {
                return Left<ErrorClass, FQAEntity>(ApiError.emailExist());
            }
            return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
        }
    }

    // Delete an FQA entry by ID
    async deleteFQA(id: string): Promise<Either<ErrorClass, void>> {
        try {
            // Use the fqa data source to delete an FQA entry by ID
            const result = await this.fqaDataSource.delete(id);
            return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
        } catch (e) {
            // Handle errors, such as not found or bad request, during deletion
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, void>(ApiError.notFound());
            }
            return Left<ErrorClass, void>(ApiError.badRequest());
        }
    }
}
