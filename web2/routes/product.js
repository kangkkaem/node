var express = require('express');
var router = express.Router();
var db = require('../db');

/* 상품목록 */
router.get('/list', function(req, res, next) {
  var order =req.query.order;
  var strOrder='';
  var word = '%'+ req.query.word + '%';

  switch(order){
      case 'recently':
        strOrder='order by id desc';
        break;
      case 'low':
        strOrder='order by price';
        break;
      case 'high':
          strOrder='order by price desc';
          break;
      case 'name':
          strOrder='order by name';
          break;
  }
  var sql ='select * from product where name like ?' + strOrder;
  db.get().query(sql,[word], function(err, rows){
    res.send(rows);
  });
});

//상품정보
router.get('/read',function(req,res){
    var id = req.query.id;
    var sql='select * from product where id=?';
    db.get().query(sql, [id], function(err, rows){
        res.send(rows[0]);
    });
});

//상품등록페이지
router.get('/insert',function(req,res){
    res.render('insert');
});

//이미지 업로드
var multer = require('multer');
var upload = multer({
    storage:multer.diskStorage({
        destination:(req, file, done)=>{
            done(null, './public/images')
        },
        filename:(req, file, done) => {
            done(null, Date.now()+'_'+file.originalname);
        }
    })
});

//상품등록
router.post('/insert', upload.single('image'), function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image ='';
    if(req.file !=null) image=req.file.filename;

    console.log(`name:${name}\nprice:${price}\nimage:${image}`);
    var sql ='insert into product(name,price,image) values(?,?,?)';
    db.get().query(sql, [name,price,image], function(err,rows){
        res.sendStatus(200);
    });
});

//상품삭제
var fs = require('fs');
router.post('/delete', function(req,res){
    var id = req.body.id;
    var image = req.body.image;
    var sql = 'delete from product where id=?';
    db.get().query(sql,[id], function(err,rows){
        res.sendStatus(200);
        //파일삭제
        if(image !=''){
            fs.unlink('./public/images/'+image, function(err){
                if(err) throw err;
            });
        }
    });
});

module.exports = router;
