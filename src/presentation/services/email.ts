
import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
// import { sesClient } from "./libs/sesClient"; // Make sure to update the path


const sesConfig={
    credentials:{
        accessKeyId:"AKIAVYM223P6THI2II2C",
        secretAccessKey:"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"
    },
    region:"ap-south-1"
}

const sesClient=new SESClient(sesConfig)



interface EmailData {
  fromAddress: string;
  toAddress: string;
  emailSubject: string;
  emailTextBody: string;
  emailHtmlBody: string;
}

const createSendEmailCommand = ({
  fromAddress,
  toAddress,
  emailSubject,
  emailTextBody,
  emailHtmlBody,
}: EmailData): SendEmailCommand => {

  const sendEmailInput: SendEmailCommandInput = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailHtmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: emailTextBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailSubject,
      },
    },
    Source: fromAddress,
  };

  return new SendEmailCommand(sendEmailInput);
};

export const emailConfig = async (): Promise<void> => {
  const emailData: EmailData = {
    fromAddress: "shahzad.shaikh@furation.tech",
    toAddress: "pavan.ingalagi@furation.tech",
    emailSubject: "EMAIL_SUBJECT",
    emailTextBody: "TEXT_FORMAT_BODY",
    emailHtmlBody: "<html><body><p>hello</p><img src='https://digitalcommunications.wp.st-andrews.ac.uk/files/2019/04/JPEG_compression_Example.jpg'/></body></html>",
  };

  try {
    await sesClient.send(createSendEmailCommand(emailData));
    console.log("Email sent successfully.");
  } catch (e) {
    console.error("Failed to send email:", e);
  }
};

// run();
