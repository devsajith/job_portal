const express = require('express');
const router = express.Router();

const salaryController = require('../controllers/salary-controller')

/* GET users listing. */
router.get('/', salaryController.ListSalary);

module.exports = router;
