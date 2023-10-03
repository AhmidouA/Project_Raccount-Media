const express = require ('express');
const app = express();

// dotenv files
require('dotenv').config({path: './config/.env'})
// mongoose config
require('./config/db')

// formatage de données envoyées à un serveur
app.use(express.urlencoded({ extended: true }));
// le contenu du body sera du json
app.use(express.json());



// Router
const {userRouter} = require ('./routes')


// PORT
const PORT = process.env.PORT || 3000

// routes
app.use('/api/user', userRouter)


app.listen(PORT, () => {
    console.log(`Listening on Social-Media-back on PORT ${process.env.PORT } || 3000`);
})