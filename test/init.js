describe.only("[hooks init]", function() {
    describe("won't run without a", function() {

        before(function(done) {
            setUp(done);
        });

        it(".git folder", function(done) {
            run("hooks init", function(err, stdout, stderr) {
                stdout.should.not.include("HELP");
                err.should.have.property("code", 1);
                stdout.should.include("ERROR:".red + " hooks depends on " + "git".yellow);
                done();
            });
        });

        it(".git/hooks folder", function(done) {
            run("hooks init", function(err, stdout, stderr) {
                stdout.should.not.include("HELP");
                err.should.have.property("code", 1);
                stdout.should.include("ERROR:".red + " hooks depends on " + "git".yellow);
                done();
            });
        });

        after(function(done) {
            cleanUp(done);
        });
    });

    describe("--bare", function() {

        before(function(done) {
            setUp(done);
        });

        it("won't install without a hooks folder", function(done) {
            run("hooks init --bare", function(err, stdout, stderr) {
                stdout.should.not.include("HELP");
                err.should.have.property("code", 1);
                stdout.should.include("ERROR:".red + " hooks depends on " + "git".yellow);
                stdout.should.include("git init --bare");
                done();
            });
        });

        it("will install without a .git folder", function(done) {
            run("mkdir ./hooks", function(err) {
                if (err) {
                    done(err);
                } else {
                    run("hooks init --bare", function(err, stdout, stderr) {
                        stdout.should.not.include("HELP");
                        stdout.should.not.include("ERROR:".red + " hooks depends on " + "git".yellow);
                        done(err);
                    });
                }
            });
        });

        after(function(done) {
            cleanUp(done);
        });
    });
});