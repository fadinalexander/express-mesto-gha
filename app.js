const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const InternalServerError = require('./errors/InternalServerError');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/users', authRouter);

app.use((err, req, res, next) => {
  next(new InternalServerError('Ошибка на сервере'));
});

mongoose.connect(DB_URL);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
