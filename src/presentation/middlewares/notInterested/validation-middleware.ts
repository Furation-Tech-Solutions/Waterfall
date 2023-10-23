import Joi, { ValidationErrorItem } from "joi"; // Importing Joi for input validation
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define an interface for the expected NotInterestedInput structure
interface NotInterestedInput {
  realtor: number;
  job: number;
}

// Define a validator function for NotInterestedInput
const notInterestedValidator = function (input: NotInterestedInput): NotInterestedInput {
  // Define a Joi schema for validation
  const notInterestedSchema = Joi.object<NotInterestedInput>({
    realtor: Joi.number().required().messages({
      "string.base": "Realtor must be a number",
      "string.empty": "Realtor is required",
      "any.required": "Realtor is required",
    }),
    job: Joi.number().required().messages({
      "string.base": "Job must be a number",
      "string.empty": "Job is required",
      "any.required": "Job is required",
    }),
  });

  // Validate the input against the schema
  const { error, value } = notInterestedSchema.validate(input, {
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

// Middleware function for validating NotInterestedInput
export const validateNotInterestedInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the agreement input using the notInterestedValidator
    const validatedInput: NotInterestedInput = notInterestedValidator(body);

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

export default notInterestedValidator; // Export the validator function
