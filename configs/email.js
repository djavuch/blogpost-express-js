const nodemailer = require('nodemailer')

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: subject,
            text: text
        })

        console.log('Email sent.')
    } catch (err) {
        console.log(err, 'An error occurred when sending email.')
    }
}

module.exports = sendEmail