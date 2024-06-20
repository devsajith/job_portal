const emailService = require('../config/aws-config');
const logger = require('../utils/logger-util');
const EmailTemplate = require('../model/emailTemplate.model');
const emailType = require('../types/emailTemplate-type');

/**
 * Method to create an inquiry
 * @param {*} inquiryForm 
 * @returns 
 */
const createInquiry = async (req, res, next) => {
  let inquiryForm = req;
  if (process.env.JOB_SITE_SENDER_MAIL && process.env.JOB_SITE_ADMIN_MAIL)
    try {
      //sending verification  mail
      let adminTemplate = await EmailTemplate.findOne({
        where: {
          email_template_type: emailType.INQUIRY
        }
      });
      let adminTemplateBody = adminTemplate.body;
      console.log(adminTemplateBody);
      adminTemplateBody = adminTemplateBody.replace(/fullName/g, inquiryForm.name);
      adminTemplateBody = adminTemplateBody.replace(/email/g, inquiryForm.email);
      adminTemplateBody = adminTemplateBody.replace(/contentOfInquiry/g,inquiryForm.description == null ? "": inquiryForm.description);
      logger.info('sending email to admin');
      await emailService.sendEmail(process.env.JOB_SITE_ADMIN_MAIL, adminTemplate.header, adminTemplateBody);
    }
    catch (error) {
      logger.error(`sending email for inquiry  ${inquiryForm.email} failed`);
    }
};

module.exports = { createInquiry };
