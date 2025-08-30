const nodemailer = require('nodemailer');

/**
 * Email service for sending notifications
 */
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `Devnovate Blogs <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

/**
 * Email templates
 */
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Devnovate Blogs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Devnovate Blogs!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining Devnovate Blogs. We're excited to have you as part of our community.</p>
        <p>You can now start creating and sharing your technical knowledge with the world.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  blogSubmitted: (name, blogTitle) => ({
    subject: 'Blog Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Blog Submitted Successfully</h2>
        <p>Hello ${name},</p>
        <p>Your blog <strong>${blogTitle}</strong> has been submitted successfully and is pending review.</p>
        <p>We'll notify you once it's approved and published.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  blogApproved: (name, blogTitle, blogUrl) => ({
    subject: 'Your Blog Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Blog Approved!</h2>
        <p>Hello ${name},</p>
        <p>Great news! Your blog <strong>${blogTitle}</strong> has been approved and is now published.</p>
        <p>You can view it <a href="${blogUrl}">here</a>.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  blogRejected: (name, blogTitle, reason) => ({
    subject: 'Blog Submission Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Blog Update</h2>
        <p>Hello ${name},</p>
        <p>We've reviewed your blog <strong>${blogTitle}</strong> and unfortunately, we cannot publish it at this time.</p>
        <p>Reason: ${reason || 'Does not meet our content guidelines'}</p>
        <p>You can edit and resubmit your blog from your profile dashboard.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  newComment: (name, blogTitle, commenterName, blogUrl) => ({
    subject: 'New Comment on Your Blog',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Comment</h2>
        <p>Hello ${name},</p>
        <p>${commenterName} has commented on your blog <strong>${blogTitle}</strong>.</p>
        <p>Check it out <a href="${blogUrl}">here</a>.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${name},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),
  blogDeleted: (name, blogTitle) => ({
    subject: 'Your Blog Has Been Deleted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Blog Deleted</h2>
        <p>Hello ${name},</p>
        <p>Your blog <strong>${blogTitle}</strong> has been deleted by an administrator.</p>
        <p>If you have any questions about this decision, please contact our support team.</p>
        <p>Best regards,<br>The Devnovate Team</p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};