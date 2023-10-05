const express = require ('express');
const app = express();

// Cookies
const cookieParser = require('cookie-parser');

// dotenv files
require('dotenv').config({path: './config/.env'})
// mongoose config
require('./config/db')

// middleware service
const {authMiddleware} = require('./middleware');

// formatage de données envoyées à un serveur
app.use(express.urlencoded({ extended: true }));
// le contenu du body sera du json
app.use(express.json());
app.use(cookieParser());



// Router
const {userRouter, postRouter} = require ('./routes')


// PORT
const PORT = process.env.PORT || 3000

// jwt
app.get('*', authMiddleware.checkUser);
app.get('/jwtid', authMiddleware.requireAuth, (req, res) => {
  res.status(200).json(res.locals.user._id)
});


// routes
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)


app.listen(PORT, () => {
    console.log(`Listening on Social-Media-back on PORT ${process.env.PORT } || 3000`);
})