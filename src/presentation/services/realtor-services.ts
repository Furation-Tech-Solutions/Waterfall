import { NextFunction, Request, Response } from "express";
import {
  RealtorModel,
  RealtorEntity,
  RealtorMapper,
} from "@domain/realtors/entities/realtors";
import { CreateRealtorUsecase } from "@domain/realtors/usecases/create-realtor";
import { GetAllRealtorsUsecase } from "@domain/realtors/usecases/get-all-realtors";
import { GetRealtorByIdUsecase } from "@domain/realtors/usecases/get-realtor-by-id";
import { UpdateRealtorUsecase } from "@domain/realtors/usecases/update-realtor";
import { DeleteRealtorUsecase } from "@domain/realtors/usecases/delete-realtor";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;
  private readonly GetAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;
  private readonly UpdateRealtorUsecase: UpdateRealtorUsecase;
  private readonly DeleteRealtorUsecase: DeleteRealtorUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
    GetAllRealtorsUsecase: GetAllRealtorsUsecase,
    GetRealtorByIdUsecase: GetRealtorByIdUsecase,
    UpdateRealtorUsecase: UpdateRealtorUsecase,
    DeleteRealtorUsecase: DeleteRealtorUsecase,
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
    this.GetAllRealtorsUsecase = GetAllRealtorsUsecase;
    this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
    this.UpdateRealtorUsecase = UpdateRealtorUsecase;
    this.DeleteRealtorUsecase = DeleteRealtorUsecase;
  }

  // Handler for creating a new Realtor
  async createRealtor(req: Request, res: Response): Promise<void> {
    const realtorData: RealtorModel = RealtorMapper.toModel(req.body);
    console.log(realtorData, "service-38"); // Logging Realtor data

    const newRealtor: Either<ErrorClass, RealtorEntity> =
      await this.CreateRealtorUsecase.execute(realtorData);

    console.log(realtorData, "service-43"); // Logging Realtor data again

    newRealtor.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity) => {
        const resData = RealtorMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Handler for getting all Realtors
  async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const realtorLocations: Either<ErrorClass, RealtorEntity[]> =
      await this.GetAllRealtorsUsecase.execute();

    realtorLocations.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (realtors: RealtorEntity[]) => {
        const filterLocation = req.query.location as string;
        const filterGender = req.query.gender as string;

        let filteredRealtors: RealtorEntity[] = realtors;

        if (filterLocation) {
          // Case-insensitive location filter
          filteredRealtors = filteredRealtors.filter((realtor: RealtorEntity) => {
            return realtor.location.toLowerCase() === filterLocation.toLowerCase();
          });
        }

        if (filterGender) {
          // Case-insensitive gender filter
          filteredRealtors = filteredRealtors.filter((realtor: RealtorEntity) => {
            return realtor.gender.toLowerCase() === filterGender.toLowerCase();
          });
        }

        // If no location or gender filter is provided, return all realtors
        const realtorsWithFriendCount = filteredRealtors.map((realtor) => {
          const friendCount = realtor.friends.length;
          const resData = RealtorMapper.toEntity(realtor);
          resData.friendCount = friendCount;
          return resData;
        });

        return res.json(realtorsWithFriendCount);
      }
    );
  }

  // Handler for getting Realtor by ID
  // async getRealtorById(req: Request, res: Response): Promise<void> {
  //   const realtorId: string = req.params.id;

  //   const realtor: Either<ErrorClass, RealtorEntity> =
  //     await this.GetRealtorByIdUsecase.execute(realtorId);

  //   realtor.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (result: RealtorEntity) => {
  //       if (!result) {
  //         return res.json({ message: "Realtor Name not found." });
  //       }

  //       // Count the number of friends
  //       const friendCount = result.friends.length;

  //       const resData = RealtorMapper.toEntity(result);
  //       // Add the friend count to the response data
  //       resData.friendCount = friendCount;

  //       return res.json(resData);
  //     }
  //   );
  // } 


//   async getRealtorById(req: Request, res: Response): Promise<void> {
//     const realtorId: string = req.params.id;

//     const realtor: Either<ErrorClass, RealtorEntity> = await this.GetRealtorByIdUsecase.execute(realtorId);

//     realtor.cata(
//       (error: ErrorClass) =>
//         res.status(error.status).json({ error: error.message }),
//       (result: RealtorEntity) => {
//         if (!result) {
//           return res.json({ message: "Realtor Name not found." });
//         }

//         // Assuming that 'friends' is an array in the RealtorEntity
//         const friends = result.friends; // Define 'friends' here

//         // Count the number of friends
//         const friendCount = friends.length;

//         // Find mutual friends
//         const mutualFriends = friends.filter(friendId => {
//           // Check if the friendId is not the requested realtor and also is a friend of the other realtor
//           return friendId.toString() !== realtorId && friends.includes(friendId);
//         });
        

//         const resData = RealtorMapper.toEntity(result);
//         // Add the friend count and mutual friends to the response data
//         resData.friendCount = friendCount;
//         resData.mutualFriends = mutualFriends;

//         return res.json(resData);
//       }
//     );
// }

async getRealtorById(req: Request, res: Response): Promise<void> {
  const requesterRealtorId: string = req.params.id;
  const targetRealtorId: string = req.query.id as string;

  const requesterRealtor: Either<ErrorClass, RealtorEntity> = await this.GetRealtorByIdUsecase.execute(requesterRealtorId);
  const targetRealtor: Either<ErrorClass, RealtorEntity> = await this.GetRealtorByIdUsecase.execute(targetRealtorId);

  requesterRealtor.cata(
    (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
    (requesterResult: RealtorEntity) => {
      if (!requesterResult) {
        return res.json({ message: "Requester Realtor not found." });
      }

      targetRealtor.cata(
        (error: ErrorClass) =>
          res.status(error.status).json({ error: error.message }),
        (targetResult: RealtorEntity) => {
          if (!targetResult) {
            return res.json({ message: "Target Realtor not found." });
          }

          // Assuming that 'friends' is an array in the RealtorEntity
          const requesterFriends = requesterResult.friends; // Define 'friends' here
          const targetFriends = targetResult.friends; // Define 'friends' here

          // Find mutual friends
          const mutualFriends = requesterFriends.filter((friendId) => {
            return friendId.toString() !== requesterRealtorId && targetFriends.includes(friendId);
          });

          const resData = RealtorMapper.toEntity(requesterResult);
          // Add the friend count and mutual friends to the response data
          resData.friendCount = requesterFriends.length;
          resData.mutualFriends = mutualFriends;

          return res.json(resData);
        }
      );
    }
  );
}




  // Handler for updating Realtor by ID
  async updateRealtor(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;
    const realtorData: RealtorModel = req.body;

    const existingRealtor: Either<ErrorClass, RealtorEntity> =
      await this.GetRealtorByIdUsecase.execute(realtorId);

    existingRealtor.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (existingRealtorData: RealtorEntity) => {
        const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
          realtorData,
          true,
          existingRealtorData
        );

        const updatedRealtor: Either<ErrorClass, RealtorEntity> =
          await this.UpdateRealtorUsecase.execute(
            realtorId,
            updatedRealtorEntity
          );

        updatedRealtor.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (result: RealtorEntity) => {
            const resData = RealtorMapper.toEntity(result, true);
            res.json(resData);
          }
        );
      }
    );
  }

  // Handler for deleting Realtor by ID
  async deleteRealtor(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
      { deleteStatus: true },
      true
    );

    // Call the UpdateRealtorUsecase to update the Realtor
    const updatedRealtor: Either<ErrorClass, RealtorEntity> = await this.UpdateRealtorUsecase.execute(
      id,
      updatedRealtorEntity
    );

    updatedRealtor.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: RealtorEntity) => {
        const responseData = RealtorMapper.toModel(result);
        return res.json(responseData)
      }
    )
  }
}
