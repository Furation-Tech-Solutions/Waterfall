// const admin = require('firebase-admin');
import * as path from "path";
import admin from "../../main/firebase-sdk/firebase-config"
import { RealtorDataSourceImpl } from "@data/realtors/datasources/realtor-data-source";
import { sequelize } from "@main/sequelizeClient";
import { NotificationDataSourceImpl } from "@data/notification/datasource/notification-datasource";
import { JobDataSourceImpl } from "@data/job/datasources/job-data-sources";

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
      case 'applicantStatusAccept':
        return await this.realtorDataSource.read(senderId)

        case 'applicantStatusDecline':
        return await this.realtorDataSource.read(senderId)
  
      default:
        throw new Error('Invalid event type');
    }
  
   
  }
  
 

  async getReceiver(eventType:string, receiverId:any) {

    switch (eventType) {
      case 'connectionRequest':
        return await this.realtorDataSource.read(receiverId)

      case 'connectionRequestResponse':
          return await this.realtorDataSource.read(receiverId)

      case 'feedback':
        return await this.realtorDataSource.read(receiverId)

      case 'appliedJob':
        return await this.jobDataSource.read(receiverId)

        case 'applicantStatusAccepted':
        return await this.realtorDataSource.read(receiverId)

        case 'applicantStatusDecline':
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
        body = `${sender.firstName ?? 'user'} has accepted your friend request`;
        break;

      case 'feedback':
        title = 'Feedback on job';
        body = `${sender.firstName ?? 'user'} has provided feedback on your job`;
        break;

      case 'appliedJob':
        title = 'Applied Job Status';
        body = `${sender.firstName ?? 'user'}${sender.lastName ?? ''} has requested you on your recent post`;
        break;
      
        case 'sendMessage':
        title = 'Message Request';
        body = `You have message request from ${sender.firstName ?? "user"} ${sender.lastName ?? ''}`;
        break;

        case 'applicantStatusAccepted':
        title = 'applied job status';
        body = `Your application has been selected for the job role.Tap to view job agreement`;
        break;

        case 'applicantStatusDecline':
        title = 'applied job status';
        body = `Your application has been Rejected for the job role.`;
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

  async sendInAppNotification(senderId:string,receiverId:string,body:string){
    try{
  let notificationDataSource = new NotificationDataSourceImpl(sequelize)

       const notificationData={
          senderId,
          receiverId,
          message:body
       }
      const inAppNotifData=await notificationDataSource.createNotification(notificationData)
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

    const { title, body } = await this.getTitleAndBody(eventType, sender, receiver);
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
        if(eventType=="appliedJob"){
          receiverId=receiver.jobOwnerId
        }
        this.sendInAppNotification(senderId, receiverId, body);
      });
    } else {
      console.log('No device tokens found for this realtor.');
    }
  }
}

    

