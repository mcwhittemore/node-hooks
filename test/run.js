describe("hooks run should", function(){
	var hooks = require("../lib/possible-hooks");
	var local_valid_module = "../test-valid";

	before(function(done){
		this.timeout(10000);
		cleanUp(function(){
			setUp(function(){
				run("git init && hooks install", function(err){
					if(err){
						done(err);
					}
					else{
						var k = 0;
						for(var i=0; i<hooks.length; i++){
							run("hooks add --hook "+hooks[i]+" "+local_valid_module, function(err){
								k++;
								if(err){
									done(err);
								}
								else if(k==hooks.length-1){
									done(err);
								}
							});
						}
					}
				});
			});
		});
	});

	describe("work for", function(){
		for(var i=0; i<hooks.length; i++){
			it(hooks[i]+" hook", function(done){
				run("hooks run "+hooks[i], function(err, stdout){
					stdout.should.equal("this is a test");
					done(err);
				});
			});
		}
	});

	describe("not work for invalid hooks", function(){
		var invalid = hooks.join();
		it("like "+invalid, function(done){
			run("hooks run "+invalid, function(err, stdout){
				console.log(stdout);
				done("fail");
			});
		});
	});

	after(function(done){
		cleanUp(done);
	});
});