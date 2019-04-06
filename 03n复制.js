const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const Multer = require('multer');

const server = express();
const loginRouter = express.Router();
server.listen(9111);
server.use('/login',loginRouter);
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
            c.end();
          }
          else {
            if(data.length>0){
              res.send({'ok':0,'msg':'用户名占用'})
              c.end();
            }
            else {
              c.query('INSERT INTO `usertab` (`user`,`pass`) VALUES("'+req.query.user+'","'+req.query.pass+'");',(err,data)=>{
                if(err){
                  res.send({'ok':0,'msg':'用户名占用'})
                  c.end();
                }
                else {
                  res.send({'ok':1,'msg':'注册成功'})

                }
                c.end();
              })
            }
          }
        })
      }
    })

})

server.use('/',express.static('./wp'))