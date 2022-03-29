var express = require('express');
var router = express.Router();
var db = require('../db');

/*도서목록*/
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*8;
    var word='%' + req.query.word + '%';

    var sql='select count(*) total from tbl_book where title like ?';
    db.get().query(sql, [word], function(err, rows){
        var total=rows[0].total;
        var sql='select *,format(price,0) fprice from tbl_book where title like ? order by code desc limit ?,8';
        db.get().query(sql, [word, start], function(err, rows){
            res.send({rows:rows, total:total});
        });
    });
});


//도서정보 페이지 이동
router.get('/read', function(req, res){
    var code=req.query.code;
    var sql='select *,format(price,0) fprice from tbl_book where code=?';
    db.get().query(sql, [code], function(err, rows){
        var vo=rows[0];
        res.render('index', {pageName:'read.ejs', vo:vo, 
                            userid:req.session.userid,
                            username:req.session.username});
    });
});

//도서 등록 페이지 이동
router.get('/insert', function(req,res){
    var sql = "select * from tbl_book";
    db.get().query(sql, function(err,rows){      
        res.render('index', {pageName: 'insert.ejs',userid:req.session.userid, code:req.session.code});
  });
});

//도서 등록
router.post('/insert', function(req, res){
    var title=req.body.title;
    var price=req.body.price;
    var image=req.body.image;
    var sql='insert into tbl_book(title,price,image) values(?,?,?)';
    db.get().query(sql,[title,price,image],function(err,rows){
        res.sendStatus(200);
      });
    });

    //파일업로드
var multer = require('multer');
var path='./public/images';
var upload=multer({
  storage:multer.diskStorage({
    destination:(req,res,done)=>{
      done(null,path);
    },
    filename:(req,file,done)=> {
      done(null,Date.now()+ "_"+ file.originalname);
    }
  })
});



module.exports = router;
