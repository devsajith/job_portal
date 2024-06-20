const express = require('express');

const highLevelController = require('../controllers/high-level-area-controller');
const router = express.Router();


router.get('/', highLevelController.getHighLevelArea);

module.exports = router;