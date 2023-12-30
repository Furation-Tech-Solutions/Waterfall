

import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources";
import Job from "@data/job/models/job-model";
import { JobEntity } from "@domain/job/entities/job";
import { sequelize } from "@main/sequelizeClient";
import cron from "node-cron";
import { Op } from 'sequelize';

export const notificationWithCron=()=>{
    const currentDate = new Date();
  try{
       cron.schedule('*/1 * * * *', async function () {
        try{
            const jobData=await Job.findAll({
                where:{
                    feeType:"Hourly-Rate",
                    applyBy: {
                        [Op.gte]: currentDate, // Find where applyBy is greater than or equal to current date
                    },
                    toTime: {
                        [Op.lte]:  currentDate.getHours() + ':' + currentDate.getMinutes(), // Assuming toTime is stored as HH:mm format in the database
                    }
                    
                }
            }
            )
            // console.log(jobData,"job Data")
        }
        catch(error){
            console.log(error,"error in cron")
        }
       })
  }
  catch(error){
    console.log("error while sending push notification",error)
  }

}

export class CronJob{
    private jobDataSource: JobDataSourceImpl;

    constructor() {
        this.jobDataSource = new JobDataSourceImpl(sequelize);
      }
      async notificationsWithCron(){
        const currentDate = new Date();
        try{
             cron.schedule('*/1 * * * *', async ()=> {
              try{
                  const jobData:JobEntity[]=[]
                  const allJob=await Job.findAll({
                      where:{
                          feeType:"Hourly-Rate",
                          applyBy: {
                              [Op.gte]: currentDate, // Find where applyBy is greater than or equal to current date
                          },
                          toTime: {
                              [Op.lte]:  currentDate.getHours() + ':' + currentDate.getMinutes(), // Assuming toTime is stored as HH:mm format in the database
                          }
                          
                      }
                  }
                  )
                  for (const job of allJob) {
                    const jobId = job.getDataValue('id').toString(); // Convert 'id' to string
                   const singleJob:JobEntity| null= await this.jobDataSource.read(jobId); // Pass the string 'id' to the function
                   
                   if (singleJob!=null) {
                    jobData.push(singleJob); // Push the fetched job into the jobData array if it's not null
                   }
                }

                  console.log(jobData,"job Data")
              }
              catch(error){
                  console.log(error,"error in cron")
              }
             })
        }
        catch(error){
          console.log("error while sending push notification",error)
        }
      }
      async expiredJobNotification(){
        const currentDate = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); 
        console.log(twoDaysAgo,"twoDaysAgo")
        try{
            cron.schedule('*/1 * * * *', async ()=> {
                try{
                    const jobData=await Job.findAll({
                        where:{
                            applyBy: {
                                [Op.lt]: currentDate, // Apply By date is less than current date (December 30th)
                                [Op.gt]: twoDaysAgo, // Find where applyBy is greater than or equal to current date
                            },
                        }
                    })
                    console.log("........................................")
                    console.log(jobData,"jobData")
                    console.log("........................................")
                    

                }
                catch(error){
                    console.log("error of cron job",error)
                }
            })
        }
        catch(error){
            console.log("error on expiration job notification")
        }
      }
}