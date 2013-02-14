#!/usr/bin/env node
var db = require('../lib/main');

//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});

connection.sql('/ssd/test4',"select * from ip").then(function(data){
   console.log(data);
}, function(err){
   console.log('error: ' + err);
}).done();



