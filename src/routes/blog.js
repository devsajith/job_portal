const express = require('express');
const blogController = require('../controllers/blog-controller');
const router = express.Router();
router.get('/', blogController.listAll);
router.get('/:id', blogController.listone);
module.exports = router;
