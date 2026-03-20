import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'spiders4220@gmail.com';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD,
    },
    debug: true, // Enable debug logs
    logger: true // Log to console
});
// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email server connection error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`📧 Attempting to send email to: ${to}`);
        
        const mailOptions = {
            from: `"Subscription Tracker" <${accountEmail}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

export default transporter;