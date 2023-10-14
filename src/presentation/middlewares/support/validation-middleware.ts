import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the shape of the input data using an interface
interface SupportInput {
  realtor: number;
  to: number;
  description: string;
  attachments: string[] | undefined;
  timestamp?: Date;
}

// Define a supportValidator function to validate the input
const supportValidator = function (input: SupportInput): SupportInput {
  // Define a Joi schema to validate the SupportInput object
  const supportSchema = Joi.object<SupportInput>({
    realtor: Joi.number().required(),
    to: Joi.number().required(),
    description: Joi.string().required().min(1).max(1000).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description should be at least 1 character",
      "string.max": "Description should be under 1000 characters",
      "any.required": "Description is required",
    }),
    attachments: Joi.array().items(Joi.string().uri()).messages({
      "array.base": "Attachments must be an array of strings",
      "array.items": "Attachments must be valid URIs",
    }),
    timestamp: Joi.date().default(new Date()).messages({
      "date.base": "Report timestamp must be a valid date",
    }),
  });

  // Validate the input against the schema
  const { error, value } = supportSchema.validate(input, {
    abortEarly: false, // Collect all validation errors
  });

  // If there are validation errors, throw an ApiError
  if (error) {
    // Extract validation error messages
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );

    // Create and throw an ApiError with the validation errors
    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "),
      "ValidationError"
    );
  }

  // Return the validated input data
  return value;
};

// Define a middleware function to validate support input in a request
export const validateSupportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the support input using the supportValidator
    const validatedInput: SupportInput = supportValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      // If the error is an ApiError, respond with the error status and message
      return res.status(error.status).json(error.message);
    }

    // If it's not an ApiError, respond with a default bad request error
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

// Export the supportValidator function
export default supportValidator;
