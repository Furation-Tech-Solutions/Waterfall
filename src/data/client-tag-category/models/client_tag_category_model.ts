import { strict } from "assert";
import { array, boolean, object, string } from "joi";
import mongoose from "mongoose";

const clientTagCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name should have at least 3 characters"],
    maxlength: [30, "Name should have less than 30 characters"],
    required: [true, "Please enter a name"],
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
  },
  classification: {
    global: Boolean,
    local: Boolean,
  },
  vip: Boolean,
  display: {
    visible_to_superusers_only: Boolean,
    show_on_chit: Boolean,
    show_on_reservation_summary: Boolean,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientTag",
    },
  ],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    default: null,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ClientTagCategory = mongoose.model(
  "ClientTagCategory",
  clientTagCategorySchema
);
