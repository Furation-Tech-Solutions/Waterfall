// Importing the necessary dependencies and modules
import {
    NotInterestedEntity, // Importing the NotInterestedEntity interface from the specified path
    NotInterestedModel, // Importing the NotInterestedModel interface from the specified path
  } from "@domain/notInterested/entities/notInterested_entities"; // Importing from the specified path
  import { Either } from "monet"; // Importing the 'Either' type from the 'monet' library
  import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the 'ErrorClass' class from the specified path
  
  // Definition of the NotInterestedRepository interface
  export interface NotInterestedRepository {
    // Method to create a new NotInterested record
    createNotInterested(
      notInterested: NotInterestedModel // Accepts a 'NotInterestedModel' as a parameter
    ): Promise<Either<ErrorClass, NotInterestedEntity>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'NotInterestedEntity'
  
    // Method to update an existing NotInterested record by ID
    updateNotInterested(
      id: string, // Accepts a string 'id' parameter for identifying the record
      data: NotInterestedModel // Accepts a 'NotInterestedModel' as the data to update
    ): Promise<Either<ErrorClass, NotInterestedEntity>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'NotInterestedEntity'
  
    // Method to fetch all NotInterested records
    getNotInteresteds(): Promise<Either<ErrorClass, NotInterestedEntity[]>>; // Returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or an array of 'NotInterestedEntity' objects
  
    // Method to fetch a NotInterested record by its ID
    getNotInterestedById(id: string): Promise<Either<ErrorClass, NotInterestedEntity>>; // Accepts a string 'id' parameter and returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'NotInterestedEntity'
  
    // Method to delete a NotInterested record by its ID
    deleteNotInterested(id: string): Promise<Either<ErrorClass, void>>; // Accepts a string 'id' parameter and returns a Promise that resolves to an 'Either' type containing 'ErrorClass' or 'void' (indicating successful deletion)
  }