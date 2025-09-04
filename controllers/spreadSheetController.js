const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const converter = require('json-2-csv');
const moment = require('moment');

const currentDir = __dirname;
const parentDir = path.join(currentDir, '..');
const filePath = path.join(parentDir, 'assets', 'questions.json');
const questions = fs.readFileSync(filePath, {
    'encoding': 'utf-8'
});
const QUESTIONS = JSON.parse(questions);

const Kid = mongoose.model('Kid');
const Test = mongoose.model('Test');
const TestQuestion = mongoose.model('TestQuestion');

const findQuestionById = (id) => QUESTIONS.find(question => question.id === id);

const getTestQuestionResult = (testQuestion) => {
    switch (testQuestion.success) {
        case 0:
            return 'E';
            break;
        case 1:
            return 'A';
            break;
        case 2:
            return 'SO'
            break;
        case 3:
            return 'R';
            break;
        default:
            return 'SO';
    };
};

const createRow = () => {
    const row = {
        ID: '-',
        NOME: '-',
        DATA: '-',
        DN: '-',
        SEXO: '-',
        GESTAÇÃO: '-',
        IDADE: '-',
        UBS: '-',
        LOCAL: '-'
    };

    for (const question of QUESTIONS) {
        row[question.perguntaCurta.toUpperCase()] = 'SO';
    }

    return row;
}

const getResults = async () => {
    const kids = await Kid.find({}).sort('createdAt');
    const rows = [];
    let i = 1;

    for (const kid of kids) {
        let row = createRow();

        row.ID = i;
        row.NOME = kid.name;
        row.DN = moment(kid.dateOfBirth).format("DD/MM/YYYY");
        row.SEXO = kid.sex || '-';
        row.GESTAÇÃO = kid.gestationalAge;

        const test = await Test.findOne({ cpfKid: kid.cpf });
        if (! test) {
            continue;
        }

        row.DATA = moment(test.createdAt).format("DD/MM/YYYY");
        row.IDADE = Math.abs(
            moment(kid.dateOfBirth).diff(moment(test.createdAt), 'years')
        );

        const testQuestions = await TestQuestion.find(({ 'test_id': test._id}));
        if (! testQuestions) {
            continue;
        }

        for (const testQuestion of testQuestions) {
            const originalQuestion = findQuestionById(testQuestion.question_id);
            row[originalQuestion.perguntaCurta.toUpperCase()] = getTestQuestionResult(testQuestion);
        }

        rows.push(row);
        i++;
    }

    return rows;
};

router.get('/spreadsheet/results', async (req, res) => {
    const filename = 'resultados-' + moment().format('DD-MM-YYYY') + '.csv';
    const data = await getResults();
    const csv = await converter.json2csv(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(csv);
});

module.exports = router;
