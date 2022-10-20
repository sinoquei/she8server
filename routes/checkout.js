const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the checkout endpoint');
});

module.exports = router;
