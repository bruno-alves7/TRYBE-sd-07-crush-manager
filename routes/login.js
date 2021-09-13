const express = require('express');
const TokenGenerator = require('tokgen');

const app = express.Router();

function autPass(password) {
if (!password) throw new Error('O campo "password" é obrigatório');
if (password.length < 6) throw new Error('A "senha" deve ter pelo menos 6 caracteres');
}

function autEmail(email) {
  if (!email) throw new Error('O campo "email" é obrigatório');
  const rex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!rex.test(email)) throw new Error('O "email" deve ter o formato "email@email.com"');
}

app.post('/', (req, res) => {
const { email, password } = req.body;
try {
  autEmail(email);
  autPass(password);
  const generator = new TokenGenerator({ chars: '0-9a-f', length: 16 });
  const token = generator.generate();
  res.status(200).send({ token });
} catch (error) {
  res.status(400).send({ message: error.message });
}
});

module.exports = app;