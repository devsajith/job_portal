const AWS = require(`aws-sdk`);

const SES_CONFIG = {
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env. AWS_SECRET_ACCESS_KEY,
region: process.env.AWS_REGION,
};


let AWS_SES;
if(  process.env.AWS_ENVIRONMENT == "LOCAL")
  AWS_SES = new AWS.SES(SES_CONFIG);
else
//sending mail using aws config
  AWS_SES = new AWS.SES({region: process.env.AWS_REGION});

let sendEmail = (recipientEmail, Subject, Body ) => {
let params = {
  Source: process.env.JOB_SITE_SENDER_MAIL,
  Destination: {
    ToAddresses: [
      recipientEmail
    ],
  },
  ReplyToAddresses: [],
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: Body,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: Subject,
    }
  },
};
if(process.env.ENABLE_MAIL == 'true')
{
  return AWS_SES.sendEmail(params).promise();
}
else
{
return true
}

};

let sendTemplateEmail = (recipientEmail, template, source, TemplateData) => {
let params = {
  Source: source,
  Template: template,
  Destination: {
    ToAddresse: [ 
      recipientEmail
    ]
  },
  TemplateData: TemplateData
};
return AWS_SES.sendTemplatedEmail(params).promise();
};

module.exports = {
sendEmail,
sendTemplateEmail,
};