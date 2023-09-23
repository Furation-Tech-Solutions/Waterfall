import { Document } from "mongoose";

 
 export interface IBlackoutDay extends Document {
    date: string;
    day: string;
    description: string;
    blackout: {
      reservation: boolean;
      guestList: boolean;
    };
  }