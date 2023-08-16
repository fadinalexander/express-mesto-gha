require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);
app.use('/users', authRouter);
app.use(errors());

app.use((err, req, res, next) => {
  res.send({ message: err.message });
});

mongoose.connect(DB_URL);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
