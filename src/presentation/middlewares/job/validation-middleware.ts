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
  jobOwnerId: string;
  location: string;
  address: string;
  date: Date;
  numberOfApplicants: string;
  fromTime: string;
  toTime: string;
  applyBy: Date;
  jobType: string;
  clientEmail: string;
  clientPhoneNumber: string;
  feeType: string;
  fee: string;
  description: string;
  attachments: string[];
  deleteReason: string;
  jobProgress: string;
  coordinates: { latitude: string; longitude: string } | null;
  liveStatus: boolean;
  urgentRequirement: boolean;
}

// Create a function for validating the job input
const jobValidator = (input: JobInput, isUpdate: boolean = false) => {
  // Define a schema for validating the input using Joi
  const jobSchema = Joi.object<JobInput>({
    // Validate job owner
    jobOwnerId: isUpdate ? Joi.string().optional() : Joi.string().required(),

    // Validate location
    location: isUpdate
      ? Joi.string().optional().min(5).max(200).messages({
        "string.base": "Location must be a string",
        "string.min": "Location should be at least 5 characters",
        "string.max": "Location should be under 200 characters",
        "any.required": "Location is required",
      })
      : Joi.string().required().min(5).max(200).messages({
        "string.base": "Location must be a string",
        "string.empty": "Location is required",
        "string.min": "Location should be at least 5 characters",
        "string.max": "Location should be under 200 characters",
        "any.required": "Location is required",
      }),

    // Validate address
    address: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "Address must be a string",
        "string.empty": "Address is required",
        "any.required": "Address is required",
      })
      : Joi.string().required().messages({
        "string.base": "Address must be a string",
        "string.empty": "Address is required",
        "any.required": "Address is required",
      }),

    // Validate date
    date: isUpdate
      ? Joi.date().optional().messages({
        "date.base": "Date must be a valid date",
        "any.required": "Date is required",
      })
      : Joi.date().required().messages({
        "date.base": "Date must be a valid date",
        "any.required": "Date is required",
      }),

    // Validate number of applicants
    numberOfApplicants: isUpdate
      ? Joi.string()
        .valid(...Object.values(numberOfApplicantsEnum))
        .optional()
        .messages({
          "any.only": "Invalid number of applicants",
          "any.required": "Number of applicants is required",
        })
      : Joi.string()
        .valid(...Object.values(numberOfApplicantsEnum))
        .required()
        .messages({
          "any.only": "Invalid number of applicants",
          "any.required": "Number of applicants is required",
        }),

    // Validate from time
    fromTime: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "From time must be a string",
        "string.empty": "From time is required",
        "any.required": "From time is required",
      })
      : Joi.string().required().messages({
        "string.base": "From time must be a string",
        "string.empty": "From time is required",
        "any.required": "From time is required",
      }),

    // Validate to time
    toTime: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "To time must be a string",
        "string.empty": "To time is required",
        "any.required": "To time is required",
      })
      : Joi.string().required().messages({
        "string.base": "To time must be a string",
        "string.empty": "To time is required",
        "any.required": "To time is required",
      }),
    applyBy: isUpdate
      ? Joi.date().optional().messages({
        "applyBy.base": "applyBy must be a valid date",
      })
      : Joi.date().required().messages({
        "applyBy.base": "applyBy must be a valid date",
        "any.required": "applyBy is required",
      }),

    // Validate job type
    jobType: isUpdate
      ? Joi.string()
        .valid(...Object.values(jobTypeEnum))
        .optional()
        .messages({
          "any.only": "Invalid job type",
          "any.required": "Job type is required",
        })
      : Joi.string()
        .valid(...Object.values(jobTypeEnum))
        .required()
        .messages({
          "any.only": "Invalid job type",
          "any.required": "Job type is required",
        }),

    // Validate client email
    clientEmail: isUpdate
      ? Joi.string().optional().email().messages({
        "string.base": "Client email must be a string",
        "string.email": "Invalid client email format",
      })
      : Joi.string().optional().email().messages({
        "string.base": "Client email must be a string",
        "string.email": "Invalid client email format",
      }),

    // Validate client phone number
    clientPhoneNumber: isUpdate
      ? Joi.string()
        .optional()
        // .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
        .messages({
          "string.base": "Client phone number must be a string",
        })
      : Joi.string()
        .optional()
        // .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
        .messages({
          "string.base": "Client phone number must be a string",
        }),

    // Validate fee type
    feeType: isUpdate
      ? Joi.string()
        .valid(...Object.values(feeTypeEnum))
        .optional()
        .messages({
          "any.only": "Invalid fee type",
          "any.required": "Fee type is required",
        })
      : Joi.string()
        .valid(...Object.values(feeTypeEnum))
        .required()
        .messages({
          "any.only": "Invalid fee type",
          "any.required": "Fee type is required",
        }),

    // Validate fee
    fee: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "Fee must be a string",
        "string.empty": "Fee is required",
        "any.required": "Fee is required",
      })
      : Joi.string().required().messages({
        "string.base": "Fee must be a string",
        "string.empty": "Fee is required",
        "any.required": "Fee is required",
      }),

    // Validate description
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

    // Validate attachments as an array of URIs
    attachments: isUpdate
      ? Joi.array().items(Joi.string().uri()).messages({
        "array.base": "Attachments must be an array of strings",
        "array.items": "Attachments must be valid URIs",
      })
      : Joi.array().items(Joi.string().uri()).messages({
        "array.base": "Attachments must be an array of strings",
        "array.items": "Attachments must be valid URIs",
      }),
    // Validate delete reason
    deleteReason: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "Delete reason must be a string",
        "string.empty": "Delete reason is required",
        "any.required": "Delete reason is required",
      })
      : Joi.string().optional().messages({
        "string.base": "Delete reason must be a string",
        "string.empty": "Delete reason is required",
        "any.required": "Delete reason is required",
      }),
    jobProgress: isUpdate
      ? Joi.string().optional().messages({
        "string.base": "jobProgress must be a string",
      })
      : Joi.string().optional().messages({
        "string.base": "jobProgress must be a string",
      }),
    coordinates: Joi.object({
      latitude: Joi.string().optional(),
      longitude: Joi.string().optional(),
    }),
    liveStatus: isUpdate
      ? Joi.boolean().optional().messages({
        "boolean.base": "liveStatus must be a boolean",
        "any.required": "liveStatus is required",
      })
      : Joi.boolean().optional().messages({
        "boolean.base": "liveStatus must be a boolean",
        "any.required": "liveStatus is required",
      }),
    urgentRequirement: isUpdate
      ? Joi.boolean().optional().messages({
        "boolean.base": "urgentRequirement must be a boolean",
        "any.required": "urgentRequirement is required",
      })
      : Joi.boolean().optional().messages({
        "boolean.base": "urgentRequirement must be a boolean",
        "any.required": "urgentRequirement is required",
      }),
  });

  // Validate the input against the schema
  const { error, value } = jobSchema.validate(input, {
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
export const validateJobInputMiddleware = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's job input using the jobValidator
      const validatedInput: JobInput = jobValidator(body, isUpdate);

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
