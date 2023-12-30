import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model"
import cron from "node-cron";
import { Op, literal,fn } from 'sequelize'


export const deleteStatusWithCron = () => {

  try {
    cron.schedule('0 0 * * *', async function () {
      try {
        // const userList = await Realtors.findAll({
        //   where: {
        //     deleteStatus: {
        //       status: true,
        //     },
        //   },
//         })
//         userList.map((item) => {
//           console.log(item,"item ")
//           const deletedAtTimestamp: string = item.dataValues.deleteStatus.deletedAt;
//           // console.log(deletedAtTimestamp,"deletedAt time stamp",typeof(item.dataValues.deleteStatus.deletedAt))
//           const twoDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
//           // console.log(typeof(twoDaysInMillis))

//           // Convert to Unix timestamp in seconds
// const unixTimestamp = Math.floor(new Date(deletedAtTimestamp).getTime() / 1000);

// console.log(unixTimestamp,"unixtimestampnnj");
//           const deletedAtTimestampNumber: number = Date.parse(deletedAtTimestamp);
//           console.log(deletedAtTimestampNumber,typeof(deletedAtTimestampNumber))
//           // const unixTimestamp = Date.parse(deletedAtTimestamp);

//           // Convert milliseconds to seconds (remove milliseconds)
//           const unixTimestampInSeconds = deletedAtTimestampNumber / 1000;

//           // Convert the deletedAt timestamp to a Date object
//           const deletedAtDate: Date = new Date(unixTimestampInSeconds);
//           console.log( unixTimestampInSeconds,deletedAtDate,typeof(deletedAtDate),"del")


//           // Get the current date
//           const currentDate: Date = new Date();
//           console.log(currentDate,typeof(currentDate.getTime()))

//           // Calculate the difference in milliseconds
//           const timeDifference: number = currentDate.getTime() - deletedAtDate.getTime();
//           console.log(timeDifference,"timeDifference",typeof(timeDifference),twoDaysInMillis)
//           // Check if the difference is greater than or equal to 2 days
//           if (timeDifference >= twoDaysInMillis) {
//             // Perform the desired operation
//             Realtors.destroy({
//               where: {
//                 id: item.dataValues.id,
//               },
//             });
//           }
//         })

        //cron job on expire job
        try{
         
         
          const jobData = await Job.findAll({
            where: {
              // Assuming your Job model has a 'date' attribute
              applyBy: {
                
                [Op.lt]: fn('DATE', literal('CURRENT_DATE')), // Use CURRENT_DATE to represent today's date
              },
            },
          });
  // Update the liveStatus to false for the jobs that need to be marked as expired
  const jobIdsToUpdate = await Promise.all(
    jobData.map(async (job) => {
      await job.update({ liveStatus: false });
      
    })
    
  );
        }
        catch(error){
          console.log(error)
        }
      }
      catch (err) {
        console.log(err)
      }
      
    },{
      scheduled:true,
      timezone:"America/Toronto"
    })
  }
  catch (err) {
    console.log(err)
  }
}