// Import necessary modules and classes
import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define an interface for the RealtorRepository
export interface RealtorRepository {
  // Method to create a new Realtor
  createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>>;

  // Method to retrieve all Realtors
  getRealtors(query: object, page: number, limit: number): Promise<Either<ErrorClass, RealtorEntity[]>>;

  // Method to retrieve a Realtor by ID
  getRealtorById(id: string): Promise<Either<ErrorClass, RealtorEntity>>;

  // Method to update a Realtor by ID
  updateRealtor(id: string, data: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>>;

  // Method to delete a Realtor by ID
  deleteRealtor(id: string): Promise<Either<ErrorClass, void>>;
}
