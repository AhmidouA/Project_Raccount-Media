const express = require ('express');
require('dotenv').config({path: './config/.env'})
const app = express();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on Social-Media-back on ${process.env.PORT } || 3000`);
})