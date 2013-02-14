#!/usr/bin/env node
var db = require('../lib/main');
var Q=require('q');
//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});

connection.sql('/ssd/test4',"select * from ip").then(function(data){
   console.log(data);
   return connection.cmd('/ssd/test4',{cmd:'show_time'}).then(function(cmd_ret){
   console.log(cmd_ret);
   });
}
//, function(err){ console.log('error: ' + err);}
).fail(function(err){
   console.log('something wrong in the chain: ' + err);
}).done();






