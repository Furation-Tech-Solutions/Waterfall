// upcomingTaskInterface.ts

export enum JobStatusEnum {
  COMPLETED = "Completed",
  PENDING = "Pending",
  DECLINE = "Decline",
}

// upcomingTaskInterface.ts
export interface Query {
  jobStatus: string; // Update the type as needed
  agreement: boolean;
}

