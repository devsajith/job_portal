const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill-controller')


/* GET users listing. */
router.get('/',  skillController.getSkill);
module.exports = router;
