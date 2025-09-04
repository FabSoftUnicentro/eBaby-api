const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const Kid = mongoose.model("Kid");
const Test = mongoose.model("Test");
const TestQuestion = mongoose.model("TestQuestion");

router.use(authMiddleware);

router.post("/registerKid", async (req, res) => {
  try {
    const session = await mongoose.startSession();

    for (let i = 0; i < req.body.kid.length; i++) {
      await session.withTransaction(async () => {
        const kidData = {
          cpf: req.body.kid[i]["cpf"],
          name: req.body.kid[i]["name"],
          dateOfBirth: req.body.kid[i]["birthAge"],
          gestationalAge: req.body.kid[i]["gestationalAge"],
          sex: req.body.kid[i]["sex"],
          weight: req.body.testkid[i]["weight"],
          length: req.body.testkid[i]["length"],
        };

        let kid = await Kid.findOne({ cpf: kidData.cpf }, null, { session: session });
        if (!kid) {
          kid = await Kid.create([kidData], { session: session });
        }

        const test = await Test.create(
          [
            {
              cpfKid: kidData.cpf,
              cpfAgent: req.body.agent.cpf,
              weight: req.body.testkid[i]["weight"],
              length: req.body.testkid[i]["length"],
              note: req.body.testkid[i]["note"],
              done: req.body.testkid[i]["done"],
            }
          ],
          { session: session },
        );

        for (item of req.body.testkid[i].itens) {
          await TestQuestion.create(
            [
              {
                test_id: test[0]._id,
                question_id: item.id,
                success: item.result,
              }
            ],
            { session: session },
          );
        }
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(400).json({ error: "Kid registration failed" });
  }
});

module.exports = router;
