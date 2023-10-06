import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Realtor
interface RealtorInput {
  firstName: string;
  lastName: string;
  email: string;
  contact: number;
  DOB: string;
  gender: string;
  location: string;
  about: string;
  password: string;
  profileImage: string;
  countryCode: number;
  deleteStatus: boolean;
}

// Define a validator function for Realtor input
const realtorValidator = (
  input: RealtorInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Realtor input using Joi
  const realtorSchema = Joi.object<RealtorInput>({
    firstName: isUpdate
      ? Joi.string().min(3).max(30).optional()
      : Joi.string().min(3).max(30).optional(),
    lastName: isUpdate
      ? Joi.string().min(3).max(30).optional()
      : Joi.string().min(3).max(30).optional(),
    email: isUpdate
      ? Joi.string().min(3).max(30).optional()
      : Joi.string().min(3).max(30).optional(),
    contact: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    DOB: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    gender: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    location: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    about: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    password: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    profileImage: isUpdate
      ? Joi.string().optional()
      : Joi.string().optional(),
    countryCode: isUpdate
      ? Joi.number().optional()
      : Joi.number().optional(),
    deleteStatus: isUpdate
      ? Joi.boolean().optional()
      : Joi.boolean().optional().default(false)
  });

  // Validate the input against the schema
  const { error, value } = realtorSchema.validate(input, {
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

// Define a middleware for validating Realtor input
export const validateRealtorInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Realtor input using the realtorValidator
      const validatedInput: RealtorInput = realtorValidator(
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
