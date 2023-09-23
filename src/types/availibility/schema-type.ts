

import { Document } from 'mongoose';

export interface IShiftProperty extends Document {
  shiftName: string;
  shiftCategory: 'breakfast' | 'brunch' | 'lunch' | 'day' | 'dinner' | 'night';
  startDate: string;
  endDate: string | null;
  daysToRepeatThisShift: string[];
  firstSeating: string;
  lastSeating: string;
  timeInterval: 15 | 30 | 60;
  floorPlanLayout: string;
  seatingAreasAvailable: ('Restaurant' | 'Bar' | 'SushiBar' | 'Prive' | 'PriveBar')[];
  howFarInAdvanceCanReservationsBeBookedInternally:
    | { value?: number; unit: 'Indefinitely'; reservationTime?: string }
    | { value?: number; unit: 'HoursInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'DaysInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'WeeksInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'MonthsInAdvance'; reservationTime?: string };
  partySizeMin: number;
  partySizeMax: number;
  enforceForUsersWithoutPartySizeOverbookingPermission: boolean;
  durationAverageTurnTimeBasedOnPartySize: { partySize: number; duration: number }[];
  pacing: number;
  setMaximumTotalCoversForShift: string | undefined; // Define type as needed
  allowDoubleBookingOnSameTables: boolean;
  modifyBookingNotification: 'At Any Time' | 'Never' | 'Up Until Cut-off Time';
  timeBeforeCutOff:
    | { value?: number; unit: 'Indefinitely' ; reservationTime?: string  }
    | { value?: number; unit: 'HoursInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'DaysInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'WeeksInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'MonthsInAdvance'; reservationTime?: string };
  bookingPolicy: 'Default Booking Policy' | 'Custom Policy';
  policyDescription: string | undefined; // Define type as needed
  addSelectableUpgrades: boolean;
}


export interface IShift {
  shiftName: string;
  shiftCategory: 'breakfast' | 'brunch' | 'lunch' | 'day' | 'dinner' | 'night';
  startDate: string;
  endDate: string | null;
  daysToRepeatThisShift: string[];
  firstSeating: string;
  lastSeating: string;
  timeInterval: 15 | 30 | 60;
  floorPlanLayout: string;
  seatingAreasAvailable: ('Restaurant' | 'Bar' | 'SushiBar' | 'Prive' | 'PriveBar')[];
  howFarInAdvanceCanReservationsBeBookedInternally:
    | { value?: number; unit: 'Indefinitely'; reservationTime?: string }
    | { value?: number; unit: 'HoursInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'DaysInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'WeeksInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'MonthsInAdvance'; reservationTime?: string };
  partySizeMin: number;
  partySizeMax: number;
  enforceForUsersWithoutPartySizeOverbookingPermission: boolean;
  durationAverageTurnTimeBasedOnPartySize: { partySize: number; duration: number }[];
  pacing: number;
  setMaximumTotalCoversForShift?: string; // Define type as needed, marked as optional
  allowDoubleBookingOnSameTables: boolean;
  modifyBookingNotification: 'At Any Time' | 'Never' | 'Up Until Cut-off Time';
  timeBeforeCutOff?:
    | { value?: number; unit: 'Indefinitely'; reservationTime?: string }
    | { value?: number; unit: 'HoursInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'DaysInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'WeeksInAdvance'; reservationTime?: string }
    | { value?: number; unit: 'MonthsInAdvance'; reservationTime?: string };
  bookingPolicy: 'Default Booking Policy' | 'Custom Policy';
  policyDescription?: string; // Define type as needed, marked as optional
  addSelectableUpgrades: boolean;
}



 
  