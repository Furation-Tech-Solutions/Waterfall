// async getRealtorById(req: Request, res: Response): Promise<void> {
//     const realtorId: string = req.params.id;

//     const realtor: Either<ErrorClass, RealtorEntity> = await this.GetRealtorByIdUsecase.execute(realtorId);

//     realtor.cata(
//       (error: ErrorClass) =>
//         res.status(error.status).json({ error: error.message }),
//       (result: RealtorEntity) => {
//         if (!result) {
//           return res.json({ message: "Realtor Name not found." });
//         }

//         // Count the number of friends
//         const friendCount = result.friends.length;

//         // Find mutual friends
//         const mutualFriends = result.friends.filter(realtorId => {
//           return realtorId !== realtorId &&
//             result.friends.includes(realtorId) &&
//             result.friends.includes(realtorId);
//         });

//         const resData = RealtorMapper.toEntity(result);
//         // Add the friend count and mutual friends to the response data
//         resData.friendCount = friendCount;
//         resData.friends = mutualFriends;

//         return res.json(resData);
//       }
//     );
//   }