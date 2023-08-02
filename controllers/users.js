const User = require('../models/user');
const errors = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res
        .status(errors.SERVER_ERROR)
        .send({ message: 'Server-side error' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.send(user);
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(name);
        res
          .status(errors.BAD_REQUEST)
          .send({ message: 'Check that the data entered is correct!' });
      } else {
        res
          .status(errors.SERVER_ERROR)
          .send({ message: 'Server-side error' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((newUser) => {
      if (!newUser) {
        res
          .status(errors.NOT_FOUND)
          .send({ message: 'User not found' });
        return;
      }
      res.send({ data: newUser });
    })
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

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(200).send({ data: newUser }))
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

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateAvatar,
  updateProfile,
};
