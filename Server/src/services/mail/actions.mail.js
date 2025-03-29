import { ENV } from '../../config/env.config.js';
import { ApiError } from '../../utils/apiError.util.js';
import { COMPANY } from '../../constants.js';
import nodemailer from 'nodemailer';
import MAIL_CONFIG from './config.mail.js';

// * PLACEHOLDER REPLACEMENT UTILITY
function replacePlaceholders(template, data) {
  return template.replace(/{(.*?)}/g, (_, key) => {
    const value = key.split('.').reduce((obj, prop) => obj?.[prop], data);
    return value !== undefined ? value : `{${key}}`;
  });
}

// * MAIL TRANSPORTER SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.NODE_MAILER_GOOGLE_EMAIL,
    pass: ENV.NODE_MAILER_GOOGLE_PASS,
  },
});

/**
 * UNIFIED MAIL SENDING FUNCTION
 * 
 * @param {string} type - TYPE OF MAIL TO SEND (FROM MAIL_CONFIG)
 * @param {string} username - RECIPIENT'S USERNAME
 * @param {string} email - RECIPIENT'S EMAIL ADDRESS
 * @param {Object} params - ADDITIONAL PARAMETERS (VERIFICATION CODE, RESET URL, ETC.)
 * @returns {Promise<Object>} - MAIL INFO AND SENT TIMESTAMP
 */
const sendMail = async (type, username, email, params = {}) => {
  try {
    // * GET MAIL CONFIGURATION
    const config = MAIL_CONFIG[type];
    
    if (!config) {
      throw new Error(`Invalid mail type: ${type}`);
    }
    
    // * PREPARE DATA FOR TEMPLATE
    const templateData = config.paramMapper(username, email, params);
    
    // * MERGE WITH COMPANY DATA
    const mergedData = { COMPANY, ...templateData };
    
    // * PROCESS TEMPLATE WITH DATA
    const htmlContent = replacePlaceholders(config.template, mergedData);

    // * PREPARE EMAIL OPTIONS
    const mailOptions = {
      from: ENV.NODE_MAILER_GOOGLE_EMAIL,
      to: email,
      subject: config.subject,
      html: htmlContent,
    };

    // * SEND EMAIL
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(new Error(error.message || config.errorMessage));
        }
        resolve(info);
      });
    });

    const mailSentAt = Date.now();
    return { info, mailSentAt };
  } catch (error) {
    throw new ApiError(
      500, 
      error.message || "Failed To Send Mail!", 
      error?.errors || [], 
      error, 
      error?.stack
    );
  }
};

// * EXPORT THE UNIFIED MAIL FUNCTION
export { sendMail };