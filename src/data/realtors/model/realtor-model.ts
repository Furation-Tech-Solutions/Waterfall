import mongoose from "mongoose";

const realtorSchema = new mongoose.Schema({
  firstName: { type: String, required: true,  maxLength: [50, "name should be under 50 Characters"], trim: true },
  lastName: { type: String, required: true, maxLength: [50, "name should be under 50 Characters"], trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  contact: { type: Number, required: true },
  DOB: { type: String, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  about: { type: String, required: true },
  password: { type: String, required: true , minlength: [5, "Password must be at least 5 characters"], select: false },
  profileImage: {type: String, required: true},
  countryCode: { type: Number, required: true },
  deleteStatus: { type: Boolean, default: true },

  // RECO fields
  // recoRegistrationNumber: { type: String, required: true },
  // recoRegistrationStatus: { type: String, required: true },
  // recoLicenseType: { type: String, required: true },
  // recoLicenseExpiry: { type: Date, required: true },
  // recoLicenseIssuedDate: { type: Date, required: true },
  // recoAgencyName: { type: String, required: true },
  // recoAgencyRegistrationNumber: { type: String, required: true },
  // recoAgencyAddress: { type: String, required: true },
  // recoAgencyPhone: { type: String, required: true }
});

export const Realtor = mongoose.model("Realtor", realtorSchema);