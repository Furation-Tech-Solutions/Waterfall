import Realtors from "@data/realtors/model/realtor-model"
import cron from "node-cron";

export const deleteStatusWithCron = () => {

  try {
    cron.schedule('0 12 * * *', async function () {
      try {
        const userList = await Realtors.findAll({
          where: {
            deleteStatus: {
              status: true,
            },
          },
        })
        userList.map((item) => {
          const deletedAtTimestamp:number = item.dataValues.deleteStatus.deletedAt;
          const twoDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

          // Convert the deletedAt timestamp to a Date object
          const deletedAtDate:Date = new Date(deletedAtTimestamp);

          // Get the current date
          const currentDate:Date = new Date();

          // Calculate the difference in milliseconds
          const timeDifference:number = currentDate.getTime() - deletedAtDate.getTime();
          // Check if the difference is greater than or equal to 2 days
          if (timeDifference >= twoDaysInMillis) {
            // Perform the desired operation
            Realtors.destroy({
              where: {
                id: item.dataValues.id,
              },
            });
          }
        })
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