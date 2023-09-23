import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface ClientTagCategoryInput {
  name: string;
  color: string;
  classification: {
    global?: boolean;
    local?: boolean;
  };
  vip: boolean;
  display: {
    visible_to_superusers_only?: boolean;
    show_on_chit?: boolean;
    show_on_reservation_summary?: boolean;
  };
  followers?: mongoose.Schema.Types.ObjectId[];
  tags?: { name: string }[];
  updatedBy: string;
  createdBy: string;
}

const clientTagCategoryValidator = (
  input: ClientTagCategoryInput,
  isUpdate: boolean = false
) => {
  const clientTagCategorySchema = Joi.object<ClientTagCategoryInput>({
    name: isUpdate
      ? Joi.string().min(3).max(30).optional().trim().messages({
        "string.min": "Name should have at least 3 characters",
        "string.max": "Name should have less than 30 characters",
      })
      : Joi.string().min(3).max(30).required().trim().messages({
        "string.min": "Name should have at least 3 characters",
        "string.max": "Name should have less than 30 characters",
        "any.required": "Name is required",
      }),

    color: isUpdate
      ? Joi.string().optional().trim().messages({
        "any.required": "Color is required",
      })
      : Joi.string().required().trim().messages({
        "any.required": "Color is required",
      }),

    classification: isUpdate
      ? Joi.object({
        global: Joi.boolean().optional(),
        local: Joi.boolean().optional(),
      }).optional()
      : Joi.object({
        global: Joi.boolean().optional(),
        local: Joi.boolean().optional(),
      }).optional(),

    vip: Joi.boolean().optional().messages({
      "any.required": "VIP status is optional",
    }),

    display: Joi.object({
      visible_to_superusers_only: Joi.boolean().optional(),
      show_on_chit: Joi.boolean().optional(),
      show_on_reservation_summary: Joi.boolean().optional(),
    }).optional(),

    followers: Joi.array().items(Joi.string().trim()).optional().messages({
      "array.base": "Followers must be an array of strings",
    }),

    tags: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().trim().messages({
            "any.required": "Tag name is required",
          }),
        })
      )
      .optional()
      .messages({
        "array.base": "Tags must be an array of objects",
      }),
    updatedBy: isUpdate
      ? Joi.string().trim().required().messages({
        "any.required": "Please select the Updated By",
      })
      : Joi.string().trim().optional().messages({
        "any.required": "Please select the Update By",
      }),
    createdBy: isUpdate
      ? Joi.string().trim().optional().messages({
        "any.required": "Please select the Created By",
      })
      : Joi.string().trim().required().messages({
        "any.required": "Please select the Created By",
      }),
  });

  const { error, value } = clientTagCategorySchema.validate(input, {
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

export const validateClientTagCategoryInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client tag category input using the clientTagCategoryValidator
      const validatedInput: ClientTagCategoryInput = clientTagCategoryValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // if (error instanceof ApiError) {
      //   return res.status(error.status).json(error.message);
      // }

      // Respond with the custom error
      // const err = ApiError.badRequest();
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  };
};
