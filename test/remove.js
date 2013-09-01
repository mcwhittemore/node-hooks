describe("hooks remove from local file", function(){

	var local_valid_module = "../test-valid";

	beforeEach(function(done){
		//reset the folder to empty
		// cleanUp(function(){
		// 	setUp(function(){
		// 		run("mkdir .git && mkdir .git/hooks && hooks install && hooks add "+local_valid_module, function(err, stdout, stderr){
		// 			done(err);
		// 		});
		// 	});
		// });
		done();
	});

	describe("with no args", function(){
		it.skip("on an installed module should work", function(done){
			run("hooks remove "+local_valid_module, function(err, stdout, stderr){

			});
		});

		it.skip("forgetting to supply the module should result in an error message", function(done){
			run("hooks remove", function(err, stdout, stderr){
				stdout.should.include("must supply a module");
				done(err);
			});
		});
	});

	describe("with the --hook arg", function(){
		//* --all-hooks: remove the module from all git hooks

	});

	describe("with the --all-hooks arg", function(){
		//* --hook <GIT HOOK NAME>: remove module from specified git hook.

	});

	describe("with the --hard arg", function(){
		//* --hard: Also removes the module from the project's dependencies parameter.

	});

	after(function(done){
		//tear folder down
		//cleanUp(done);
		done();
	});

});