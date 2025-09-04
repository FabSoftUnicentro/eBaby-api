const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const converter = require("json-2-csv");
const moment = require("moment");

const filePath = path.join(__dirname, "..", "assets", "questions.json");
const QUESTIONS = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const Kid = mongoose.model("Kid");
const Test = mongoose.model("Test");
const TestQuestion = mongoose.model("TestQuestion");

const QUESTION_MAP = Object.fromEntries(
  QUESTIONS.map(q => [q.id, q])
);

const findQuestionById = id => QUESTION_MAP[id];

const getTestQuestionResult = ({ success }) => {
  switch (success) {
    case 0: return "E";
    case 1: return "A";
    case 2: return "SO";
    case 3: return "R";
    default: return "SO";
  }
};

const createRow = () => Object.fromEntries([
  ["ID", "-"],
  ["NOME", "-"],
  ["DATA", "-"],
  ["DN", "-"],
  ["SEXO", "-"],
  ["GESTAÇÃO", "-"],
  ["IDADE", "-"],
  ["UBS", "-"],
  ["LOCAL", "-"],
  ...QUESTIONS.map(q => [q.perguntaCurta.toUpperCase(), "SO"])
]);

const getResults = async () => {
  const kids = await Kid.find({}).sort("createdAt").lean();
  const kidCpfs = kids.map(k => k.cpf);

  const tests = await Test.find({ cpfKid: { $in: kidCpfs } }).lean();
  const testsByCpf = Object.fromEntries(tests.map(t => [t.cpfKid, t]));

  const testIds = tests.map(t => t._id);
  const testQuestions = await TestQuestion.find({ test_id: { $in: testIds } }).lean();
  const questionsByTestId = testQuestions.reduce((acc, tq) => {
    (acc[tq.test_id] ||= []).push(tq);
    return acc;
  }, {});

  return kids.map((kid, i) => {
    const row = createRow();
    row.ID = i + 1;
    row.NOME = kid.name;
    row.DN = moment(kid.dateOfBirth).format("DD/MM/YYYY");
    row.SEXO = kid.sex || "-";
    row.GESTAÇÃO = kid.gestationalAge;

    const test = testsByCpf[kid.cpf];
    if (!test) return null;

    row.DATA = moment(test.createdAt).format("DD/MM/YYYY");
    row.IDADE = moment(test.createdAt).diff(moment(kid.dateOfBirth), "years");

    for (const tq of questionsByTestId[test._id] || []) {
      const originalQuestion = findQuestionById(tq.question_id);
      if (originalQuestion) {
        row[originalQuestion.perguntaCurta.toUpperCase()] = getTestQuestionResult(tq);
      }
    }

    return row;
  }).filter(Boolean);
};

router.get("/spreadsheet/results", async (req, res) => {
  try {
    const filename = `resultados-${moment().format("DD-MM-YYYY")}.csv`;
    const data = await getResults();
    const csv = await converter.json2csv(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error("Error generating CSV:", err);
    res.status(500).send("Erro ao gerar resultados");
  }
});

module.exports = router;
