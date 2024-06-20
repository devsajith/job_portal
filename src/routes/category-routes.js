const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category-controller');


router.get('/pickup', categoryController.listAllPickup);
router.get('/', categoryController.getAllCategory);

module.exports = router;

