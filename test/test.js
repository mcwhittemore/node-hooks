test_folder = process.cwd()+"/test/test_folder";
var exec = require("child_process").exec;
var should = require("should");
var colors = require("colors");

run = function(command, callback){
	exec("cd "+test_folder+" && "+command, callback);
}

todo = function(){
	"this needs to be done".should.be.true;
}

before(function(done){

	exec("mkdir "+test_folder, function(err, stdout, stderr){
		if(err){
			console.log(stderr);
		}
		done(err);
	});
});

after(function(done){

	exec("rm -rf "+test_folder, function(err, stderr, stdout){
		if(err){
			console.log(stderr);
		}
		done(err);
	});

});