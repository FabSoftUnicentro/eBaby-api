const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;

// Conecta no MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log("Conectado ao mongo");
  })
  .catch((err) => {
    console.log("Erro ao se conectar: " + err);
  });

// Carrega o model de Usuário
require("./models/user");
require("./models/kid");

app.use(bodyParser.json());

// Inicia as rotas da API
app.use("/api", require("./controllers/userController"));
app.use("/api", require("./controllers/kidController"));

module.exports = app;
