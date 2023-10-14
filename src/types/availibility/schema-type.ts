

import { Document } from 'mongoose';

export interface IShiftProperty extends Document {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  location: string;
  gender: string;
  
}

export interface ShiftWithTimeSlots {
  id: number| undefined;
  location: string;
  gender: string;
  timeSlots: string[];
}

 
  