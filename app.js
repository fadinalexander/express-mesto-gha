require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const InternalServerError = require('./errors/InternalServerError');

const auth = require('./middlewares/auth');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/newdb' } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookies());
app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);
app.use('/', authRouter);
app.use(errors());

app.use((err, req, res, next) => {
  return res.status(500).send({ message: 'Internal server Error - на сервере произошла ошибка' });
});

mongoose.connect(DB_URL);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
