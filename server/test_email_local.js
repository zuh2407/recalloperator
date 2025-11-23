const nodemailer = require('nodemailer');

const user = 'zuhair2407atham@gmail.com';
const pass = 'yiju vaur jhip nmju';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
});

const sendTestEmail = async () => {
    console.log('Attempting to send test email...');
    try {
        const info = await transporter.sendMail({
            from: `"Test" <${user}>`,
            to: user,
            subject: "Test Email from Local Script",
            text: "If you see this, the credentials are correct!"
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email failed to send.');
        console.error(error);
    }
};

sendTestEmail();
