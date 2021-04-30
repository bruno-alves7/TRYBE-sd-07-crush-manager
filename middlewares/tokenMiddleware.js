const tokenMiddleware = (req, res, next) => {
  const { token } = req.headers;
  if (!token) return res.status(401).send({ message: 'Token não encontrado' });
  if (token.length < 16) return res.status(401).send({ message: 'Token inválido' });
  next();
};

module.exports = tokenMiddleware;