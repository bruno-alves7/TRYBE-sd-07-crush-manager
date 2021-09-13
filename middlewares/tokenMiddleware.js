const tokenMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) res.status(401).send({ message: 'Token não encontrado' });
  if (authorization.length < 16) res.status(401).send({ message: 'Token inválido' });
  next();
};

module.exports = tokenMiddleware;