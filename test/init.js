describe("[hooks init]", function() {

    describe("adds node-hooks to the node_modules folder", function(){

        before(function(done){
            setUp(done);
        });

        it("and saves it to devDepencies", function(done){
            this.timeout(100000);
            var hookCommand = "HOOKS_TEST_INSTALL=test-npm-install node "+process.cwd()+"/bin/hooks.js init";

            var exec = require("child_process").exec;

            exec(hookCommand, function(err, stdout, stderr){
                stdout.should.include("Added to the devDependencies");
                done(err);
            });

        });

        it("and saves it to devDepencies", function(done){
            this.timeout(100000);
            var hookCommand = "HOOKS_TEST_INSTALL=test-npm-install node "+process.cwd()+"/bin/hooks.js init --soft";

            var exec = require("child_process").exec;

            exec(hookCommand, function(err, stdout, stderr){
                stdout.should.include("Added to node-modules, but not saved to the devDependencies");
                done(err);
            });

        });

    });

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
            this.timeout(10000);
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