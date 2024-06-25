import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import {oauth2Client, SCOPES, outlookOptions} from './config/oauth.js'

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


app.get('/outlook', (req, res) => {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize? 
 client_id=${outlookOptions.clientId}&response_type=code&redirect_uri=${encodeURIComponent(outlookOptions.redirectUri)}&respons 
 e_mode=query&scope=${outlookOptions.scope.join(' ')}&state=12345`;

    res.redirect(authUrl);
});

app.get('/outlook/callback', async (req, res) => {
    try {
        const {code} = req.query;
        const tokenParams = {
            client_id: outlookOptions.clientId,
            client_secret: outlookOptions.clientSecret,
            redirect_uri: outlookOptions.redirectUri,
            code,
            grant_type: 'authorization_code'
        };

        const tokenResponse = await axios.post(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, qs.stringify(tokenParams), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        req.session.outlookTokens = tokenResponse.data;
        res.send('Outlook authentication successful!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed.');
    }
    
});


app.listen(PORT, () => {
    console.log(
        `Server is up and running on port ${PORT} on ${moment().format(
            "DD-MMM-YYYY-T-HH:mm:ss.S"
        )}`
    );
});