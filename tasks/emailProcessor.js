import { google } from "googleapis";
const outlook = import('node-outlook');
import { emailQueue } from '../config/bullmq.js';


const processEmails = async (service, tokens) => {
    if(service === 'google') {
        const gmail = google.gmail({ version: 'v1', auth: tokens });
        const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
        const messages = res.data.messages || [];

        for(const msg of messages) {
            const emailRes = await gmail.users.messages.get({ userId: 'me', id: msg.id });
            const email = {from: emailRes.data.payload.headers.find(h => h.name === 'From').value, text: emailRes.data.snippet, subject: emailRes.data.payload.headers.find(h => h.name === 'Subject').value};
            emailQueue.add('emailJob', { service, tokens, email });
            await gmail.users.messages.modify({ userId: 'me', id: msg.id, resource: { removeLabelIds: ['UNREAD'] } });
        }
    } else if(service === 'outlook') {
        outlook.mail.getMessages({ token: tokens.accessToken, folderId: 'inbox', odataParams: { '$filter': 'isRead eq false' } }, (error, result) => {
            if(error) return console.error(error);

            const messages = result.value || [];
            for(const msg of messages) {
                const email = {from: msg.from.emailAddress.address, text: msg.body.content, subject: msg.subject };
                emailQueue.add('emailJob', { service, tokens, email });
                outlook.mail.updateMessage({ token: tokens.accessToken, messageId: msg.id, update: { isRead: true } });
            }
        });    
    }
};


export {processEmails}