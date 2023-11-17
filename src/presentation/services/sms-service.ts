import { SNS } from 'aws-sdk';

interface SMSServiceOptions {
    phoneNumber: string;
    message: string;
}

class SMSService {
    private readonly sns: SNS;

    constructor() {
        // Configure the AWS SDK with your credentials and preferred region
        this.sns = new SNS({
            accessKeyId: 'AKIAVYM223P6ZC3JNAGW',
            secretAccessKey: 'VWcSSUUt1ok6XIpMHUvLnGK0nRjVrteaOaN1iBDj',
            region: 'ap-south-1', // Change to your preferred region
        });
    }

    async sendSMS(smsOptions: SMSServiceOptions): Promise<void> {
        // Define the parameters for sending an SMS
        const params = {
            Message: smsOptions.message, // The text message you want to send
            PhoneNumber: smsOptions.phoneNumber// The recipient's phone number (with the country code)
            // MessageAttributes: {
            //     'AWS.SNS.SMS.SenderID': {
            //         DataType: 'String',
            //         StringValue: 'YOUR_TRANSACTIONAL_SENDER_ID', // Replace with your Transactional Sender ID
            //     },
            //     'AWS.SNS.SMS.SMSType': {
            //         DataType: 'String',
            //         StringValue: 'Transactional',
            //     },
            // },
        };

        // Send the SMS message
        try {
            const data = await this.sns.publish(params).promise();
            console.log('SMS sent successfully:', data.MessageId);
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }
}

export default SMSService;
