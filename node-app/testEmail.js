import sgMail from "@sendgrid/mail";
import 'dotenv/config.js'


console.log(process.env.SENDGRID_API_KEY);
console.log(process.env.mail_from_address);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'mikeheiser9@gmail.com', // Change to your recipient
  from: process.env.mail_from_address, // Change to your sender
  subject: 'Testing SendGrid Email Functionality',
  text: 'This is a test email',
  html: '<strong>This is a test email</strong>',
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });