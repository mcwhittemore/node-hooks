describe("hooks init", function(){

	describe("won't run without a", function(){

		it(".git folder", function(done){
			run("hooks init", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ ".git".yellow);
				done();
			});
		});

		it("package.json file", function(done){
			run("hooks init", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ "package.json".yellow);
				done();
			});
		});
	});

	describe("should", function(){

		var fs = require("fs");

		before(function(done){
			run("mkdir .git", function(e){
				run("mkdir .git/hooks", function(ee){
					fs.writeFile(test_folder+"/package.json", "{}", function(eee){
						run("hooks init", function(eeee){
							var err = e || ee || eee || eeee;
							done(err);
						});
					});
				});
			});
		});

		describe("update the .git/hooks folder to contain a file called", function(){

			var hooks = require("../lib/possible-hooks");
			var numHooks = hooks.length;

			while(numHooks--){
				var hook = hooks[numHooks];
				it(hook, function(){
					fs.existsSync(test_folder+"/.git/hooks/"+hook).should.be.true;
				});
			}

		});

		describe("perserve the current hooks", function(){
			it.skip("once i get to it", function(){
				todo();
			});
		});

		describe("set the package.json file hooks attribute to a black object", function(){

			before(function(done){
				var packageJsonPath = test_folder+"/package.json";
				run("rm "+packageJsonPath, function(){
					done();
				});
			});

			it("when its blank", function(done){
				var packageJsonPath = test_folder+"/package.json";
				var beforeJson = {};
				fs.writeFile(packageJsonPath, JSON.stringify(beforeJson), function(err){
					run("hooks init", function(err, stdout){
						var afterJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
						afterJson.should.have.property("hooks");
						done(err);
					});
				});
			});

			it("but not when its filled out", function(done){
				var packageJsonPath = test_folder+"/package.json";
				var beforeJson = JSON.stringify({hooks:{update:[]}}, null, 2) + '\n';

				fs.writeFile(packageJsonPath, beforeJson, function(err){
					run("hooks init", function(err, stdout){
						var afterJson = fs.readFileSync(packageJsonPath, "utf8");
						afterJson.should.equal(beforeJson);
						done(err);
					});
				});
			});

		});

	});

});