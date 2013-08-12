describe("hooks init", function(){

	describe("won't run without a", function(){

		it(".git folder", function(done){
			run("hooks init", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ ".git".yellow);
				done();
			});
		});

		it("package.json file", function(){
			run("hooks init", function(err, stdout, stderr){
				err.should.have.property("code", 1);
				stdout.should.include("ERROR:".red+" hooks depends on "+ ".package.json".yellow);
				done();
			});
		});

	});

});