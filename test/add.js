describe("hooks add", function(){

	var local_valid_module = "../test-valid";
	var local_invalid_module = "../test-invalid";
	var npm_invalid_module = "test-npm-install";
	var github_invalid_module = "https://github.com/mcwhittemore/test-npm-install/tarball/master";

	describe("to local folder", function(){

		beforeEach(function(done){
			//reset the folder to empty
			cleanUp(function(){
				setUp(function(){
					run("mkdir .git && mkdir .git/hooks && hooks install", function(err, stdout, stderr){
						done(err);
					});
				});
			});
		});

		describe("with no args", function(){
			it("should work for a local valid module", function(done){
				run("hooks add "+local_valid_module, function(err, stdout, stderr){
					stdout.should.include(" complete".green);
					done(err);
				});
			});
			it("should fail for a local invalid module", function(done){
				run("hooks add "+local_invalid_module, function(err, stdout, stderr){
					stdout.should.include("use the `-f` option.");
					done(err);
				});
			});
			it("should fail for a npm invalid module", function(done){
				run("hooks add "+npm_invalid_module, function(err, stdout, stderr){
					stdout.should.include("use the `-f` option.");
					done(err);
				});
			});
			it("should fail for a github invalid module", function(done){
				this.timeout(10000);
				run("hooks add "+github_invalid_module, function(err, stdout, stderr){
					stdout.should.include("use the `-f` option.");
					done(err);
				});
			});
		})

		describe("to specified hook via should work", function(){
			// * --hook <GIT HOOK NAME>: this option overrides the hook-module's default-hook parameter.
			it("--hook should work", function(done){
				run("hooks add --hook update "+local_valid_module, function(err, stdout){
					stdout.should.include(" complete".green);
					var hooksJson = readJson(test_folder+"/hooks.json");
					hooksJson.should.have.property("update");
					hooksJson.update.should.have.property("test-valid", "../test-valid");
					done(err);
				});
			});
		});

		describe("forced via", function(){
			// * -f, --force: installs a module from npm even if it doesn't meet the `hooks-module specification`. Requires the --hook option
			it("-f should work for a npm invalid module", function(done){
				run("hooks add -f --hook update "+local_invalid_module, function(err, stdout, stderr){
					stdout.should.include(" complete".green);
					done(err);
				});
			});
			it("--force should work for a github invalid module", function(done){
				run("hooks add --force --hook update "+local_invalid_module, function(err, stdout, stderr){
					stdout.should.include(" complete".green);
					done(err);
				});
			});
		});

		describe("and include the module in package.json dependencies", function(){
			// * --depend: adds the module to the project's package.json dependencies parameter.
			it("always", function(done){
				run("hooks add "+local_valid_module, function(err){
					var json = readJson(test_folder+"/package.json");
					json.dependencies.should.have.property("test-valid","../test-valid");
					done(err);
				});
			});
		});

		after(function(done){
			//tear folder down
			cleanUp(done);
		});
	})


});