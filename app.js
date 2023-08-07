const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64d1278ffd73be011b219376',
  };

  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
