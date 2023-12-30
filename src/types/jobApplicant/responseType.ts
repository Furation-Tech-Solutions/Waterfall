import { JobApplicantEntity } from "@domain/jobApplicants/entites/jobApplicants";

export interface JobApplicantsResponse {
  jobApplicants: JobApplicantEntity[];
  totalCount: number;
}
