import { UpcomingTaskEntity } from "@domain/upcomingTask/entities/upcomingTask";
import { UpcomingTaskRepository } from "@domain/upcomingTask/repositories/upcomingTask-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllUpcomingTasksUsecase {
  execute: () => Promise<Either<ErrorClass, UpcomingTaskEntity[]>>;
}

export class GetAllUpcomingTasks implements GetAllUpcomingTasksUsecase {
  private readonly upcomingTaskRepository: UpcomingTaskRepository;

  constructor(upcomingTaskRepository: UpcomingTaskRepository) {
    this.upcomingTaskRepository = upcomingTaskRepository;
  }

  async execute(): Promise<Either<ErrorClass, UpcomingTaskEntity[]>> {
    return await this.upcomingTaskRepository.getUpcomingTasks();
  }
}
