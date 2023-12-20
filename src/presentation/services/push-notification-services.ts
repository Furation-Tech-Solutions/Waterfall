// const admin = require('firebase-admin');
import * as path from "path";
import admin from "../../main/firebase-sdk/firebase-config"

// Assuming serviceAccount.json is in the app folder
export class NotificationSender {
    constructor() {
        // Fetch the service account key JSON file content
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

  
  
  
  customNotification(){
  // Example usage:
  const notificationSender = new NotificationSender();
  
  // Sending a notification
  const registrationToken:string = "cJtZn4tB0PXV_KYBzkDwj7:APA91bHjrMmfQp88NR8PMlpOE1QFDmYKHOrhIIBzgX3wXubqBwMcZCvolH8nCFt2bfh0wShl67bY_SDMZPSC7ilnIQw70FNBZEl9ZqX3FL5PWSCv5jE-eEojqbtFkla8G5J3pI6-VvaG";
  notificationSender.sendNotification(registrationToken, 'Custom Title', 'Custom Body')
  .then((response:any) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error:any) => {
        console.error('Error sending notification:', error);
    });
}
    
}
