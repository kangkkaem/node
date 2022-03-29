var express = require('express');
var router = express.Router();

/* 로그인페이지 */
router.get('/login', function(req, res, next) {
    res.render('index', {pageName:'login.ejs', userid:req.session.userid});
  });
  
  //로그인체크
  router.post('/login',function(req,res){
    var result=0;
    var id =req.body.id;
    var pass=req.body.pass;
    var sql ='select * from tbl_user where id =?';
    db.get().query(sql, [id], function(err,rows){
      if(rows.length==1) {  //아이디존재
        if(rows[0].pass ==pass){ //비밀번호일치
          result =1; 
          req.session.userid=id;
        }else { //비밀번호 불일치
          result =2;
        }
      }
      res.send({result:result});
    });
  });

/* 특정도서의리뷰목록 */
router.get('/list', function(req, res, next) {
  var code =req.query.code;
  var sql ='select *,date_format(date,"%Y-%m-%d %T") fdate from tbl_review where code=? order by id desc';
  db.get().query(sql, [code], function(err,rows){
      res.send(rows);
  })
});

module.exports = router;
