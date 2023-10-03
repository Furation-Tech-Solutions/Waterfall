import {
  UpcomingTaskEntity,
  UpcomingTaskModel,
} from "@domain/upcomingTask/entities/upcomingTask";
import { UpcomingTaskRepository } from "@domain/upcomingTask/repositories/upcomingTask-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateUpcomingTaskUsecase {
  execute: (
    upcomingTaskData: UpcomingTaskModel
  ) => Promise<Either<ErrorClass, UpcomingTaskEntity>>;
}

export class CreateUpcomingTask implements CreateUpcomingTaskUsecase {
  private readonly upcomingTaskRepository: UpcomingTaskRepository;

  constructor(upcomingTaskRepository: UpcomingTaskRepository) {
    this.upcomingTaskRepository = upcomingTaskRepository;
  }

  async execute(
    upcomingTaskData: UpcomingTaskModel
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>> {
    return await this.upcomingTaskRepository.createUpcomingTask(
      upcomingTaskData
    );
  }
}
