const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.body.agent.token;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decoded = await promisify(jwt.verify)(authHeader, "secret");

    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: "Token invalid" });
  }
};
