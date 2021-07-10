// command start server: npm run dev   /  npm start

const express = require('express')
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3900;
const http = require('http').Server(app)
const users = require('./routes/users')
const cards = require('./routes/cards')
const makeToken = require('./routes/makeToken')
require('dotenv').config()
const cors = require('cors');

app.use(cors());
app.use(express.json()) 
// app.use(cookieParser());   -  npm install cookie-parser


const start = async () => {
  // console.log(process.env.PORT);
  // console.log(process.env.PORT || 3900);
  // console.log(PORT);
  try {
        await mongoose.connect(process.env.DATABASE_URL_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
      .then(() => console.log('Conected to DB'))
      .catch( e => console.log('Could not connect to DB...', e))

      app.use('/api/cards', cards)
      app.use('/api/maketoken', makeToken)
      app.use('/api/users', users)
      
      http.listen(PORT, () => console.log( `Listening port ${PORT}`))    
  } catch (e) {
      console.log(e);
  }
}

start();
