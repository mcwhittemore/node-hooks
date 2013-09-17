describe("hooks install", function(){

	describe("won't run without a", function(){

		before(function(done){
			setUp(done);
		});

		it(".git folder", function(done){
			run("hooks install", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ ".git".yellow);
				done();
			});
		});

		after(function(done){
			cleanUp(done);
		});
	});

	describe("should", function(){

		var fs = require("fs");

		before(function(done){
			setUp(function(){
				run("mkdir .git", function(e){
					run("mkdir .git/hooks", function(ee){
						run("hooks install", function(eee){
							var err = e || ee || eee;
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
				//TODO: implment .git/hook preservation
			});
		});

		describe("set the hooks.json file to a blank object", function(){

			beforeEach(function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				run("rm "+hooksJsonPath, function(){
					done();
				});
			});

			it.skip("when its not created", function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				var beforeJson = JSON.stringify({}, null, 2) + '\n';
				run("hooks install", function(err, stdout){
					var afterJson = fs.readFileSync(hooksJsonPath, "utf8");
					afterJson.should.equal(beforeJson);
					done(err);
				});
			});

			it.skip("but not when its filled out", function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				var beforeJson = JSON.stringify({update:[]}, null, 2) + '\n';

				fs.writeFile(hooksJsonPath, beforeJson, function(err){
					run("hooks install", function(err, stdout){
						var afterJson = fs.readFileSync(hooksJsonPath, "utf8");
						afterJson.should.equal(beforeJson);
						done(err);
					});
				});
			});

		});

		describe("set the package.json file to an object with the name default", function(){

			beforeEach(function(done){
				var packageJsonPath = test_folder+"/package.json";
				run("rm "+packageJsonPath, function(){
					done();
				});
			});

			it.skip("when its not created", function(done){
				var packageJsonPath = test_folder+"/package.json";
				var obj = {
					name:"default",
					devDependencies: {
						"node-hooks": "0.0.1"
					}
				}
				var beforeJson = JSON.stringify(obj, null, 2) + '\n';
				run("hooks install", function(err, stdout){
					var afterJson = fs.readFileSync(packageJsonPath, "utf8");
					afterJson.should.equal(beforeJson);
					done(err);
				});
			});

			it("but not when its filled out", function(done){
				var packageJsonPath = test_folder+"/package.json";
				var obj = {
					update:[],
					devDependencies: {
						"node-hooks": "0.0.1"
					}
				}
				var beforeJson = JSON.stringify(obj, null, 2) + '\n';

				fs.writeFile(packageJsonPath, beforeJson, function(err){
					run("hooks install", function(err, stdout){
						var afterJson = fs.readFileSync(packageJsonPath, "utf8");
						afterJson.should.equal(beforeJson);
						done(err);
					});
				});
			});

		});

	});

});