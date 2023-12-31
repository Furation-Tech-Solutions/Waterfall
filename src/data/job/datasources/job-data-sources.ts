// Import necessary modules and dependencies
import { Model, Op, Sequelize, where } from "sequelize";
import { ExpenditureGraphEntity, ExpenditureGraphModel, JobCountEntity, JobCountModel, JobEntity, JobModel } from "@domain/job/entities/job";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import realtorModel from "@data/realtors/model/realtor-model";
import {
  RealtorEntity,
  RealtorMapper,
  RealtorModel,
} from "@domain/realtors/entities/realtors";
import ApiError from "@presentation/error-handling/api-error";
import NotInterested from "@data/notInterested/model/notInterested-models";
import CallLog from "@data/callLog/models/callLog-model";
import { ConnectionsModel } from "@domain/connections/entities/connections_entities";
import Transactions from "@data/paymentGateway/models/paymentGateway-models";
import FeedBacks from "@data/feedBack/model/feedBack-model";

// Create an interface JobDataSource to define the contract for interacting with job data
export interface JobDataSource {
  // Method to create a new job record
  create(job: any): Promise<JobEntity>;

  // Method to update an existing job record by ID
  update(id: string, job: any): Promise<JobEntity>;

  // Method to delete a job record by ID
  delete(id: string): Promise<void>;

  // Method to read a job record by ID
  read(id: string): Promise<JobEntity | null>;

  // Method to retrieve all job records
  getAll(query: JobQuery): Promise<JobEntity[]>;

  // Method to retrieve a total job posted count
  counts(query: JobQuery): Promise<JobCountEntity>;

  graphData(query: JobQuery): Promise<ExpenditureGraphEntity>;

}

// Define a JobQuery object to encapsulate parameters
export interface JobQuery {
  id: string;
  q: string;
  page: number;
  limit: number;
  year?: number;
  months?: Array<number>;
  jobType?: string;
  feeType?: string;
  sortOrder?: "ASC" | "DESC";
}

// Implementation of the JobDataSource interface
export class JobDataSourceImpl implements JobDataSource {
  // Constructor that accepts a Sequelize database connection
  constructor(private db: Sequelize) { }

  // Method to create a new job record
  async create(job: any): Promise<JobEntity> {
    // Create a new job record using the provided data
    const createdJob = await Job.create(job);

    // Return the created job as a plain JavaScript object
    return createdJob.toJSON();
  }

  // Method to delete a job record by ID
  async delete(id: string): Promise<void> {
    // Check if there are JobApplicants with agreement=true for the given job
    const job = await Job.findByPk(id);
    if (!job) {
      throw ApiError.jobNotFound();
    }
    const hasApplicants = await JobApplicant.findOne({
      where: {
        jobId: id,
        agreement: true,
      },
    });
    // If there are applicants with agreement=true, prevent deletion
    if (hasApplicants) {
      throw ApiError.cannotDeleteJob();
    }

    // Delete the job record where the ID matches the provided ID
    await Job.destroy({
      where: {
        id: id,
      },
    });
  }

  // Method to read a job record by ID
  async read(id: string): Promise<JobEntity | null> {
    // Find a job record where the ID matches the provided ID
    const job = await Job.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          as: "jobOwnerData",
          foreignKey: "jobOwnerId",
        },
        {
          model: JobApplicant,

          as: "applicantsData",
        },

        {
          model: CallLog,  // Add this include for the CallLog model
          as: "callLogsData",  // You can use any alias you prefer
        }


      ],
    });

    // If a job record is found, convert it to a plain JavaScript object and return it, otherwise return null
    return job ? job.toJSON() : null;
  }

  // Method to retrieve a list of job records
  async getAll(query: JobQuery): Promise<JobEntity[]> {
    //------------------------------------------------------------------------------------------------ ---------
    let loginId = query.id;

    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;
    // let whereCondition: any = {};
    const applyNotInterestedFilter = async (jobs: any[]) => {
      const notInterestedJobs = await NotInterested.findAll({
        where: {
          realtorId: loginId,
        },
        attributes: ["jobId"],
      });
      return jobs.filter((job) => {
        const jobId = job.getDataValue("id");
        return !notInterestedJobs.some(
          (notInterestedJob: any) => notInterestedJob.jobId === jobId
        );
      });
    };
    //------------------------------------------------------------------------------------------------------------
    // Check the query parameter 'q' for different filters
    if (query.q === "expired") {
      const currentDate = new Date(); // Current date
      currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
          date: {
            [Op.lt]: currentDate, // Filter jobs where the date is in the past
          },
        };
      } else {
        whereCondition = {
          date: {
            [Op.lt]: currentDate, // Filter jobs where the date is in the past
          },
        };
      }

      // Fetch jobs that are expired
      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              agreement: true,
              jobStatus: "Pending",
              applicantId: loginId,
            },
          },
        ],
        where: whereCondition,
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
      // return jobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------
    } // Check the query parameter 'q' for "jobsForYou" logic
    else if (query.q === "jobsForYou") {
      // Fetch jobs that are marked as 'JobCompleted' and meet certain criteria
      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              jobStatus: "JobCompleted",
              agreement: true,
              paymentStatus: true,
              applicantId: loginId,
            },
          },
        ],
      });
      // Extract jobTypes from jobs
      const completedJobTypes = jobs.map((job: any) => job.jobType);

      // console.log("completedJobTypes:", completedJobTypes);

      // Recommend jobs with the same jobType
      // map completedJobType
      const recommendedJobs = await Job.findAll({
        where: {
          jobType: {
            [Op.in]: completedJobTypes, // Filters where jobType is in the array
          },
          // Filter by the extracted jobTypes
          liveStatus: true,
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
        ],
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      // console.log("reccommendedJobs:", recommendedJobs);

      // console.log("recommendedJobs:", recommendedJobs);
      if (recommendedJobs.length > 0) {
        const filteredRecommendedJobs = recommendedJobs.filter(
          (job) => job.getDataValue("jobOwnerId") !== loginId
        );
        return filteredRecommendedJobs.map((job: any) => job.toJSON());
      }
      // console.log(recommendedJobs);

      const realtor: any = await Realtors.findByPk(loginId);

      if (!realtor.location) {
        return [];
      }

      const Jobsforyou = await Job.findAll({
        where: {
          date: {
            [Op.gt]: new Date(),
          },
          liveStatus: true,
          location: realtor.location,
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });
      // return Jobsforyou.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------------------
    }

    //-----------------------------------------------------------------------------------------------------------------------
    else if (query.q === "jobCompleted") {
      // Fetch jobs that are marked as 'JobCompleted' and meet certain criteria

      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      const jobs = await Job.findAll({
        where: whereCondition,
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              jobStatus: "JobCompleted",
              agreement: true,
              paymentStatus: true,
              applicantId: loginId,
            },
          },
        ],
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "appliedJobs") {
      // Find jobs where the applicant ID matches the provided ID
      const appliedJobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
            },
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      // return appliedJobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(appliedJobs);
      return filteredJobs.map((job: any) => job.toJSON());
      //----------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "active") {
      // Check if the query parameter is "active"
      const jobs = await Job.findAll({
        where: {
          date: {
            [Op.gt]: new Date(),
          },
          liveStatus: true,
          jobOwnerId: loginId,
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });
      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());

      //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "all") {
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        where: whereCondition,
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
            },
          },
        ],
        order: [
          // Then, sort by date in ascending order
          ["date", "ASC"],
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
      //-------------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "paymentPending") {
      const jobs = await Job.findAll({
        where: {
          jobOwnerId: loginId, // Use the correct way to filter by jobOwner
          jobProgress: "paymentPending",
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],

        limit: itemsPerPage,
        offset: offset,
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "completed") {
      const jobs = await Job.findAll({
        where: {
          jobOwnerId: loginId,
          jobProgress: "completed",
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],

        limit: itemsPerPage,
        offset: offset,
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
      //-----------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "allpastjobs") {
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        where: {
          date: {
            [Op.lt]: new Date(),
          },
          ...whereCondition,
        },
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
            },
          },
        ],
        order: [
          // Then, sort by date in ascending order
          ["date", "ASC"],
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());
    }
    // ------------------------
    else if (query.q === "getAll") {
      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "jobOwnerData",
            foreignKey: "jobOwnerId",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],

        order: [
          // Then, sort by date in ascending order
          ["date", "ASC"],
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      // return jobs.map((job: any) => job.toJSON());
      const filteredJobs = await applyNotInterestedFilter(jobs);
      return filteredJobs.map((job: any) => job.toJSON());

      //---------------------------------------------------------------------------------------------------------------------------------------
    } else {
      // Set up the initial conditions for the Sequelize query
      let whereCondition: any = {
        // jobOwnerId: !loginId, // Filter jobs by the logged-in user's ID
      };

      // Check if the 'feeType' parameter exists in the query
      if (query.feeType) {
        // Add 'feeType' as a filter condition
        whereCondition = {
          ...whereCondition, // Preserve existing conditions
          feeType: query.feeType, // Filter jobs by the provided 'feeType'
        };
      }

      // Check if the 'jobType' parameter exists in the query
      if (query.jobType) {
        // Add 'jobType' as a filter condition
        whereCondition = {
          ...whereCondition, // Preserve existing conditions
          jobType: query.jobType, // Filter jobs by the provided 'jobType'
        };
      }

      // Execute the Sequelize query to fetch jobs based on the provided conditions
      const jobs = await Job.findAll({
        where: whereCondition, // Apply the constructed conditions for filtering
        include: [
          {
            model: Realtors,
            as: "jobOwnerData", // Include the associated job owner data
            foreignKey: "jobOwnerId", // Based on the 'jobOwnerId' foreign key
          },
          {
            model: JobApplicant,
            as: "applicantsData", // Include the associated applicants' data
          },
        ],
        order: [
          Sequelize.literal(`CAST(fee AS DECIMAL) ${query.sortOrder || "ASC"}`),
          // Sort the jobs by 'fee' in numeric order, either ASC or DESC based on 'query.sortOrder'
          ["date", "ASC"], // Then, sort by 'date' in ascending order
        ],
        limit: itemsPerPage, // Limit the number of fetched jobs per page
        offset: offset, // Define the offset for pagination
      });

      // Apply additional filtering logic, if any, to the fetched jobs
      const filteredJobs = await applyNotInterestedFilter(jobs);

      // Return the filtered jobs as JSON objects
      // return filteredJobs.map((job: any) => job.toJSON());

      const filteredRecommendedJobs = filteredJobs.filter(
        (job) => job.getDataValue("jobOwnerId") !== loginId
      );
      return filteredRecommendedJobs.map((job: any) => job.toJSON());
    }
  }

  // Method to update a job record by ID
  async update(id: string, updatedData: JobModel): Promise<JobEntity> {
    // Find the job record by its ID
    const job = await Job.findByPk(id);

    // If the job record is found, update it with the provided data
    if (job) {
      await job.update(updatedData);
    }

    // Fetch the updated job record
    const updatedJob = await Job.findByPk(id);

    if (updatedJob == null) {
      throw ApiError.notFound();
    }
    return updatedJob.toJSON();
  }

  



  async counts(query: JobQuery): Promise<JobCountEntity> {
    const loginId = query.id;
    const monthToFilter = query.months || [];
    const yearToFilter = query.year;

    console.log(yearToFilter, "years", query)

    const jobData = await Job.findAll({
      where: {
        jobOwnerId: loginId
      }
    })
    const conditionsMap: Record<string, any> = {
      posted: {
        where: { jobOwnerId: loginId },
      },
      accepted: {
        where: { jobOwnerId: loginId, liveStatus: false },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantStatus: "Accept",
            },
          },
        ],
      },
      completedjobsforowner: {
        where: { jobOwnerId: loginId, liveStatus: false },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              paymentStatus: true,
              jobStatus: "JobCompleted",
            },
          },
        ],
      },
      scheduled: {
        where: { jobOwnerId: loginId, liveStatus: false },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              agreement: true,
              jobStatus: "Pending",
            },
          },
        ],
      },
      applied: {
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
            },
          },
        ],
      },
      assigned: {
        where: { liveStatus: false },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
            },
          },
        ],
      },
      completedjobforapplicant: {
        where: { liveStatus: false },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantId: loginId,
              jobStatus: "JobCompleted",
            },
          },
        ],
      },
     
    };

    const jobCounts: JobCountEntity = {
      posted: 0,
      accepted: 0,
      completedjobsforowner: 0,
      scheduled: 0,
      applied: 0,
      assigned: 0,
      completedjobforapplicant: 0,
      feedbackGiven:0,
      feedbackTaken:0
    };
 
    const feedbackFilter: Record<string, any> = {};
const whereConditions: any[] = [];

if (yearToFilter) {
  whereConditions.push(
    Sequelize.where(
      Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "createdAt"')),
      yearToFilter
    )
  );
}

if (monthToFilter.length > 0) {
  const validMonths = monthToFilter.filter(month => !isNaN(month));
  const monthFilters = validMonths.map(month =>
    Sequelize.where(
      Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "createdAt"')),
      month
    )
  );
  whereConditions.push({ [Op.or]: monthFilters });
}

    // Fetch feedback counts filtered by month and year
  const feedbackGivenCount = await FeedBacks.count({
    where: {
      fromRealtorId: loginId,
      [Op.and]: whereConditions,
    },
  });

  const feedbackTakenCount = await FeedBacks.count({
    where: {
      toRealtorId: loginId,
      [Op.and]: whereConditions,
    },
  });

  // Assign feedback counts to the jobCounts object
  jobCounts.feedbackGiven = feedbackGivenCount;
  jobCounts.feedbackTaken = feedbackTakenCount;

    for (const key in conditionsMap) {
      let whereCondition: any =  {};
      if (query.year) {
        whereCondition = {
          ...whereCondition,
          [Op.and]: Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
            query.year
          ),
        };
      }
     

      if (query.months && query.months.length > 0) {
        const validMonths = query.months.filter(month => !isNaN(month));
        const monthFilters = validMonths.map(month => Sequelize.where(
            Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM date')),
            month
        ));

        whereCondition.date = {
            ...whereCondition.date,
            [Op.or]: monthFilters,
        };
    }
      
      

      const count = await Job.count({
        where: {...conditionsMap[key].where,...whereCondition },
        include: conditionsMap[key].include || [],
      });
      jobCounts[key as keyof JobCountEntity] = count;
    }

    return jobCounts;
  }

  async graphData(query:JobQuery):Promise<ExpenditureGraphEntity>{

       const currentYear = new Date().getFullYear();
       const expenses = await Transactions.findAll({
        where: {
          fromRealtorId: query.id,
        },
      });
      const earning = await Transactions.findAll({
        where: {
          toRealtorId: query.id,
        },
      });
      const totalExpenseByMonth: { [key: string]: number } = {};
      const totalEarningByMonth: { [key: string]: number } = {};

      for (let i = 0; i < 12; i++) {
        const monthName = new Date(new Date().getFullYear(), i).toLocaleString('default', { month: 'long' });
        totalExpenseByMonth[monthName] = 0;
        totalEarningByMonth[monthName]=0
      }

      expenses.forEach((transaction: any) => {
        const createdAt: Date = transaction.createdAt;
        const month: number = createdAt.getMonth(); // Get month (0-indexed)
        const monthName: string = new Date(new Date().getFullYear(), month).toLocaleString('default', { month: 'long' });    
        totalExpenseByMonth[monthName] += Number(transaction.amount);
      });
      earning.forEach((transaction: any) => {
        const createdAt: Date = transaction.createdAt;
        const month: number = createdAt.getMonth(); // Get month (0-indexed)
        const monthName: string = new Date(new Date().getFullYear(), month).toLocaleString('default', { month: 'long' });
    
        totalEarningByMonth[monthName] += Number(transaction.amount);
      });
      
      const expenditureGraph = new ExpenditureGraphEntity(totalExpenseByMonth,totalEarningByMonth);
      return expenditureGraph;
  }


}
