var express = require('express');
var router = express.Router();

// Controllers
const home_controller = require('../controllers/homeController');

/* GET home page. */
router.get('/', home_controller.home);

module.exports = router;
