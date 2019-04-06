const http = require('http');
http.createServer((req,res)=>{
  res.write('gd');
  res.end();
}).listen(9000);