var express = require('express');
var router = express.Router();
var db = require('../db');

/* 로그인 페이지 */
router.get('/login', function(req, res, next) {
  res.render('index', {pageName:'login.ejs',
                      userid:req.session.userid,
                      username:req.session.username});
});



//로그인체크
router.post('/login', function(req, res){
  var id=req.body.id;
  var pass=req.body.pass;
  var sql='select * from tbl_user where id=?';
  var result=0;

  db.get().query(sql, [id], function(err, rows){
    if(rows.length==1){ //아이디존재
      if(rows[0].pass == pass) { //비밀번호 일치
        result=1;
        req.session.userid=id;
        req.session.username=rows[0].name;
      }else { //비밀번호 불일치
        result=2;
      }
    }
    res.send({result:result});
  });
});


//로그아웃
router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
