import Joi, { ValidationErrorItem } from "joi"; // Importing Joi for input validation
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface for the expected SavedJobInput structure
interface SavedJobInput {
  realtorId: string;
  jobId: number;
}

// Define a validator function for SavedJobInput
const savedJobValidator = (input: SavedJobInput, isUpdate: boolean = false) => {
  // Define a Joi schema for validation
  const savedJobSchema = Joi.object<SavedJobInput>({
    realtorId: isUpdate ? Joi.string().optional() : Joi.string().required(),
    jobId: isUpdate ? Joi.number().optional() : Joi.number().required(),
  });

  // Validate the input against the schema
  const { error, value } = savedJobSchema.validate(input, {
    abortEarly: false,
  });

  // If validation fails, throw a custom ApiError
  if (error) {
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );
    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "),
      "ValidationError"
    );
  }

  return value; // Return the validated input
};

// Define a middleware for validating savedJob input
export const validateSavedJobInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's savedJob input using the savedJobValidator
      const validatedInput: SavedJobInput = savedJobValidator(body, isUpdate);

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};