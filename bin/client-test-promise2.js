#!/usr/bin/env node
var db = require('../lib/main');
var Q=require('q');
//var args = process.argv.slice(2);
//console.log(db.sleepsort(args));

var connection=new(db.Connection)({port:9001});
queue = [];
queue.push(connection.sql('/ssd/test4',"select * from ip"));
queue.push(connection.cmd('/ssd/test4',{cmd:'show_time'}));

// Q.all: execute an array of 'promises' and 'then' call either a resolve
// callback (fulfilled promises) or reject callback (rejected promises)
Q.all(queue).then(function(ful) {
  // All the results from Q.all are on the argument as an array
  console.log('fulfilled', ful);
}, function(rej) {
  // The first rejected (error thrown) will be here only
  console.log('rejected', rej);
}).fail(function(err) {
  // If something whent wrong, then we catch it here, usually when there is no
  // rejected callback.
  console.log('fail', err);
}).fin(function() {

  // Finally statemen; executed no matter of the above results
  console.log('finally');
});




