import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model"
import cron from "node-cron";
import { Op, literal,fn } from 'sequelize'


export const deleteStatusWithCron = () => {

  try {
    cron.schedule('0 0 * * *', async function () {
       
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
      
      
      
    },{
      scheduled:true,
      timezone:"America/Toronto"
    })
  }
  catch (err) {
    console.log(err)
  }
}