import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const {PORT} = process.env;

app.use(express.json());
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));



app.listen(PORT, () => {
    console.log(
        `Server is up and running on port ${PORT} on ${moment().format(
            "DD-MMM-YYYY-T-HH:mm:ss.S"
        )}`
    );
});