const express = require ('express');
require('dotenv').config({path: './config/.env'})
require('./config/db')
const app = express();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on Social-Media-back on PORT ${process.env.PORT } || 3000`);
})