describe("hooks add", function(){

	var local_valid_module = "../test-test";
	var npm_invalid_module = "test-npm-install";
	var github_invalid_module = "https://github.com/mcwhittemore/test-npm-install/tarball/master";
	var github_valid_module = "https://github.com/mcwhittemore/valid-mocha-tests.hook/tarball/master";

	describe.skip("to defaults via", function(){
		//Welp... this needs to be thought out better

		// * --default, -d, --global, -g: Adds the module to the default hooks setup

		before(function(done){
			//move users defaults file if it exhists
			var defaults = require("../lib/default-modules");

			var fs = require("fs");
			if(fs.existsSync(defaults.filename)){
				run("mv "+defaults.filename+" "+defaults.filename+".user", function(err){
					done(err);
				});
			}
			else{
				done();
			}
		});

		beforeEach(function(done){
			//create an empty default file
			var defaults = require("../lib/default-modules");
			defaults.json = {};
			defaults.json.hooks = {};
			defaults.json.hooks["pre-commit"] = {};
			defaults.save(function(){
				done();
			});
		});

		var check = function(){
			var defaults = require("../lib/default-modules");
			defaults.json.hooks["pre-commit"].should.have.property("test-npm-install");
		}

		it("--default should work", function(done){
			run("hooks add --force --hook pre-commit --default "+npm_invalid_module, function(err, stdout, stderr){
				check();
				done(err);
			});
		});
		it("-d should work", function(done){
			run("hooks add --force --hook pre-commit -d "+npm_invalid_module, function(err){
				check();
				done(err);
			});
		});
		it("--global should work", function(done){
			run("hooks add --force --hook pre-commit --global "+npm_invalid_module, function(err){
				check();
				done(err);
			});
		});
		it("-g should work", function(done){
			run("hooks add --force --hook pre-commit -g "+npm_invalid_module, function(err){
				check();
				done(err);
			});
		});

		after(function(done){
			//remove test defaults file
			//move users defaults file back
			var defaults = require("../lib/default-modules");
			run("rm "+defaults.filename, function(err){
				var fs = require("fs");
				if(fs.existsSync(defaults.filename+".user")){
					run("mv "+defaults.filename+".user "+defaults.filename, function(err){
						done(err);
					});
				}
				else{
					done(err);
				}
			});
		});
	});

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
					var hooksJson = require(test_folder+"/hooks.json");
					hooksJson.should.have.property("update");
					hooksJson.update.should.have.property("test-test", "../test-test");
					done(err);
				});
			});
		});

		describe("forced via", function(){
			// * -f, --force: installs a module from npm even if it doesn't meet the `hooks-module specification`. Requires the --hook option
			it("-f should work for a npm invalid module", function(done){
				run("hooks add -f --hook update "+github_invalid_module, function(err, stdout, stderr){
					stdout.should.include(" complete".green);
					done(err);
				});
			});
			it("--force should work for a github invalid module", function(done){
				run("hooks add --force --hook update "+github_invalid_module, function(err, stdout, stderr){
					stdout.should.include(" complete".green);
					done(err);
				});
			});
		});

		describe("and include the module in package.json dependencies via", function(){
			// * --depend: adds the module to the project's package.json dependencies parameter.
			it("--depend should work");
		});

		after(function(done){
			//tear folder down
			run("rm -rf .git && rm hooks.json", function(err, stdout, stderr){
				done(err);
			});
		});
	})


});