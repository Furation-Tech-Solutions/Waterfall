// Import necessary modules and dependencies
import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { RealtorDataSource, RealtorQuery } from "@data/realtors/datasources/realtor-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Define the implementation of the RealtorRepository interface
export class RealtorRepositoryImpl implements RealtorRepository {
    private readonly realtorDataSource: RealtorDataSource;

    constructor(realtorDataSource: RealtorDataSource) {
        this.realtorDataSource = realtorDataSource;
    }

    // Create a new Realtor entity
    async createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
        try {
            const realtors = await this.realtorDataSource.create(realtor); // Use the realtor data source
            return Right<ErrorClass, RealtorEntity>(realtors);
        } catch (error: any) {
            if (error instanceof ApiError && error.name === "realtor_conflict") {
                return Left<ErrorClass, RealtorEntity>(ApiError.realtorExist());
            }
            return Left<ErrorClass, RealtorEntity>(ApiError.customError(400, error.message));
        }
    }

    // Get all Realtor entities
    async getRealtors(query: RealtorQuery): Promise<Either<ErrorClass, RealtorEntity[]>> {
        try {
          const realtors = await this.realtorDataSource.getAllRealtors(query); // Use the tag realtor data source
          // Check if the data length is zero
          if (realtors.length === 0) {
            // If data length is zero, throw a "404 Not Found" error
            return Left<ErrorClass, RealtorEntity[]>(ApiError.dataNotFound());
          }
          return Right<ErrorClass, RealtorEntity[]>(realtors);
        } catch (error: any) {
            // Check if the error is an instance of ApiError and has a status of 404 (Not Found)
            if (error instanceof ApiError && error.status === 404) {
                // Return a Left monad with a not found error
                return Left<ErrorClass, RealtorEntity[]>(ApiError.notFound());
            }

            // Return a Left monad with a custom error and the error message
            return Left<ErrorClass, RealtorEntity[]>(
                ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
            );
        }
    }

    // Get a Realtor entity by ID
    async getRealtorById(id: string): Promise<Either<ErrorClass, RealtorEntity>> {
        try {
            const realtor = await this.realtorDataSource.read(id);// Use the tag realtor data source
            return Right<ErrorClass, RealtorEntity>(realtor)
        } catch (e) {
            if (e instanceof ApiError && e.name === "data not found") {
                return Left<ErrorClass, RealtorEntity>(ApiError.dataNotFound());
            }
            return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
        }
    }

    // Update a Realtor entity by ID
    async updateRealtor(
        id: string,
        data: RealtorModel
    ): Promise<Either<ErrorClass, RealtorEntity>> {
        try {
            const updatedRealtor = await this.realtorDataSource.update(id, data); // Use the tag realtor data source
            return Right<ErrorClass, RealtorEntity>(updatedRealtor);
        } catch (e) {
            if (e instanceof ApiError && e.name === "conflict") {
                return Left<ErrorClass, RealtorEntity>(ApiError.emailExist());
            }
            return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
        }
    }

    // Delete a Realtor entity by ID
    async deleteRealtor(id: string): Promise<Either<ErrorClass, void>> {
        try {
            const result = await this.realtorDataSource.delete(id); 
            return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
        } catch (e) {
            if (e instanceof ApiError && e.name === "notfound") {
                return Left<ErrorClass, void>(ApiError.notFound());
            }
            return Left<ErrorClass, void>(ApiError.badRequest());
        }
    }
    async loginRealtor(email:string, firebaseDeviceToken: string): Promise<Either<ErrorClass, RealtorEntity>>{
        try{
          const request = await this.realtorDataSource.realtorLogin(email, firebaseDeviceToken); // Use the booking request data source
          return request
              ? Right<ErrorClass, RealtorEntity>(request)
              : Left<ErrorClass, RealtorEntity>(ApiError.notFound());
        }
        catch(err){
          return Left<ErrorClass, RealtorEntity>(ApiError.badRequest());
        }
      }
}
