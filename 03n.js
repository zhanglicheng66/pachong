const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const Multer = require('multer');

const server = express();
const loginRouter = express.Router();
server.listen(9111);
server.use(Multer({dest:'./wp/allFiles'}).any());
server.use('/login',loginRouter);





//上传文件接口
loginRouter.use('/getfiles',(req,res)=>{
  console.log(req.files)//{name:filsssss}
  var newName =req.files[0].path + path.parse(req.files[0].originalname).ext;
  var hashName = req.files[0].filename+ path.parse(req.files[0].originalname).ext;
  var thisTime = new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString();
  fs.rename(req.files[0].path,newName,(err)=>{
    if(err){
      console.log(err);
    }
    else{
      var Pool = mysql.createPool({
        'host':'localhost',
        'user':'root',
        'password':'123456789',
        'database':'wp'
      });
      Pool.getConnection((err,c)=>{
        if(err){
          console.log(err);
          res.send({'ok':0,'msg':'数据库链接失败'});
          c.end();
        }
        else{
          c.query('INSERT INTO `'+req.body.Fsnames+'` (`lastName`,`hashName`,`size`,`type`,`download`,`lastTime`) VALUES("'+req.files[0].originalname+'","'+hashName+'","'+req.files[0].size+'","'+path.parse(req.files[0].originalname).ext+'","0","'+thisTime+'");',(err,data)=>{
            if(err){
              console.log(err);
              res.send({'ok':0,'msg':'存储失败'});
              c.end();

            }
            else{
              //
              res.send({'ok':1,'msg':'上传成功',hash:hashName,timer:thisTime});

            }
            c.end();
          })

        }
      })


    }
  })

});



//注册接口
loginRouter.use('/res',(req,res)=>{
    var Pool = mysql.createPool({
      'host':'localhost',
      'user':'root',
      'password':'123456789',
      'database':'wp'
    });
    Pool.getConnection((err,c)=>{
      if(err){
        console.log(err);
        res.send({'ok':0,'msg':'链接失败'})
      }
      else {
        c.query('SELECT user FROM `usertab` WHERE user="'+req.query.user+'";',(err,data)=>{
          if(err){
            console.log('未来查询到');
            res.send({'ok':0,'msg':'链接失败'})
            c.release();
          }
          else {
            if(data.length>0){
              res.send({'ok':0,'msg':'用户名占用'})
              c.release();
            }
            else {
              c.query('INSERT INTO `usertab` (`user`,`pass`) VALUES("'+req.query.user+'","'+req.query.pass+'");',(err,data)=>{
                if(err){
                  res.send({'ok':0,'msg':'数据库链接失败'})
                  c.release();
                }
                else {

                  c.query(`CREATE TABLE ${req.query.user}
                          (
                          ID int(255) NOT NULL AUTO_INCREMENT,
                          LastName varchar(255) NOT NULL,
                          hashName varchar(255) NOT NULL,
                          lastTime varchar(255) NOT NULL,
                          type varchar(255),
                          size varchar(255) NOT NULL,
                          download varchar(255) NOT NULL,
                          PRIMARY KEY (ID)
                          
                          )`,(err,data)=>{
                          if(err){
                            console.log(err)
                          }
                          else {
                            res.send({'ok':1,'msg':'注册成功'});
                          };
                        c.release();
                      })


                }
                // c.end();
              })
            }
          }
        })
      }
    })

})











loginRouter.use('/login',(req,res)=>{
  var Pool = mysql.createPool({
    'host':'localhost',
    'user':'root',
    'password':'123456789',
    'database':'wp'
  });
  Pool.getConnection((err,c)=>{
    if(err){
      console.log(err);
      res.send({'ok':0,'msg':'链接失败'})
    }
    else {
      c.query('SELECT user,pass FROM `usertab` WHERE user="'+req.query.user+'" AND pass="'+req.query.pass+'";',(err,data)=>{
        if(err){
          console.log('未来查询到');
          res.send({'ok':0,'msg':'链接失败'})
          c.release();
        }
        else {
          if(data.length>0){
            res.send({'ok':1,'msg':'登陆成功'})
            //c.release();
          }
          else {
            res.send({'ok':0,'msg':'登陆失败'})
          }
          c.release();
        }
      })
    }
  })

})

server.use('/',express.static('./wp'))