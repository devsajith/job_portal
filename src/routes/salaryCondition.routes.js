const express = require('express');
const router = express.Router();

const salaryConditionController = require('../controllers/salaryCondition.controller')

/* GET users listing. */
router.get('/', salaryConditionController.ListSalaryConditions);

module.exports = router;
