/*const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = async function sendMail(email, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject,
            text
        });
        return info;
    } catch (error) {
        console.error("Error sending email", error);
    }
};
*/


const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try {
        /*  let transporter = nodemailer.createTransport({
              host: process.env.MAIL_HOST,
              auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASS,
              },
              secure: false,
          })*/
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,  // Use 465 for SSL
            secure: false,  // Set to true for port 465 (SSL)
            auth: {
                user: process.env.MAIL_USER, // Your Gmail address
                pass: process.env.MAIL_PASS, // Your App-specific password
            },
        });

        let info = await transporter.sendMail({
            //from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`, // sender address
            from: `${process.env.MAIL_USER}`, // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
        })
        console.log(info.response)
        return info
    } catch (error) {
        console.log(error.message)
        return error.message
    }
}

module.exports = mailSender
