import { Document } from "mongoose";

export interface IProgramSchedule extends Document {
    title: string;
    startDate: Date;
    endDate?: Date | null;
    daysOfWeek: string[];
    shifts: string[];
    cuisine?: string;
    pricePoint?: string;
    description?: string;
    dressCode?: string;
    tableHoldingPolicy?: string;
    spendPolicy?: string;
    childPolicy?: string;
  }