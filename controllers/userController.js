const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const User = mongoose.model("User");

router.post("/register", async (req, res) => {
  const { cpf, name , cellphone, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.send({'success': false,'message': "Email já cadastrado :("});
    }
    if(await User.findOne({cellphone})){
      return res.send({'success': false,'message': "Celular já cadastrado"});
    }
    if(await User.findOne({cpf})){
      return res.send({'success': false , 'message': "CPF já cadastrado"});
    }
    
    const user = await User.create(req.body);
    return res.json({ user , 'success': true });
  } catch (err) {
    console.log(err);
    return res.send({ 'message': "User registration failed" });
  }
});


router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if ((!user) || !(await user.compareHash(password))) {
      return res.send({'success': false,'message': "Credenciais invalidas"});
    }

    return res.send({
      'success': true,
      'message': "Bem vindo!",
      user,
      token: user.generateToken()
    });
  } catch (err) {
    return res.send({ error: "User authentication failed" });
  }
});

router.use(authMiddleware);

router.get("/me", async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "Can't get user information" });
  }
});

module.exports = router;
