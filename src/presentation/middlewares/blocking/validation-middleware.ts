// Import necessary modules and classes
import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input data for blocking
interface BlockingInput {
  fromRealtor: number;
  toRealtor: number;
}

// Define a validator function for blocking input
const blockingValidator = (
  input: BlockingInput,
  isUpdate: boolean = false
) => {
  // Define a schema for blocking input using Joi
  const blockingSchema = Joi.object<BlockingInput>({
    fromRealtor: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    toRealtor: isUpdate
      ? Joi.number().optional()
      : Joi.number().required()
  });

  // Validate the input against the schema
  const { error, value } = blockingSchema.validate(input, {
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

// Define a middleware for validating blocking input
export const validateBlockingInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's blocking input using the blockingValidator
      const validatedInput: BlockingInput = blockingValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
};
