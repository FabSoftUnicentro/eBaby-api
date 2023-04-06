const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");


const Kid = mongoose.model("Kid");

router.post("/registerKid", async (req, res) => {
    const { cpf, name, dateOfBirth, gestationalAge, weight, length} = req.body;
  
    try {
      if (await Kid.findOne({ cpf })) {
        return res.send({'success': false, 'Message': "Email já cadastrado :("});
      }
  
      const kid = await Kid.create(req.body);
      return res.json({ kid });
    } catch (err) {
      return res.status(400).json({ error: "Kid registration failed" });
    }
  });

  module.exports = router;