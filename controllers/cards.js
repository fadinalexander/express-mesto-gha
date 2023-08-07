const { ValidationError } = require('mongoose').Error;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.status(404).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
