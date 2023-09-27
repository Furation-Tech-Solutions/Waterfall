import Joi, { Schema } from "joi";
import { RealtorModel } from "@domain/realtors/entities/realtors";
import { Request, Response, NextFunction } from 'express';

// Define a custom type that extends the Express Request type
interface CustomRequest extends Request {
    validatedRealtorData?: RealtorModel; // Assuming RealtorModel is the type for the validated realtor data
  }

const realtorSchema: Schema<RealtorModel> = Joi.object({
  firstName: Joi.string()
    .required()
    .max(50)
    .trim()
    .messages({
      'any.required': 'First name is required',
      'string.empty': 'First name cannot be empty',
      'string.max': 'First name should be under 50 characters',
    }),
  lastName: Joi.string()
    .required()
    .max(50)
    .trim()
    .messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name cannot be empty',
      'string.max': 'Last name should be under 50 characters',
    }),
  email: Joi.string()
    .required()
    .email()
    .trim()
    .lowercase()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
    }),
  contact: Joi.number()
    .required()
    .messages({
      'any.required': 'Contact number is required',
      'number.base': 'Contact number must be a number',
    }),
  DOB: Joi.string()
    .required()
    .messages({
      'any.required': 'Date of birth is required',
      'string.empty': 'Date of birth cannot be empty',
    }),
  gender: Joi.string()
    .required()
    .messages({
      'any.required': 'Gender is required',
      'string.empty': 'Gender cannot be empty',
    }),
  location: Joi.string()
    .required()
    .messages({
      'any.required': 'Location is required',
      'string.empty': 'Location cannot be empty',
    }),
  about: Joi.string()
    .required()
    .messages({
      'any.required': 'About is required',
      'string.empty': 'About cannot be empty',
    }),
  password: Joi.string()
    .required()
    .min(5)
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 5 characters',
    }),
  profileImage: Joi.string()
    .required()
    .messages({
      'any.required': 'Profile image is required',
      'string.empty': 'Profile image cannot be empty',
    }),
  countryCode: Joi.number()
    .required()
    .messages({
      'any.required': 'Country code is required',
      'number.base': 'Country code must be a number',
    }),
  deleteStatus: Joi.boolean().default(true)
  });
  
function validateRealtorMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  const realtorData: RealtorModel = req.body; // Assuming the realtor data is sent in the request body

  const { error, value } = realtorSchema.validate(realtorData);

  if (error) {
    // Return a 400 Bad Request response with validation error details
    return res.status(400).json({ error: error.message });
  }

  // If validation succeeds, attach the validated realtor data to the request object for further processing in the route handler
  req.validatedRealtorData = value;
  next();
}

export default validateRealtorMiddleware;

