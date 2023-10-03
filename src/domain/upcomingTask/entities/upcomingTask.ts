// DTO for UpcomingTask
export class UpcomingTaskModel {
  constructor(
    public jobApplicant: string = "",
    public status: string = "Pending"
  ) {}
}

// Entity for UpcomingTask
export class UpcomingTaskEntity {
  constructor(
    public id: string | undefined = undefined,
    public jobApplicant: string,
    public status: string
  ) {}
}

export class UpcomingTaskMapper {
  static toEntity(
    upcomingTaskData: any,
    includeId?: boolean,
    existingUpcomingTask?: UpcomingTaskEntity
  ): UpcomingTaskEntity {
    if (existingUpcomingTask != null) {
      // If existingUpcomingTask is provided, merge the data from upcomingTaskData with the existingUpcomingTask
      return {
        ...existingUpcomingTask,
        jobApplicant:
          upcomingTaskData.jobApplicant !== undefined
            ? upcomingTaskData.jobApplicant
            : existingUpcomingTask.jobApplicant,
        status:
          upcomingTaskData.status !== undefined
            ? upcomingTaskData.status
            : existingUpcomingTask.status,
      };
    } else {
      // If existingUpcomingTask is not provided, create a new UpcomingTaskEntity using upcomingTaskData
      const upcomingTaskEntity: UpcomingTaskEntity = {
        id: includeId
          ? upcomingTaskData.id
            ? upcomingTaskData.id.toString()
            : undefined
          : upcomingTaskData.id,
        jobApplicant: upcomingTaskData.jobApplicant,
        status: upcomingTaskData.status,
      };
      return upcomingTaskEntity;
    }
  }

  static toModel(upcomingTask: UpcomingTaskEntity): any {
    return {
      id: upcomingTask.id,
      jobApplicant: upcomingTask.jobApplicant,
      status: upcomingTask.status,
    };
  }
}
