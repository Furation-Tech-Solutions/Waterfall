import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import {
  statusEnum,
  jobStatusEnum,
} from "@data/jobApplicants/models/jobApplicants-models";

interface JobApplicantInput {
  job: string;
  applicant: string;
  status: string;
  agreement: boolean;
  jobStatus: string;
  appliedTimestamp: Date;
}

const jobApplicantValidator = function (
  input: JobApplicantInput
): JobApplicantInput {
  const jobApplicantSchema = Joi.object<JobApplicantInput>({
    job: Joi.string().required().uuid().messages({
      "string.base": "Job must be a string",
      "string.empty": "Job is required",
      "string.hex": "Invalid job format",
      "any.required": "Job is required",
    }),
    applicant: Joi.string().required().uuid().messages({
      "string.base": "Applicant must be a string",
      "string.empty": "Applicant is required",
      "string.hex": "Invalid applicant format",
      "any.required": "Applicant is required",
    }),
    status: Joi.string()
      .valid(...Object.values(statusEnum))
      .required()
      .messages({
        "any.only": "Invalid status",
        "any.required": "Status is required",
      }),
    agreement: Joi.boolean().required().messages({
      "boolean.base": "Agreement must be a boolean",
      "any.required": "Agreement is required",
    }),
    jobStatus: Joi.string()
      .valid(...Object.values(jobStatusEnum))
      .required()
      .messages({
        "any.only": "Invalid job status",
        "any.required": "Job status is required",
      }),
    appliedTimestamp: Joi.date().required().messages({
      "date.base": "Applied timestamp must be a valid date",
      "any.required": "Applied timestamp is required",
    }),
  });

  const { error, value } = jobApplicantSchema.validate(input, {
    abortEarly: false,
  });

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

  return value;
};

export const validateJobApplicantInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the job applicant input using the jobApplicantValidator
    const validatedInput: JobApplicantInput = jobApplicantValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // Respond with the custom error
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

export default jobApplicantValidator;
