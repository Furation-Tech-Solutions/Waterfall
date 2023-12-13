import * as AWS from 'aws-sdk';

class PushNotificationService {
    private sns: AWS.SNS;
    private platformArn: string;

    constructor(region: string, accessKeyId: string, secretAccessKey: string, platformArn: string) {
        this.sns = new AWS.SNS({ region, accessKeyId, secretAccessKey });
        this.platformArn = platformArn;
    }

    async createPlatformEndpoint(deviceToken: string): Promise<string> {
        const params = {
            PlatformApplicationArn: this.platformArn,
            Token: deviceToken,
        };

        const response = await this.sns.createPlatformEndpoint(params).promise();
        return response.EndpointArn as string;
    }

    async sendPushNotification(endpointArn: string, message: string): Promise<void> {
        const params = {
            TargetArn: endpointArn,
            Message: JSON.stringify({ default: message }),
            MessageStructure: 'json',
        };

        await this.sns.publish(params).promise();
    }
}

// export default PushNotificationService;




// import PushNotificationService from './PushNotificationService';

async function main() {
    try {
        const region = "ap-south-1"; // replace with your AWS region
        const accessKeyId = "AKIAVYM223P6ZC3JNAGW"; // replace with your AWS access key
        const secretAccessKey = "VWcSSUUt1ok6XIpMHUvLnGK0nRjVrteaOaN1iBDj"; // replace with your AWS secret key
        const platformArn = 'your-platform-application-arn'; // replace with your platform application ARN

        const pushNotificationService = new PushNotificationService(region, accessKeyId, secretAccessKey, platformArn);

        // Replace with the device token of the device you want to send the push notification to
        const deviceToken = 'device-token';

        const endpointArn = await pushNotificationService.createPlatformEndpoint(deviceToken);

        // Message to be sent in the push notification
        const message = 'Hello from AWS SNS!';

        await pushNotificationService.sendPushNotification(endpointArn, message);

        console.log('Push notification sent successfully.');
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

main();

