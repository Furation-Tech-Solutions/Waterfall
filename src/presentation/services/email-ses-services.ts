
// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
interface EmailOptions {
    email: string;
    subject: string;
    message: string | null  ;
}

class SESMailService {
    private readonly sesClient: SESClient;
    constructor() {
        this.sesClient = new SESClient({
            region: "ap-south-1",
            credentials: {
                accessKeyId: "AKIAVYM223P6ZC3JNAGW",
                secretAccessKey: "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",
            },
        });
    }

    async sendEmail(mailOptions:EmailOptions):Promise<void> {
    

        const params = {
            Source: "shahzad.shaikh@furation.tech", // Change to your SES verified email address
            Destination: {
                ToAddresses: [mailOptions.email],
            },
            Message: {
                Subject: {
                    Data: mailOptions.subject,
                },
                Body: {
                    Text: {
                        Data: mailOptions.message || "",
                        Charset: "UTF-8",
                    }
                    // Html: {
                    //     Data: message || "", // Assuming message is in HTML format
                    //     Charset: "UTF-8",
                    // },
                },
            },
        };

        try {
            const command = new SendEmailCommand(params);
            const response = await this.sesClient.send(command);
            // console.log(response, "Email sent successfully");
            
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
export default SESMailService;
