var http=require('http')
var node_lvdb=exports;

node_lvdb.host = '127.0.0.1';
node_lvdb.port = 9001;
var querystring = require("querystring");
var Q = require('q');

// host:port
// port
// {host:  port:}
node_lvdb.Connection=function Connection(){
   var args = Array.prototype.slice.call(arguments),
   options = {},host,port;

   args.forEach(function (a) {
   if (typeof(a) === 'number' || (typeof(a) === 'string' && /^\d{2,5}$/.test(a))) {
        port = parseInt(a);
   } else if (typeof(a) === 'object') {
        options = a;
        host = host || options.hostname || options.host;
        port = port || options.port;
   } else {
        host = a;            
        if (match = host.match(/^(.+)\:(\d{2,5})$/)) {
             host = match[1];
             port = parseInt(match[2]);
        }
   }
    });


  this.host = host || node_lvdb.host;
  this.port = port || node_lvdb.port;
};


node_lvdb.Connection.prototype.request = function(options,json_line,callback){
	options.headers['Content-Length'] = json_line.length;
	var req = http.request(options, function(res) {
		  //console.log('STATUS: ' + res.statusCode);
		  //console.log('HEADERS: ' + JSON.stringify(res.headers));
		  if (res.statusCode!=200){
			  console.log('HTTP STATUS: ' + res.statusCode);
			  callback("http status: "+res.statusCode,null);
			  return
		  }
		  res.setEncoding('utf8');
          var full_data='';
		  res.on('data', function (chunk) {
              full_data +=chunk;
          });
          res.on('end', function() {

		         //console.log('BODY: ' + chunk);
			  try{
			     var db_res=JSON.parse(full_data);
                 if (db_res['status'] == false) {
                    console.log(db_res['error']);
                    callback(db_res['error'],null);
                 } else { 
                   callback(null,db_res['rows']);
                 } 
			  } catch (err){
				  console.log(err);
				  callback(err,null);
			  }
		  });
		});

	req.on('error', function(e) {
                  //console.log(e.stack)
		  console.log('problem with request: ' + e.message);
		  callback(e.message,null);
	});
	req.write(json_line);
	//console.log(json_line);
	req.end();
};

node_lvdb.Connection.prototype.create_query_path = function(partition){

  if(typeof(partition)==='number'){
    // partition_id
    return '/partition/' + partition + '/db';
  } else if (typeof(partition)==='string'){
    // partition_directory
    return '/db/location' + '?' + querystring.stringify({local: partition});
  }
}

node_lvdb.Connection.prototype.sql = function(partition,sql,callback){

  var query_path=this.create_query_path(partition);

	var options = {
			  hostname: this.host,
			  port: this.port,
			  path: query_path,
			  method: 'POST',
			  headers: {}
	};

	var json_cmd={};
    json_cmd['sql']=sql;
    var json_line=JSON.stringify(json_cmd);
	options.headers['Content-Type'] = 'application/json';

  if((callback ===null) || (callback==undefined)) return this.requestP(options,json_line);

	return this.request(options, json_line, callback);	
};


node_lvdb.Connection.prototype.sql_list = function(partition,sql_list,callback){

  var query_path=this.create_query_path(partition);

  var options = {
			  hostname: this.host,
			  port: this.port,
			  path: query_path,
			  method: 'POST',
			  headers: {}
	};
	
	var json_list=[];
	for (var i=0; i<sql_list.length; i++) {
	    var json_cmd={};
	    json_cmd['sql']=sql_list[i];
		json_list.push(json_cmd);
	}
    var json_line=JSON.stringify(json_list);
    //console.log(json_line);
	options.headers['Content-Type'] = 'application/json';
  if((callback ===null) || (callback==undefined)) return this.requestP(options,json_line);
  return this.request(options, json_line, callback);
};

node_lvdb.Connection.prototype.cmd = function(partition,cmd_obj,callback){
  var query_path=this.create_query_path(partition);
	var options = {
			  hostname: this.host,
			  port: this.port,
			  path: query_path,
			  method: 'POST',
			  headers: {}
	};
	
    var json_line=JSON.stringify(cmd_obj);
    //console.log(json_line);
	options.headers['Content-Type'] = 'application/json';
	options.headers['Content-Length'] = json_line.length;
  if((callback ===null) || (callback==undefined)) return this.requestP(options,json_line);
  return this.request(options, json_line, callback);
};


node_lvdb.Connection.prototype.requestP = function(options,json_line){
  var deferred = Q.defer();
  options.headers['Content-Length'] = json_line.length;
  var req = http.request(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    if (res.statusCode!=200){
      console.log('HTTP STATUS: ' + res.statusCode);
//      callback("http status: "+res.statusCode,null);
      deferred.reject("http status: "+res.statusCode);
      return
    }
    res.setEncoding('utf8');
    var full_data='';
    res.on('data', function (chunk) {
      full_data +=chunk;
    });
    res.on('end', function() {

      //console.log('BODY: ' + full_data);
      try{
        var db_res=JSON.parse(full_data);
        if (db_res['status'] == false) {
          console.log('json error:' + db_res['error']);
          //callback(db_res['error'],null);
          deferred.reject(db_res['error']);
        } else {
          //callback(null,db_res['rows']);
          deferred.resolve(db_res['rows']);
        }
      } catch (err){
        console.log(err);
        //callback(err,null);
        deferred.reject(err);
      }
    });
  });

  req.on('error', function(e) {
    //console.log(e.stack)
    console.log('problem with request: ' + e.message);
    //callback(e.message,null);
    deferred.reject(e.message);
  });
  req.write(json_line);
  //console.log(json_line);
  req.end();
  return deferred.promise;
};
