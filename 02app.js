const http = require('http');
const fs = require('fs');

let req = http.request({
  'hostname':'img.alicdn.com',
  'path':'/tps/i4/TB1_1BLMXXXXXb3XXXXlkjU.VXX-346-200.jpg_350x1000q90.jpg_.webp'
},res=>{
  var arr =[];
  var str = ''
  res.on('data',buffer=>{
    arr.push(buffer)
    str+=buffer
  });

  res.on('end',()=>{
    let b = Buffer.concat(arr);


    fs.writeFile('tb.jpg',b,()=>{
      console.log('成功了，抓取成功')
    })
    //fs.writeFile('download.html',arr,'utf8');
    //console.log(arr,str)
  });
  //console.log(res)
  //console.log(1)
});

req.end();
