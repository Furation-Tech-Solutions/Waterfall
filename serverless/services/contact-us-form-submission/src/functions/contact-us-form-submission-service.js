"use strict";
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient({
  region: 'ap-south-1'
});
let pug = require("pug");
let juice = require('juice');

const STAGE = process.env.STAGE;

const  sendOrderMail = async (userData) => {
  let html = renderRegisterationNote(userData);
  html = juice(html);
  let destination = {};
  let subject = {};
  destination = {
    // ToAddresses: [ "sahil.chourasiya@furation.tech" ],
    ToAddresses: [ userData.data.Email ],
    BccAddresses: [],
  };
  subject = { Data: "User Contact and Message" };

  let params = {
    Destination: destination,
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: subject,
    },
    Source: "agentriderca@gmail.com",
    ReplyToAddresses: []
  };

  return new SendEmailCommand(params);
};

// Main handler function
// const main = async (event) => {
module.exports.main = async (event) => {
  let email = '';
  let request = {};
  try {
    request = JSON.parse(event.body);
  } catch (jsonError) {
    console.log("There was an error parsing the JSON Object", jsonError);
    return {
      statusCode: 400,
      isBase64Encoded: false,
      headers: { statusCode: 400, "content-type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "The request is malformed, the body does not parse",
        data: null,
      }),
    };
  }
  
  if (request.data.Email ){
    // console.log("print request body", request.data.Email)
    email = request.data.Email;
    const mailOrder = await sendOrderMail(request);
    console.log("mail sent")
    await client.send(mailOrder);
  } else {
    email = "email not provided"
  }

  let response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      statusCode: 200,
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      email: email,
    }),
  };

  // console.log(response);

  // Return the results
  return response;
};

const renderRegisterationNote = (userData) => {
  // console.log("userData", userData);
  const template = getTemplate();
  // const userDetails = userData.data
  const html = pug.render(template, { Email: userData.data.Email, Message: userData.data.Message });
  return html;
};

const getTemplate = () => {
  return `
html
  head
      title Contact Us Message
      meta(charset='utf-8')
      meta(name="viewport" content="width=device-width initial-scale=1.0")
      style.
          body {
              margin: 0; 
              padding: 0; 
              background-color: #F1F3F5; 
              font-family: 'Lato', sans-serif;
          }
          .para_title {
              color: #343A40;
              font-size: 20px;
              font-weight: bold; 
              text-align: center; 
              margin: 20px 0; 
              padding: 10px 0;
          }
          
          .para_content {
              color: #777A7C;
              font-size: 14px;
              font-weight: medium;
              padding: 5px 0;
          }
          
          th {
              text-align: left;
          }
        
          td {
              text-align: center;
          }
  body
      table(align="center" cellpadding="0" cellspacing="0" width="600" style="border: 2px solid #F1F3F5; background-color: #FFFFFF; margin: 20px auto; padding: 20px;")
          tbody
              tr
                  td(colspan="2")
                      h2 User Contact Lead  
              tr
                  td
                      p.para_title Email
                  td
                      p.para_content #{Email}
              tr
                  td                   
                      p.para_title Message
                  td
                      p.para_content #{Message}
`;
};


// TO TEST ON LOCAL DEVICE
// const event = {
//   body: JSON.stringify({
//     data: {
//           // "Email": "schoursiaya127@gmail.com",
//           "Message": "Lorem ipsum"
//     }
//   })
// }
// main(event);