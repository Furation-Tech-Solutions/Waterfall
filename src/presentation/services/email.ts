
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
  toAddress: string;
  fromAddress: string;
  emailSubject: string;
  emailTextBody: string;
  emailHtmlBody: string;
}



const createSendEmailCommand = ({
  toAddress,
  fromAddress,
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

export const run = async (): Promise<void> => {
  const emailData: EmailData = {
    toAddress: "shehzadmalik123.sm@gmail.com",
    fromAddress: "shahzad.shaikh@furation.tech",
    emailSubject: "EMAIL_SUBJECT",
    emailTextBody: "TEXT_FORMAT_BODY",
    emailHtmlBody: "HTML_FORMAT_BODY",
  };

  try {
    await sesClient.send(createSendEmailCommand(emailData));
    console.log("Email sent successfully.");
  } catch (e) {
    console.error("Failed to send email:", e);
  }
};

// run();
