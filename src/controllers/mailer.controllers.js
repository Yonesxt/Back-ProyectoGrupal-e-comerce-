const nodemailer = require('nodemailer');
const {google} =require('googleapis');


const {
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN
  } = process.env



//Config mailer

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.URI
);

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

async function sendMail(email, template) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                type: "OAUTH2",
                user:"unknowcode812@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            },
        })
        const mailOptions = {
            from: "Unknow Code Admin <unknowcode812@gmail.com>",
            to: email,
            subject: "NodeMailer prueba",
            html: template
        };

        const result = await transporter.sendMail(mailOptions);
        
        return result

    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail