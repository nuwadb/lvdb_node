#!/usr/bin/env node
var db = require('../lib/main');

//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});

connection.cmd(86,{cmd:'show_time'},function(err,data){
   if(err){
      console.log('error: ' + err);     
   } else {
      console.log(JSON.stringify(data));
   }
});
