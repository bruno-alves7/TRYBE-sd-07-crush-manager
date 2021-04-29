const express = require('express');
const fs = require('fs');
const crushes = require('../crush.json');

const app = express();

app.get('/', (req, res) => {
  if (!crushes.length) {
    res.status(200).send([]);
  } else {
    res.status(200).send(crushes);
  }
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const key = parseInt(id, 0) - 1;

  if (key < crushes.length && id >= 1) {
    res.status(200).send(crushes[key]);
  } else {
    res.status(404).send({
      message: 'Crush não encontrado',
    });
  }
});

module.exports = app;
