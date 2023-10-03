import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { statusEnum } from "@data/upcomingTask/models/upcomingTasks-models"; // Assuming you have this enum

interface UpcomingTaskInput {
  jobApplicant: string;
  status: string;
}

const upcomingTaskValidator = function (
  input: UpcomingTaskInput
): UpcomingTaskInput {
  const taskSchema = Joi.object<UpcomingTaskInput>({
    jobApplicant: Joi.string().required().uuid().messages({
      "string.base": "Job applicant must be a string",
      "string.empty": "Job applicant is required",
      "string.uuid": "Invalid job applicant format",
      "any.required": "Job applicant is required",
    }),
    status: Joi.string()
      .valid(...Object.values(statusEnum))
      .required()
      .messages({
        "any.only": "Invalid status",
        "any.required": "Status is required",
      }),
  });

  const { error, value } = taskSchema.validate(input, {
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

export const validateUpcomingTaskInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the upcoming task input using the upcomingTaskValidator
    const validatedInput: UpcomingTaskInput = upcomingTaskValidator(body);

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

export default upcomingTaskValidator;
