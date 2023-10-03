import {
  UpcomingTaskEntity,
  UpcomingTaskModel,
} from "@domain/upcomingTask/entities/upcomingTask";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface UpcomingTaskRepository {
  createUpcomingTask(
    upcomingTask: UpcomingTaskModel
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>>;
  updateUpcomingTask(
    id: string,
    data: UpcomingTaskModel
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>>;
  getUpcomingTasks(): Promise<Either<ErrorClass, UpcomingTaskEntity[]>>;
  getUpcomingTaskById(
    id: string
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>>;
}
