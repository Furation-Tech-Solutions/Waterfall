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
const supportValidator = (input: SupportInput, isUpdate: boolean = false) => {
  // Define a Joi schema to validate the SupportInput object
  const supportSchema = Joi.object<SupportInput>({
    realtor: isUpdate ? Joi.number().optional() : Joi.number().required(),
    to: isUpdate ? Joi.number().optional() : Joi.number().required(),
    description: isUpdate
      ? Joi.string().optional().min(1).max(1000).messages({
          "string.base": "Description must be a string",
          "string.empty": "Description is required",
          "string.min": "Description should be at least 1 character",
          "string.max": "Description should be under 1000 characters",
          "any.required": "Description is required",
        })
      : Joi.string().required().min(1).max(1000).messages({
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

// Define a middleware for validating support input
export const validateSupportInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's support input using the supportValidator
      const validatedInput: SupportInput = supportValidator(body, isUpdate);

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
