import nodemailer from 'nodemailer';

const sendEmail = async (service, tokens, to, subject, text) => {
    let transporter;

    if(service === 'google') {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { type: 'OAuth2', user: 'saurabhpingale93@gmail.com', accessToken: tokens.access_token }
        });
    } else if(service === 'outlook') {
        transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: { type: 'OAuth2', user: 'saurabhpingale@hotmail.com', accessToken: tokens.access_token }
        });
    }

    await transporter.sendMail({ from: 'saurabhpingale93@gmail.com', to, subject, text });
};


export {sendEmail}