import mongoose from "mongoose";

const realtorSchema = new mongoose.Schema({
  firstName: { type: String, required: true,  maxLength: [50, "name should be under 50 Characters"], trim: true },
  lastName: { type: String, required: true, maxLength: [50, "name should be under 50 Characters"], trim: true },
  address: {
    streetName: { type: String, required: true },
    landMark: { type: String, required: true  },
    city: { type: String, required: true },
    pinCode: { type: Number, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true , minlength: [5, "Password must be at least 5 characters"], select: false },
  phone: { type: Number, required: true, maxLength: [13, "Phone number should be under 13 Number"] },
  aadharCard: { type: Number, maxLength: 12, required: true },
  yearsOfExperience: Number,
  specialization: { type: String, maxLength: 50 },
  deleteStatus: { type: Boolean, default: true }
});

export const Realtor = mongoose.model("Realtor", realtorSchema);