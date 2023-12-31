import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Realtor
interface RealtorInput {
  id: string;
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
  firebaseDeviceToken: [];
  coordinates: { latitude: string; longitude: string } | null;
  recoId: string;
  connectedAccountId: string;
  linkedIn: string;
  attachmentLink: string;
  licenseExpirationDate: string;
  badge: { badgeName: string; timestamp: Date };
}

// Define a validator function for Realtor input
const realtorValidator = (
  input: RealtorInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Realtor input using Joi
  const realtorSchema = Joi.object<RealtorInput>({
    id: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "id cannot be empty",
      })
      : Joi.string().required().messages({
        "any.required": "id is required",
        "string.empty": "id cannot be empty",
      }),
    firstName: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "firstName should have at least 3 characters",
        "string.max": "firstName should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "firstName should have at least 3 characters",
        "string.max": "firstName should have less than 30 characters",
        "any.required": "firstName is required",
      }),
    lastName: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "lastName should have at least 3 characters",
        "string.max": "lastName should have less than 30 characters",
        "any.required": "lastName is required",
      }),
    email: isUpdate
      ? Joi.string().email().min(3).max(30).optional().trim().messages({
        "string.min": "email should have at least 3 characters",
        "string.max": "email should have less than 30 characters",
      })
      : Joi.string().email().min(3).max(30).required().trim().messages({
        "string.min": "email should have at least 3 characters",
        "string.max": "email should have less than 30 characters",
        "any.required": "email is required",
      }),
    contact: isUpdate
      ? Joi.string().optional().messages({
        "string.min": "contact should have at least 10 characters",
        "string.max": "contact should have less than 14 characters",
      })
      : Joi.string().required().min(10).max(14).messages({
        "string.min": "contact should have at least 10 characters",
        "string.max": "contact should have less than 14 characters",
      }),
    DOB: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "Date of birth cannot be empty",
      })
      : Joi.string().optional().messages({
        "any.required": "Date of birth is required",
        "string.empty": "Date of birth cannot be empty",
      }),
    gender: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "Gender cannot be empty",
      })
      : Joi.string().required().messages({
        "any.required": "Gender is required",
        "string.empty": "Gender cannot be empty",
      }),
    location: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "Location cannot be empty",
      })
      : Joi.string().optional().messages({
        "any.required": "Location is required",
        "string.empty": "Location cannot be empty",
      }),
    about: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "About cannot be empty",
      })
      : Joi.string().optional().messages({
        "any.required": "About is required",
        "string.empty": "About cannot be empty",
      }),
    profileImage: isUpdate
      ? Joi.string().optional().messages({
        "string.empty": "ProfileImage cannot be empty",
      })
      : Joi.string().optional().messages({
        "any.required": "ProfileImage is required",
        "string.empty": "ProfileImage cannot be empty",
      }),
    countryCode: isUpdate
      ? Joi.number().optional().messages({
        "string.empty": "CountryCode cannot be empty",
      })
      : Joi.number().optional().messages({
        "any.required": "CountryCode is required",
        "string.empty": "CountryCode cannot be empty",
      }),
    deleteStatus: isUpdate
      ? Joi.boolean().optional()
      : Joi.boolean().optional().default(false),
    firebaseDeviceToken: Joi.array().items(Joi.string()).optional(),
    coordinates: isUpdate
      ? Joi.object({
        latitude: Joi.string().optional(),
        longitude: Joi.string().optional(),
      })
        .optional()
        .messages({
          "string.empty": "CountryCode cannot be empty",
        })
      : Joi.object({
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
      })
        .optional()
        .messages({
          "any.required": "CountryCode is required",
          "string.empty": "CountryCode cannot be empty",
        }),
    recoId: isUpdate
      ? Joi.string().optional().trim().messages({
        "string.min": "recoId should have at least 3 characters",
        "string.max": "recoId should have less than 30 characters",
      })
      : Joi.string().required().trim().messages({
        "string.min": "recoId should have at least 3 characters",
        "string.max": "recoId should have less than 30 characters",
        "any.required": "recoId is required",
        "any.same": "recoId must be unique",
      }),
    connectedAccountId: Joi.string().trim().messages({
      "string.min": "connectedAccountId should have at least 3 characters",
      "string.max": "connectedAccountId should have less than 30 characters",
    }),
    linkedIn: Joi.string().trim().messages({
      "string.min": "linkedIn should have at least 3 characters",
      "string.max": "linkedIn should have less than 30 characters",
    }),
    attachmentLink: Joi.string().trim().messages({
      "string.min": "attachmentLink should have at least 3 characters",
      "string.max": "attachmentLink should have less than 30 characters",
    }),
    licenseExpirationDate: Joi.string().trim().messages({
      "string.min": "licenseExpirationDate should have at least 3 characters",
      "string.max": "licenseExpirationDate should have less than 30 characters",
    }),
      badge: Joi.object({
        badgeName: Joi.string().optional(),
        timestamp: Joi.date().optional(),
      })
        .optional()
        .messages({
          "string.empty": "badgeName cannot be empty",
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
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};
