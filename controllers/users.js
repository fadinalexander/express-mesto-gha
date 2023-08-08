const { ValidationError } = require('mongoose').Error;
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('NotValidId'))
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Запрашиваемые пользователи не найдены' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (error instanceof ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate({ _id }, { name, about }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Не удалось обновить ваш профиль' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate({ _id }, { avatar }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Не удалось обновить аватар пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
