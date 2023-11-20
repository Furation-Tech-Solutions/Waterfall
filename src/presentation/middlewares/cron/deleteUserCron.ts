import Realtors from "@data/realtors/model/realtor-model"
import cron from "node-cron";

export const deleteStatusWithCron = () => {

  try {
    cron.schedule('*/1 * * * *', async function () {
      try {
        const userList = await Realtors.findAll({
          where: {
            deleteStatus: {
              status: true,
            },
          },
        })
        userList.map((item) => {

          const deletedAtTimestamp:number = 1700225201300;
          const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

          // Convert the deletedAt timestamp to a Date object
          const deletedAtDate:Date = new Date(deletedAtTimestamp);

          // Get the current date
          const currentDate:Date = new Date();

          // Calculate the difference in milliseconds
          const timeDifference:number = currentDate.getTime() - deletedAtDate.getTime();
            console.log(timeDifference,"timediiference is this")
          // Check if the difference is greater than or equal to 2 days
          if (timeDifference >= twoDaysInMillis) {
            // Perform the desired operation
            console.log("Do some operation because the deletedAt date is 2 or more days ago.");
          }
        })
        console.log(userList, "userlist")
      }
      catch (err) {
        console.log(err)
      }
    })
  }
  catch (err) {
    console.log(err)
  }
}