const express = require('express');
const router = express.Router();

const fs = require('fs');
let rawdata = fs.readFileSync('./db.json');
let employee = JSON.parse(rawdata);

router.get('/', (req, res) => {
    let outputJSON = {
        employees : employee["data"]
    }
    res.json(outputJSON);
});

router.get('/by_name/:qname', (req, res) => {
    let query = req.params['qname'];
    filtered_employees = employee["data"].filter(q => q.employee_name.includes(query));
    let outputJSON = {
        employees : filtered_employees
    }
    res.json(outputJSON);
});

router.get('/by_age/:start_age/:end_age', (req, res) => {
    let start_age = req.params['start_age'];
    let end_age = req.params['end_age'];
    filtered_employees = employee["data"].filter(
        q => {
            if ((q.employee_age > parseInt(start_age)) && (q.employee_age < parseInt(end_age))) {
                return true;
            }
            return false;
        }
    );
    let outputJSON = {
        employees : filtered_employees
    }
    res.json(outputJSON);
});

module.exports = router;