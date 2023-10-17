// Import necessary modules and types
import Joi, { ValidationErrorItem } from "joi"; // Import Joi for input validation
import ApiError from "@presentation/error-handling/api-error"; // Import custom error handling module
import { Request, Response, NextFunction } from "express"; // Import Express types
import {
  numberOfApplicantsEnum,
  jobTypeEnum,
  feeTypeEnum,
} from "@data/job/models/job-model"; // Import enums for validation

// Define the structure of the expected input data
interface JobInput {
  jobOwner: number;
  location: string;
  address: string;
  date: Date;
  numberOfApplicants: string;
  fromTime: string;
  toTime: string;
  jobType: string;
  clientEmail: string;
  clientPhoneNumber: string;
  feeType: string;
  fee: string;
  description: string;
  attachments: string[];
  applyBy: Date;
  deleteReason: string;
  coordinates: { latitude: string; longitude: string } | null;
}

// Create a function for validating the job input
const jobValidator = function (input: JobInput): JobInput {
  // Define a schema for validating the input using Joi
  const jobSchema = Joi.object<JobInput>({
    // Validate job owner
    jobOwner: Joi.number().required(),

    // Validate location
    location: Joi.string().required().min(5).max(200).messages({
      "string.base": "Location must be a string",
      "string.empty": "Location is required",
      "string.min": "Location should be at least 5 characters",
      "string.max": "Location should be under 200 characters",
      "any.required": "Location is required",
    }),

    // Validate address
    address: Joi.string().required().messages({
      "string.base": "Address must be a string",
      "string.empty": "Address is required",
      "any.required": "Address is required",
    }),

    // Validate date
    date: Joi.date().required().messages({
      "date.base": "Date must be a valid date",
      "any.required": "Date is required",
    }),

    // Validate number of applicants
    numberOfApplicants: Joi.string()
      .valid(...Object.values(numberOfApplicantsEnum))
      .required()
      .messages({
        "any.only": "Invalid number of applicants",
        "any.required": "Number of applicants is required",
      }),

    // Validate from time
    fromTime: Joi.string().required().messages({
      "string.base": "From time must be a string",
      "string.empty": "From time is required",
      "any.required": "From time is required",
    }),

    // Validate to time
    toTime: Joi.string().required().messages({
      "string.base": "To time must be a string",
      "string.empty": "To time is required",
      "any.required": "To time is required",
    }),

    // Validate job type
    jobType: Joi.string()
      .valid(...Object.values(jobTypeEnum))
      .required()
      .messages({
        "any.only": "Invalid job type",
        "any.required": "Job type is required",
      }),

    // Validate client email
    clientEmail: Joi.string().required().email().messages({
      "string.base": "Client email must be a string",
      "string.empty": "Client email is required",
      "string.email": "Invalid client email format",
      "any.required": "Client email is required",
    }),

    // Validate client phone number
    clientPhoneNumber: Joi.string()
      .required()
      .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
      .messages({
        "string.base": "Client phone number must be a string",
        "string.empty": "Client phone number is required",
        "string.pattern.base":
          "Invalid client phone number format (e.g., 123-456-7890)",
        "any.required": "Client phone number is required",
      }),

    // Validate fee type
    feeType: Joi.string()
      .valid(...Object.values(feeTypeEnum))
      .required()
      .messages({
        "any.only": "Invalid fee type",
        "any.required": "Fee type is required",
      }),

    // Validate fee
    fee: Joi.string().required().messages({
      "string.base": "Fee must be a string",
      "string.empty": "Fee is required",
      "any.required": "Fee is required",
    }),

    // Validate description
    description: Joi.string().required().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

    // Validate attachments as an array of URIs
    attachments: Joi.array().items(Joi.string().uri()).messages({
      "array.base": "Attachments must be an array of strings",
      "array.items": "Attachments must be valid URIs",
    }),

    // Validate apply by date
    applyBy: Joi.date().required().messages({
      "date.base": "Apply by date must be a valid date",
      "any.required": "Apply by date is required",
    }),

    // Validate delete reason
    deleteReason: Joi.string().required().messages({
      "string.base": "Delete reason must be a string",
      "string.empty": "Delete reason is required",
      "any.required": "Delete reason is required",
    }),
    coordinates: Joi.object({
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        }).required().messages({
        'any.required': 'CountryCode is required',
        'string.empty': 'CountryCode cannot be empty',
      })
  });

  // Validate the input against the defined schema
  const { error, value } = jobSchema.validate(input, {
    abortEarly: false, // Collect all validation errors
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

  // If validation is successful, return the validated input
  return value;
};

// Middleware function to validate job input before processing
export const validateJobInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the job input using the jobValidator
    const validatedInput: JobInput = jobValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // Respond with a custom error if validation fails
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

// Export the jobValidator and validateJobInputMiddleware functions
export default jobValidator;
