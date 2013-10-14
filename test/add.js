describe("[hooks install hook-module]", function() {

    var local_valid_module = "../test-valid";
    var local_invalid_module = "../test-invalid";
    var npm_invalid_module = "test-npm-install";
    var github_invalid_module = "https://github.com/mcwhittemore/test-npm-install/tarball/master";

    describe("to local folder", function() {

        beforeEach(function(done) {
            //reset the folder to empty
            cleanUp(function() {
                setUp(function() {
                    run("mkdir .git && mkdir .git/hooks && hooks init && hooks install", function(err, stdout, stderr) {
                        done(err);
                    });
                });
            });
        });

        describe("with no args", function() {
            it("should work for a local valid module using hooks add", function(done) {
                this.timeout = 10000;
                run("hooks add " + local_valid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    done(err);
                });
            });
            it("should work for a local valid module", function(done) {
                this.timeout = 10000;
                run("hooks install " + local_valid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    done(err);
                });
            });
            it("should fail for a local invalid module", function(done) {
                run("hooks install " + local_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("use the `-f` option.");
                    done(err);
                });
            });
            it("should fail for a npm invalid module", function(done) {
                run("hooks install " + npm_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("use the `-f` option.");
                    done(err);
                });
            });
            it("should fail for a github invalid module", function(done) {
                this.timeout = 10000;
                run("hooks install " + github_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("use the `-f` option.");
                    done(err);
                });
            });
        })

        describe("to specified hook via", function() {
            // * --hook <GIT HOOK NAME>: this option overrides the hook-module's default-hook parameter.
            it("--hook should work", function(done) {
                this.timeout = 5000;
                run("hooks install --hook update " + local_valid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    var hooksJson = readJson(test_folder + "/hooks.json");
                    hooksJson.should.have.property("update");
                    hooksJson.update.should.have.property("test-valid", "../test-valid");
                    done(err);
                });
            });
        });

        describe("forced via", function() {
            // * -f, --force: installs a module from npm even if it doesn't meet the `hooks-module specification`. Requires the --hook option
            it("-f should work for a npm invalid module", function(done) {
                run("hooks install -f --hook update " + local_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    done(err);
                });
            });
            it("--force should work for a github invalid module", function(done) {
                run("hooks install --force --hook update " + local_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    done(err);
                });
            });
        });

        describe("and include the module in package.json devDependencies", function() {
            // * --depend: adds the module to the project's package.json devDependencies parameter.
            it("always", function(done) {
                this.timeout = 5000;
                run("hooks install " + local_valid_module, function(err) {
                    var json = readJson(test_folder + "/package.json");
                    json.should.have.property("devDependencies");
                    json.devDependencies.should.have.property("test-valid", "../test-valid");
                    done(err);
                });
            });
        });

        describe("and include the module in hooks.json file for the right hook", function() {
            it("when coming from NPM", function(done) {
                run("hooks install -f --hook update " + npm_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    var hooksJson = readJson(test_folder + "/hooks.json");
                    hooksJson.update.should.have.property("test-npm-install", "0.0.0");
                    done(err);
                });
            });
            it("when coming from remote url", function(done) {
                run("hooks install -f --hook update " + github_invalid_module, function(err, stdout, stderr) {
                    stdout.should.include("COMPLETE");
                    var hooksJson = readJson(test_folder + "/hooks.json");
                    hooksJson.update.should.have.property("test-npm-install", github_invalid_module);
                    done(err);
                });
            });
        });

        after(function(done) {
            //tear folder down
            cleanUp(done);
        });
    })


});