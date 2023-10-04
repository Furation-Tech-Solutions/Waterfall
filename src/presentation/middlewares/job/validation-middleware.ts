import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { numberOfApplicantsEnum, jobTypeEnum, feeTypeEnum  } from "@data/job/models/job-model";

interface JobInput {
    jobOwner: string;
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
}

const jobValidator = function (input: JobInput): JobInput {
    const jobSchema = Joi.object<JobInput>({
        jobOwner: Joi.string().required().hex().messages({
            "string.base": "Job owner must be a string",
            "string.empty": "Job owner is required",
            "string.hex": "Invalid job owner format",
            "any.required": "Job owner is required",
        }),
        location: Joi.string().required().min(5).max(200).messages({
            "string.base": "Location must be a string",
            "string.empty": "Location is required",
            "string.min": "Location should be at least 5 characters",
            "string.max": "Location should be under 200 characters",
            "any.required": "Location is required",
        }),
        address: Joi.string().required().messages({
            "string.base": "Address must be a string",
            "string.empty": "Address is required",
            "any.required": "Address is required",
        }),
        date: Joi.date().required().messages({
            "date.base": "Date must be a valid date",
            "any.required": "Date is required",
        }),
        numberOfApplicants: Joi.string()
            .valid(...Object.values(numberOfApplicantsEnum))
            .required()
            .messages({
                "any.only": "Invalid number of applicants",
                "any.required": "Number of applicants is required",
            }),
        fromTime: Joi.string().required().messages({
            "string.base": "From time must be a string",
            "string.empty": "From time is required",
            "any.required": "From time is required",
        }),
        toTime: Joi.string().required().messages({
            "string.base": "To time must be a string",
            "string.empty": "To time is required",
            "any.required": "To time is required",
        }),
        jobType: Joi.string()
            .valid(...Object.values(jobTypeEnum))
            .required()
            .messages({
                "any.only": "Invalid job type",
                "any.required": "Job type is required",
            }),
        clientEmail: Joi.string().required().email().messages({
            "string.base": "Client email must be a string",
            "string.empty": "Client email is required",
            "string.email": "Invalid client email format",
            "any.required": "Client email is required",
        }),
        clientPhoneNumber: Joi.string()
            .required()
            .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
            .messages({
                "string.base": "Client phone number must be a string",
                "string.empty": "Client phone number is required",
                "string.pattern.base": "Invalid client phone number format (e.g., 123-456-7890)",
                "any.required": "Client phone number is required",
            }),
        feeType: Joi.string()
            .valid(...Object.values(feeTypeEnum))
            .required()
            .messages({
                "any.only": "Invalid fee type",
                "any.required": "Fee type is required",
            }),
        fee: Joi.string().required().messages({
            "string.base": "Fee must be a string",
            "string.empty": "Fee is required",
            "any.required": "Fee is required",
        }),
        description: Joi.string().required().messages({
            "string.base": "Description must be a string",
            "string.empty": "Description is required",
            "any.required": "Description is required",
        }),
        attachments: Joi.array()
            .items(Joi.string().uri())
            .messages({
                "array.base": "Attachments must be an array of strings",
                "array.items": "Attachments must be valid URIs",
            }),
        applyBy: Joi.date().required().messages({
            "date.base": "Apply by date must be a valid date",
            "any.required": "Apply by date is required",
        }),
    });

    const { error, value } = jobSchema.validate(input, {
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

        // Respond with the custom error
        const err = ApiError.badRequest();
        return res.status(err.status).json(err.message);
    }
};

export default jobValidator;
