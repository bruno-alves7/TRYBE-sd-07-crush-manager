const express = require('express');
const fs = require('fs');
const rescue = require('express-rescue');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const app = express.Router();

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

app.get('/', (req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
  if (!crushes) {
    res.status(200).send([]);
  } else {
    res.status(200).send(crushes);
} 
});

function autPost(name, age) {
  if (!name) throw new Error('O campo "name" é obrigatório');
  if (name.length < 3) throw new Error('O "name" deve ter pelo menos 3 caracteres');
  if (!age) throw new Error('O campo "age" é obrigatório');
  if (age < 18) throw new Error('O crush deve ser maior de idade');
}

function autDatedAt(date) {
  const { datedAt } = date;
  const rex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!datedAt) {
    throw new Error('O campo "date" é obrigatório e "datedAt" e "rate" não podem ser vazios');
  }
  if (!rex.test(datedAt)) throw new Error('O campo "datedAt" deve ter o formato "dd/mm/aaaa"');
}

function autDate(date) {
  if (date === undefined || date.rate === undefined) {
  throw new Error('O campo "date" é obrigatório e "datedAt" e "rate" não podem ser vazios');
}
}

function autRate(date) {
  if (date.rate < 1 || date.rate > 5) {
    throw new Error('O campo "rate" deve ser um inteiro de 1 à 5');
}
}

app.use(tokenMiddleware);
app.post('/', rescue((req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
  const size = crushes.length;
  const { name, age, date } = req.body;
  try {
  autPost(name, age);
  autDate(date);
   autDatedAt(date);
   autRate(date);
   crushes[size] = { name: req.body.name, age: req.body.age, id: size + 1, date: req.body.date };
   fs.promises.writeFile(`${__dirname}/../crush.json`, JSON.stringify(crushes));
    res.status(201).send({ id: crushes[size].id,
      name: crushes[size].name,
      age: crushes[size].age,
      date: crushes[size].date });
  } catch (error) { res.status(400).send({ message: error.message }); }
}));

app.put('/:id', rescue((req, res) => {
  const crushes = JSON.parse(fs.readFileSync(`${__dirname}/../crush.json`, 'utf8'));
  const { name, age, date } = req.body;
  const { id } = req.params;
  const key = parseInt(id, 0) - 1;
  try {
    autPost(name, age);
  autDate(date);
   autDatedAt(date);
   autRate(date);
   crushes[key] = { name, id: parseInt(id, 0), age, date }; 
    fs.promises.writeFile(`${__dirname}/../crush.json`, JSON.stringify(crushes));
    res.status(201).send({ id: crushes[key].id,
      name: crushes[key].name,
      age: crushes[key].age,
      date: crushes[key].date });
  } catch (error) { res.status(400).send({ message: error.message }); }
}));

module.exports = app;
