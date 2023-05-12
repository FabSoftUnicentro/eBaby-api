const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = 'mongodb+srv://dan:1234@ebaby.t0bujpo.mongodb.net/test';

// Conecta no MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useNewUrlParser : true})
    .then(() => {console.log("Conectado ao mongo")})
    .catch((err) => {console.log("Erro ao se conectar: " + err)})

// Carrega o model de Usuário
require("./models/user");
require("./models/kid");
require("./models/test");
require("./models/testQuestion");

app.use(bodyParser.json());

// Inicia as rotas da API
app.use("/api", require("./controllers/userController"));
app.use("/api", require("./controllers/kidController"));

// Health Check
app.get("/health", async (req, res) => { return res.json({message : "OK"}); });

module.exports = app;
