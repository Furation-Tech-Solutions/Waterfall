import mongoose, { Document } from "mongoose";


export interface IGuestFacingDisplay {
  widgetTimeSlotDescription: string;
  timeSlotDescription: string;
  widgetTimeSlotDetail: {
    title: string;
    longDescription: string;
    image: string; 
  };
  linkToOffer: string;
  allowBookingOnChannelsWithoutDisplayFields: boolean;
}

export interface IPaymentPolicy {
  folllowShift: boolean;
  timeBeforeCutOff: number;
  bookingPolicy: 'Default Booking Policy' | 'Custom Policy';
  policyDescription?: string;
  allowCreditCard?: boolean;
  bundleUpgrade?: boolean;
}

export interface IBookingChannels {
  AudienceTier: Array<'Direct Booking Channels' | 'Third Party Booking Channels' | 'Waitlist'>;
}

export interface ISeatingArea {
  SeatingAreaName: string[];
  exclusive: boolean;
}

export interface IPartySize {
  minPartySize?: number;
  maxPartySize?: number;
}

export interface IGuestBookingTime {
  value: number;
  unit: 'hours' | 'days' | 'weeks' | 'months' | 'reservation_time';
  reservationTime: string;
}

export interface IAccessRuleDocument extends Document {
  name: string;
  startDate: Date;
  endDate?: Date;
  isIndefinite: boolean;
  daysOfWeek: string[];
  timeSlots: Array<'All Times During Shift Category' | 'Custom time range' | 'Specific time slot'>;
  shiftCategories?: Array<'All Lunch Shift' | 'All Dinner Shifts' | 'Specific time slot'>;
  firstReservation?: string;
  lastReservation?: string;
  specificTime?: string[];
  restrictShiftCategory?: boolean;
  partySize?: IPartySize;
  seatingAreas?: ISeatingArea;
  guestFacingDisplay: IGuestFacingDisplay;
  paymentPolicy: IPaymentPolicy;
  bookingChannels: IBookingChannels[];
  selectableUpgrade: {
    doNotInclude?: boolean;
    include?: boolean;
  };
  reservationTags: mongoose.Types.ObjectId;
  bookingWindow: {
    guestBookingStartTime: IGuestBookingTime;
    guestBookingCutoffTime: IGuestBookingTime;
  };
  maxReservationOrCoverLimit: {
    perDay: number; // Default to no limit (0 means no limit)
    unit: 'Reservations' | 'Covers';
  };
  pacing: {
    maxCoversPerSeatingInterval: number;
    customPacingPerSeatingInterval: {
      startTime: string;
      maxCovers: number;
    }[];
    totalPacingReduction: boolean;
  };
  guestDurationPicker: {
    guestMustSpecifyDuration: boolean;
    durationMin: number;
    durationMax: number;
  };
}
