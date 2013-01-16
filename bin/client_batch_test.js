#!/usr/bin/env node
var db = require('../lib/main');

//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});

connection.sql_list(25,["select * from ip","select * from url"],function(err,data){
   if(err){
      console.log('error: ' + err);     
   } else {
      console.log(JSON.stringify(data));
   }
});
