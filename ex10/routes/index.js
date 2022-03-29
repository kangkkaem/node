var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {pageName:'list.ejs',
                      userid:req.session.userid,
                      username:req.session.username});
});

module.exports = router;
