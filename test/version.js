describe("hooks --version", function(){

	before(function(done){
		setUp(done);
	});

	it("should print the current version", function(done){
		run("hooks --version", function(err, stdout){
			if(!err){
				var version = require("../commands/version")(false);
				stdout.trim().should.equal(version);
			}
			done(err);
		});
	});

	after(function(done){
		cleanUp(done);
	});
})