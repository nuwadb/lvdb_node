// test/main.js
var should = require('should');
var lvdb = require('../lib/main');
var assert = require("assert");

describe('db sql', function() {
   describe('query partition 25', function() {
            it('return true', function() {
                var connection=new(lvdb.Connection)();
                connection.sql(25,"select * from ip",function(err,cb){
                	assert.equal(err,null);
                });
                //result.should.eql([]);
            });
   });
        
});

describe('db cmd', function() {
	   describe('management cmd query partition 25', function() {
	            it('return true', function() {
	                var connection=new(lvdb.Connection)();
	                connection.cmd(25,{cmd:'show_time'},function(err,cb){
	                   assert.equal(err,null);
	                });
	                //result.should.eql([]);
	            });
	        });
	        
	});
