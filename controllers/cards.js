const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      next(error);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Bad Request - Данные переданы не верно'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        next(new NotFoundError('Not Found - Карточка не найдена на сервере'));
      } else if (error instanceof CastError) {
        next(new BadRequestError('Bad Request - Данные переданы не верно'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        next(new NotFoundError('Not Found - Карточка не найдена на сервере'));
      } else if (error instanceof CastError) {
        next(new BadRequestError('Bad Request - Данные переданы не верно'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new Error('NotValidId');
      }
      if (card.owner.toString() !== _id) {
        throw new UnauthorizedError('Невозможно удалить карточку другого пользователя');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((removedCard) => {
      res.status(200).send(removedCard);
    })
    .catch((error) => {
      if (error.message === 'NotValidId') {
        next(new NotFoundError('Not Found - Карточка не найдена на сервере'));
      } else if (error instanceof CastError) {
        next(new BadRequestError('Bad Request - Данные переданы не верно'));
      } else if (error instanceof 'UnauthorizedError') {
        next(new ForbiddenError('Forbidden - Невозможно удалить карточку другого пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
