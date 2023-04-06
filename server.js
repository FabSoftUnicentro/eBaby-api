const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Conecta no MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(CHANGE_URL, {useNewUrlParser: true}).then(() => {
    console.log("Conectado ao mongo")
  }).catch((err) => {
    console.log("Erro ao se conectar: "+err)
  })


const port = process.env.PORT || 3000;
// Carrega o model de Usuário
require("./models/user");
require("./models/kid");

app.use(bodyParser.json());

// Inicia as rotas da API
app.use("/api", require("./controllers/userController"));
app.use("/api", require("./controllers/kidController"));

const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
  console.log("Servidor Rodando! ")
})
