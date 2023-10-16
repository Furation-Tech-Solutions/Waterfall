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
  friends: [];
  coordinates: { latitude: string; longitude: string } | null;
}

// Define a validator function for Realtor input
const realtorValidator = (
  input: RealtorInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Realtor input using Joi
  const realtorSchema = Joi.object<RealtorInput>({
    firstName: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "firstName should have at least 3 characters",
        "string.max": "firstName should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).required().trim().messages({
        "string.min": "firstName should have at least 3 characters",
        "string.max": "firstName should have less than 30 characters",
        "any.required": "firstName is required",
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
    email: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).required().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
        "any.required": "lastName is required",
      }),
    contact: isUpdate
      ? Joi.number().optional()
      : Joi.number().required(),
    DOB: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'Date of birth cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'Date of birth is required',
        'string.empty': 'Date of birth cannot be empty',
      }),
    gender: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'Gender cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'Gender is required',
        'string.empty': 'Gender cannot be empty',
      }),
    location: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'Location cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'Location is required',
        'string.empty': 'Location cannot be empty',
      }),
    about: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'About cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'About is required',
        'string.empty': 'About cannot be empty',
      }),
    password: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'Password cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
      }),
    profileImage: isUpdate
      ? Joi.string().optional().messages({
        'string.empty': 'ProfileImage cannot be empty',
      })
      : Joi.string().required().messages({
        'any.required': 'ProfileImage is required',
        'string.empty': 'ProfileImage cannot be empty',
      }),
    countryCode: isUpdate
      ? Joi.number().optional().messages({
        'string.empty': 'CountryCode cannot be empty',
      })
      : Joi.number().required().messages({
        'any.required': 'CountryCode is required',
        'string.empty': 'CountryCode cannot be empty',
      }),
    deleteStatus: isUpdate
      ? Joi.boolean().optional()
      : Joi.boolean().optional().default(false),
    friends: Joi.array().items(Joi.number()).optional(),
    coordinates: isUpdate
      ? Joi.object({
        latitude: Joi.string().optional(),
        longitude: Joi.string().optional(),
        }).optional().messages({
        'string.empty': 'CountryCode cannot be empty',
      })
      : Joi.object({
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        }).required().messages({
        'any.required': 'CountryCode is required',
        'string.empty': 'CountryCode cannot be empty',
      })
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
