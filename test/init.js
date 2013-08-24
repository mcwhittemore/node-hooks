describe("hooks init", function(){

	describe("won't run without a", function(){

		it(".git folder", function(done){
			run("hooks init", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ ".git".yellow);
				done();
			});
		});
	});

	describe("should", function(){

		var fs = require("fs");

		before(function(done){
			run("mkdir .git", function(e){
				run("mkdir .git/hooks", function(ee){
					run("hooks init", function(eee){
						var err = e || ee || eee;
						done(err);
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

		describe("set the hooks.json file to a black object", function(){

			beforeEach(function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				run("rm "+hooksJsonPath, function(){
					done();
				});
			});

			it("when its not created", function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				var beforeJson = "{}";
				run("hooks init", function(err, stdout){
					var afterJson = JSON.parse(fs.readFileSync(hooksJsonPath, "utf8"));
					afterJson.should.equal(beforeJson);
					done(err);
				});
			});

			it("but not when its filled out", function(done){
				var hooksJsonPath = test_folder+"/hooks.json";
				var beforeJson = JSON.stringify({update:[]}, null, 2) + '\n';

				fs.writeFile(hooksJsonPath, beforeJson, function(err){
					run("hooks init", function(err, stdout){
						var afterJson = fs.readFileSync(hooksJsonPath, "utf8");
						afterJson.should.equal(beforeJson);
						done(err);
					});
				});
			});

		});

	});

});