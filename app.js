import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import moment from 'moment';
import {oauth2Client, SCOPES} from './config/oauth.js'

dotenv.config();
const app = express();

const {PORT} = process.env;

app.use(express.json());
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

app.get('/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES});
    res.redirect(authUrl);
});

app.get('/google/callback', async (req, res) => {
    const {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    req.session.googleTokens = tokens;
    res.send('Google authentication successful!')
});


app.listen(PORT, () => {
    console.log(
        `Server is up and running on port ${PORT} on ${moment().format(
            "DD-MMM-YYYY-T-HH:mm:ss.S"
        )}`
    );
});