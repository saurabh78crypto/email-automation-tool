import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import moment from 'moment';
import axios from 'axios';
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
 client_id=${outlookOptions.clientId}&response_type=code&redirect_uri=${outlookOptions.redirectUri}&respons 
 e_mode=query&scope=${outlookOptions.scope.join(' ')}&state=12345`;

    res.redirect(authUrl);
});

app.get('/outlook/callback', async (req, res) => {
    const {code} = req.query;
    const tokenResponse = await axios.post(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, null, {
        params: {
            client_id: outlookOptions.clientId,
            client_secret: outlookOptions.clientSecret,
            redirect_uri: outlookOptions.redirectUri,
            code,
            grant_type: 'authorization_code'
        }
    });
    req.session.outlookTokens = tokenResponse.data;
    res.send('Outlook authentication successful!')
});


app.listen(PORT, () => {
    console.log(
        `Server is up and running on port ${PORT} on ${moment().format(
            "DD-MMM-YYYY-T-HH:mm:ss.S"
        )}`
    );
});