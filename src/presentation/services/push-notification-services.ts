// const admin = require('firebase-admin');
import * as path from "path";
import admin from "../../main/firebase-sdk/firebase-config"
import { RealtorDataSourceImpl } from "@data/realtors/datasources/realtor-data-source";
import { sequelize } from "@main/sequelizeClient";
import { NotificationDataSourceImpl } from "@data/notification/datasource/notification-datasource";
import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources";

// Assuming serviceAccount.json is in the app folder


// export class NotificationSender {
//     constructor(sequelize) {
//       this.realtorDataSource = new RealtorDataSourceImpl(sequelize);
//     this.notificationSender = new NotificationSender();
//         // Fetch the service account key JSON file content
//   }

//   sendNotification(registrationToken:string, title:string, body:string) {
//     const message = {
//       notification: {
//         title: title || 'New Notification',
//         body: body || 'This is a Firebase Cloud Messaging notification!'
//       },
//       token: registrationToken // Use the provided registration token
//     };

//     return admin.messaging().send(message);
//   }

//   async sendInAppNotification(senderId:string,receiverId:string,title:string){
//   let notificationDataSource = new NotificationDataSourceImpl(sequelize)

//        const notificationData={
//           senderId,
//           receiverId,
//           title
//        }
//       const inAppNotifData=notificationDataSource.createNotification(notificationData)
//       console.log(inAppNotifData,"inappnotification data")

//   }
  

  
//   async customNotification(senderId:string,receiverId:any,eventType:string){
//   // Example usage:
//   console.log(eventType,"eventType")

//   let realtorDataSource = new RealtorDataSourceImpl(sequelize)
//   const sender = await realtorDataSource.read(senderId)
//   const receiver = await realtorDataSource.read(receiverId)
//   console.log(sender,"sender",receiver,"reciver")

//   const notificationSender = new NotificationSender();

//   const deviceTokens:any=receiver.firebaseDeviceToken

//    let body:string=""
//    let title:string=""
//   switch (eventType) {
//     case 'connectionRequest':
//       title="Connection Request"
//       body = `You have a connection request from ${sender.firstName ?? 'Abhishek'}`;
//       break;

//     case 'connectionRequestResponse':
//       title="Connection Request Status"
//       body = `${sender.firstName??'user'} has accept your connection request`; 
//       break;

//       case 'feedback':
//       title="Feedback on job"
//       body = `${sender.firstName??'user'} has provided feedback on your job `; 
//       break;

//       case 'appliedJob':
//         title="Applied Job Status "
//         body = `${sender.firstName??'user'} has applied on your job `; 
//         break;

//     // Add cases for other event types with specific message construction

//     default:
//       title="Connection Request"
//       body = 'Default message for unspecified events';
//       break;
//   }
//     console.log(title,body,"title and body")
//   if (deviceTokens && deviceTokens.length > 0) {
//     deviceTokens.forEach((registrationToken:string) => {

//       notificationSender.sendNotification(registrationToken, title, body)

//         .then((response:any) => {
//           console.log('Notification sent successfully:', response);
//         })
//         .catch((error:any) => {
//           console.error('Error sending notification:', error);
//         });
//         // call inappnotification
//         console.log(receiverId,senderId,title,body)
//         // this.sendInAppNotification(senderId,receiverId,title)
//     });
//   } else {
//     console.log('No device tokens found for this realtor.');
//   }
  
// }

// }


export class NotificationSender {
  private realtorDataSource: RealtorDataSourceImpl;
  private jobDataSource: JobDataSourceImpl;
  // private notificationSender: NotificationSender;
  
  constructor() {
    this.realtorDataSource = new RealtorDataSourceImpl(sequelize);
    this.jobDataSource = new JobDataSourceImpl(sequelize);
    // this.notificationSender = new NotificationSender();
  }

  async getSender(eventType:string, senderId:any) {
    let dataSource:any;
  
     console.log("inside sender",eventType,senderId);
    switch (eventType) {
      case 'connectionRequest':
        return await this.realtorDataSource.read(senderId)

      case 'connectionRequestResponse':
          return await this.realtorDataSource.read(senderId)

      case 'feedback':
        return await this.realtorDataSource.read(senderId)

      case 'appliedJob':
        return await this.realtorDataSource.read(senderId)

        case 'sendMessage':
          return await this.realtorDataSource.read(senderId)
      // Add other cases for different event types
      case 'applicantStatus':
        return await this.realtorDataSource.read(senderId)
  
      default:
        throw new Error('Invalid event type');
    }
  
   
  }
  
 

  async getReceiver(eventType:string, receiverId:any) {
    console.log("inside reciver",eventType,receiverId);

    switch (eventType) {
      case 'connectionRequest':
        return await this.realtorDataSource.read(receiverId)

      case 'connectionRequestResponse':
          return await this.realtorDataSource.read(receiverId)

      case 'feedback':
        return await this.realtorDataSource.read(receiverId)

      case 'appliedJob':
        return await this.jobDataSource.read(receiverId)

        case 'applicantStatus':
        return await this.realtorDataSource.read(receiverId)

      
        case 'sendMessage':
          return await this.realtorDataSource.read(receiverId)
  
      // Add other cases for different event types
  
      default:
        throw new Error('Invalid event type');
    }
   }
      // Implement specific receiver logic for different event types
      
    
  

  async getTitleAndBody(eventType:string, sender:any, receiver:any) {
    let title = '';
    let body = '';

    switch (eventType) {
      case 'connectionRequest':
        title = 'Connection Request';
        body = `You have a connection request from ${sender.firstName ?? 'Abhishek'}`;
        break;

      case 'connectionRequestResponse':
        title = 'Connection Request Status';
        body = `${sender.firstName ?? 'user'} has accepted your connection request`;
        break;

      case 'feedback':
        title = 'Feedback on job';
        body = `${sender.firstName ?? 'user'} has provided feedback on your job`;
        break;

      case 'appliedJob':
        title = 'Applied Job Status';
        body = `${sender.firstName ?? 'user'} has applied on your job`;
        break;
      
        case 'sendMessage':
        title = 'New Message';
        body = `${sender.firstName ?? 'user'} has send you message`;
        break;

        case 'applicantStatus':
        title = 'applied job status';
        body = `${sender.firstName ?? 'user'} has accept your application for job`;
        break;

      default:
        title = 'Default Title';
        body = 'Default Body';
        break;
    }

    return { title, body };
  }

  sendNotification(registrationToken:string, title:string, body:string) {
    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || 'This is a Firebase Cloud Messaging notification!'
      },
      token: registrationToken // Use the provided registration token
    };

    return admin.messaging().send(message);
  }

  async sendInAppNotification(senderId:string,receiverId:string,title:string){
    try{
  let notificationDataSource = new NotificationDataSourceImpl(sequelize)

       const notificationData={
          senderId,
          receiverId,
          message:title
       }
      const inAppNotifData=await notificationDataSource.createNotification(notificationData)
      console.log(inAppNotifData,"inappnotification data")
    }
    catch(error){
      console.error("Error sending in-app notification:", error);

    }

  }
  

  async customNotification(senderId:any, receiverId:any, eventType:string) {
  
    let sender:any
    let receiver:any
     sender = await this.getSender(eventType, senderId);
     receiver = await this.getReceiver(eventType, receiverId);

    console.log(sender,"sender is this")
    console.log(receiver,"receiver is this")

    const { title, body } = await this.getTitleAndBody(eventType, sender, receiver);
    console.log(title,body,"title and body is this")
    let deviceTokens:any
 
    if (receiver) {
      if ('firebaseDeviceToken' in receiver) {
        deviceTokens = receiver.firebaseDeviceToken ;
      } else if ( 'jobOwnerData' in receiver &&  typeof receiver.jobOwnerData=== 'object'  &&'firebaseDeviceToken' in receiver.jobOwnerData!
      ) {
        deviceTokens = receiver.jobOwnerData.firebaseDeviceToken || [];
      }
    }

    // const deviceTokens = receiver?.firebaseDeviceToken;

    if (deviceTokens && deviceTokens.length > 0) {
      deviceTokens.forEach((registrationToken:string) => {
        this.sendNotification(registrationToken, title, body)
          .then((response:any) => {
            console.log('Notification sent successfully:', response);
          })
          .catch((error:any) => {
            console.error('Error sending notification:', error);
          });

        // call inappnotification
        console.log(receiverId, senderId, title, body);
        if(eventType=="appliedJob"){
          receiverId=receiver.jobOwnerId
        }
        this.sendInAppNotification(senderId, receiverId, title);
      });
    } else {
      console.log('No device tokens found for this realtor.');
    }
  }
}

    

