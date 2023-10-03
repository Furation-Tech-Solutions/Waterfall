import mongoose from "mongoose";

const faqsSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  createdDate: { type: Date, default: Date.now },
  deleteStatus: { type: Boolean, default: true }

});

export const FAQS = mongoose.model("FAQS", faqsSchema);