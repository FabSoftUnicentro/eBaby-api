const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");
const fs = require('fs');

const Kid = mongoose.model('Kid');

const CSV_HEADERS = ['ID','NOME','DATA','DN','SEXO','GESTAÇÃO','IDADE','UBS','LOCAL'];

const convertToCSV = (arr) => {
  const array = [Object.keys(arr[0])].concat(arr)

  return array.map(it => {
    return Object.values(it).toString()
  }).join('\n')
};

const getQuestions = async () => {
    const questions = await fs.readFileSync('../assets/questions.json', {
        'encoding': 'utf-8'
    });
    const questionsJson = JSON.parse(questions);

    return questionsJson.map(item => item.pergunta.toUpperCase());
};

const getHeaders = async () => {
    return [...CSV_HEADERS, ...await getQuestions()];
};

const getKidInfo = async (kid, id) => {
    return {
        id: id,
        nome: kid.name,
        data: null,
        dn: kid.dateOfBirth,
        sexo: kid.sex || 'NI',
        gestação: kid.gestationalAge, 
        idade: null,
        ubs: null,
        local: null,
    };
};

const getResults = async () => {
    const kids = await Kid.find({}).sort('createdAt');
    const rows = [];
    let i = 1;

    for (const kid of kids) {
        rows.push(await getKidInfo(kid, i));
        i++;
    }

    return convertToCSV(rows);
};

router.use(authMiddleware);

router.get('/spreadsheet/results', async (req, res) => {
    let result = '';

    result += (await getHeaders()).join(',') + "\n";
    result += await getResults();

    res.set({'Contet-Type': 'text/csv'});
    res.send(result);
});

module.exports = router;
