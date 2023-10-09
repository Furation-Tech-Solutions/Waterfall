// Importing the necessary dependencies and modules
import {
  SavedJobEntity, // Importing the SavedJobEntity interface from the specified path
  SavedJobModel, // Importing the SavedJobModel interface from the specified path
} from "@domain/savedJobs/entities/savedJobs"; // Importing from the specified path
import { Either } from "monet"; // Importing the 'Either' type from the 'monet' library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the 'ErrorClass' class from the specified path

// Definition of the SavedJobRepository interface
export interface SavedJobRepository {
  // Method to create a new SavedJob record
  createSavedJob(
    savedJob: SavedJobModel // Accepts a 'SavedJobModel' as a parameter
  ): Promise<Either<ErrorClass, SavedJobEntity>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'SavedJobEntity'

  // Method to update an existing SavedJob record by ID
  updateSavedJob(
    id: string, // Accepts a string 'id' parameter for identifying the record
    data: SavedJobModel // Accepts a 'SavedJobModel' as the data to update
  ): Promise<Either<ErrorClass, SavedJobEntity>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'SavedJobEntity'

  // Method to fetch all SavedJob records
  getSavedJobs(): Promise<Either<ErrorClass, SavedJobEntity[]>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or an array of 'SavedJobEntity' objects

  // Method to fetch a SavedJob record by its ID
  getSavedJobById(id: string): Promise<Either<ErrorClass, SavedJobEntity>>; // Accepts a string 'id' parameter and returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'SavedJobEntity'

  // Method to delete a SavedJob record by its ID
  deleteSavedJob(id: string): Promise<Either<ErrorClass, void>>; // Accepts a string 'id' parameter and returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'void' (indicating successful deletion)
}
