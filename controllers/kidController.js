const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");


const Kid = mongoose.model("Kid");

router.use(authMiddleware);

router.post("/registerKid", async (req, res) => {
    const kidData = {
      cpf: req.body.kid[0]["cpf"],
      name: req.body.kid[0]["name"],
      dateOfBirth: req.body.kid[0]["birthAge"],
      gestationalAge: req.body.kid[0]["gestationalAge"],
      weight: req.body.testkid[0]["weight"],
      length: req.body.testkid[0]["length"],
    };

    try {
      if (await Kid.findOne({ kidData })) {
        return res.send({'success': false, 'Message': "Email já cadastrado :("});
      }
  
      const kid = await Kid.create(kidData);

      return res.json({ kid, 'success': true });
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: "Kid registration failed" });
    }
  });

  module.exports = router;