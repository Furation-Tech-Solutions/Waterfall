import Joi, { ValidationErrorItem } from "joi"; // Importing Joi for input validation
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface for the expected SavedJobInput structure
interface SavedJobInput {
  Realtor: string;
  Job: string;
}

// Define a validator function for SavedJobInput
const savedJobValidator = function (input: SavedJobInput): SavedJobInput {
  // Define a Joi schema for validation
  const savedJobSchema = Joi.object<SavedJobInput>({
    Realtor: Joi.string().required().uuid().messages({
      "string.base": "Realtor must be a string",
      "string.empty": "Realtor is required",
      "string.hex": "Invalid Realtor format",
      "any.required": "Realtor is required",
    }),
    Job: Joi.string().required().uuid().messages({
      "string.base": "Job must be a string",
      "string.empty": "Job is required",
      "string.hex": "Invalid Job format",
      "any.required": "Job is required",
    }),
  });

  // Validate the input against the schema
  const { error, value } = savedJobSchema.validate(input, {
    abortEarly: false,
  });

  // If there are validation errors, throw an ApiError
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

  // If validation passes, return the validated value
  return value;
};

// Middleware function for validating SavedJobInput
export const validateSavedJobInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the agreement input using the savedJobValidator
    const validatedInput: SavedJobInput = savedJobValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors during validation
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // Respond with a custom error for other types of errors
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

export default savedJobValidator; // Export the validator function
