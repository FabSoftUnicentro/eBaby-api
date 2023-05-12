const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const Kid = mongoose.model("Kid");
const Test = mongoose.model("Test");
const TestQuestion = mongoose.model("TestQuestion");

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
      let kid = await Kid.findOne({ cpf: kidData.cpf });
      if (! kid) {
        kid = await Kid.create(kidData);
      }
  
      const test = await Test.create({
        cpfKid: kidData.cpf,
        cpfAgent: req.body.agent.cpf,
        weight: req.body.testkid[0]["weight"],
        length: req.body.testkid[0]["length"],
        note: req.body.testkid[0]["note"],
        done: req.body.testkid[0]["done"],
      });

      for (item of req.body.testkid[0].itens) {
        await TestQuestion.create({
          test_id: test._id,
          question_id: item.id,
          success: item.result,
        });
      }

      return res.json({'success': true});
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: "Kid registration failed" });
    }
  });

  module.exports = router;