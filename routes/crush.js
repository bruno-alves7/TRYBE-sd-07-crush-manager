const express = require('express');
const fs = require('fs');
const rescue = require('express-rescue');
// const crushes = require('../crush.json');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
  if (!crushes) {
    res.status(200).send([]);
  } else {
    res.status(200).send(crushes);
} 
});

app.get('/:id', (req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
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

app.post('/', rescue(async (req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
  const size = crushes.length;
  crushes[size] = {
    name: req.body.name,
    age: req.body.age,
    id: size + 1,
    date: req.body.date,
   };

  try {
    await fs.promises.writeFile(`${__dirname}/../crush.json`, JSON.stringify(crushes));
    res.status(201).send({
      message: 'Salvo com sucesso!',
    });
  } catch (error) {
    throw new Error(error);
  }
}));

module.exports = app;
