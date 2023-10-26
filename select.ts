// async getAllRealtors(query: object): Promise<any[]> {
//     // let l = query ? query.toLowerCase() : null;

//     if (query.location != undefined) {
//         const data = await Realtor.findAll({
//             where: {
//                 [Op.or]: [
//                     {
//                         location: {
//                             [Op.iLike]: `%${location}%`
//                         }
//                     }
//                 ]
//             }
//         });
//         return data.map((realtor: any) => realtor.toJSON());
//     }
//     else if (query.gender != undefined) {
//         const data = await Realtor.findAll({
//             where: {
//                 [Op.or]: [
//                     {
//                         gender: {
//                             [Op.iLike]: `%${gender}%`
//                         }
//                     }
//                 ]
//             }
//         });
//         return data.map((realtor: any) => realtor.toJSON());
//     }
//     else if (query.searchList != undefined) {
//         const data = await Realtor.findAll({
//             where: {
//                 [Op.or]: [
//                     {
//                         firstName: {
//                             [Op.iLike]: `%${searchList}%`,
//                         },
//                     },
//                     {
//                         lastName: {
//                             [Op.iLike]: `%${searchList}%`,
//                         },
//                     },
//                     {
//                         email: {
//                             [Op.iLike]: `%${searchList}%`,
//                         },
//                     },
//                     {
//                         contact: {
//                             [Op.iLike]: `%${l}%`,
//                         },
//                     }
//                 ]
//             }
//         });
//         return data.map((realtor: any) => realtor.toJSON());
//     } else {
//         // Handle other cases when q is not provided (e.g., return all records)
//         const data = await Realtor.findAll({});
//         return data.map((realtor: any) => realtor.toJSON());
//     }
// }