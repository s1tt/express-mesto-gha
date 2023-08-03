const Card = require('../models/card');
const errors = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(errors.SERVER_ERROR)
      .send({ message: 'Server-side error' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(errors.BAD_REQUEST)
          .send({ message: 'Check that the data entered is correct' });
      } else {
        res
          .status(errors.SERVER_ERROR)
          .send({ message: 'Server-side error' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(errors.NOT_FOUND)
          .send({ message: 'Card not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errors.BAD_REQUEST)
          .send({ message: 'Check that the data entered is correct' });
      } else {
        res.status(errors.SERVER_ERROR).send({ message: 'Server-side error' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Card not found' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errors.BAD_REQUEST)
          .send({ message: 'Check that the data entered is correct' });
      } else {
        res
          .status(errors.SERVER_ERROR)
          .send({ message: 'Server-side error' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Card not found' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errors.BAD_REQUEST)
          .send({ message: 'Check that the data entered is correct' });
      } else {
        res
          .status(errors.SERVER_ERROR)
          .send({ message: 'Server-side error' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
