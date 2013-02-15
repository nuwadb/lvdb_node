#!/usr/bin/env node
var db = require('../lib/main');
var Q=require('q');
//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});

connection.sql('/ssd/test4',"select * from ip").then(function(data){
   console.log(data);
   return connection.sql('/ssd/test4',"select * from url");
   }
//, function(err){ console.log('error: ' + err);}
).then(function(cmd_ret){
  console.log(cmd_ret);
}).fail(function(err){
   console.log('something wrong in the chain: ' + err);
}).done();






