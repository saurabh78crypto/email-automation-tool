import { Queue, Worker } from "bullmq";
import { sendEmail } from '../services/emailService.js';
import { categorizeEmail, generateReply } from '../services/openaiService.js';


const emailQueue = new Queue('emailQueue', { connection: { url: process.env.REDIS_URL } });


const emailWorker = new Worker('emailQueue', async job => {
    const { service, tokens, email } = job.data;
    const category = await categorizeEmail(email);
    const reply = await generateReply(category, email);

    await sendEmail(service, tokens, email.from, 'Re: ' + email.subject, reply);
}, { connection: { url: process.env.REDIS_URL } });



export {emailQueue}