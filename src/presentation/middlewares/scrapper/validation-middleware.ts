// Import necessary modules and types
import Joi, { ValidationErrorItem } from "joi"; // Import Joi for input validation
import ApiError from "@presentation/error-handling/api-error"; // Import custom error handling module
import { Request, Response, NextFunction } from "express"; // Import Express types


// Define the structure of the expected input data
interface scrappingInput {
  firstName: string;
  lastName: string;
  recoNumber: number;
}

// Create a function for validating the job input
const scrapperValidator = (input: scrappingInput, isUpdate: boolean = false) => {
  // Define a schema for validating the input using Joi
  const scrapperSchema = Joi.object<scrappingInput>({


    firstName: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "firstName should have at least 3 characters",
        "string.max": "firstName should have less than 30 characters",
      })
      : Joi.string().max(30).allow('').optional().trim().messages({
        // "string.min": "firstName should have at least 3 characters"
        "string.max": "firstName should have less than 30 characters",
        // "any.required": "firstName is required",
      }),
    lastName: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).required().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
        "any.required": "lastName is required",
      }),
      recoNumber: isUpdate
      ? Joi.number().integer().min(1000000).max(9999999).optional()
      : Joi.number().integer().min(1000000).max(9999999).required().messages({
        "number.base": "recoNumber must be a number",
        "number.integer": "recoNumber must be an integer",
        "number.min": "recoNumber must be a 7-digit number",
        "number.max": "recoNumber must be a 7-digit number",
        "any.required": "recoNumber is required",
      }),

    
  });

  // Validate the input against the schema
  const { error, value } = scrapperSchema.validate(input, {
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

// Define a middleware for validating job input
export const validateScrappingInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's job input using the jobValidator
      const validatedInput: scrappingInput = scrapperValidator(body, isUpdate);

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
