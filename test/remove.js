describe("hooks remove from local file", function() {

    var local_valid_module = "../test-valid";
    var local_valid_installed_name = "test-valid";

    describe("with", function() {
        beforeEach(function(done) {
            cleanUp(function() {
                setUp(function() {
                    run("mkdir .git && mkdir .git/hooks && hooks init && hooks install && hooks add " + local_valid_module, function(err, stdout, stderr) {
                        done(err);
                    });
                });
            });
        });

        describe("with no args", function() {
            it("on an installed module should work", function(done) {
                run("hooks remove " + local_valid_installed_name, function(err, stdout, stderr) {
                    stdout.should.include("Removeing");
                    stdout.should.include("hooks.json");
                    done(err);
                });
            });

            it("forgetting to supply the module should result in an error message", function(done) {
                run("hooks remove", function(err, stdout, stderr) {
                    stdout.should.include("must supply a module");
                    done(err);
                });
            });
        });

        describe("with the --all-hooks arg", function() {
            //* --all-hooks: remove the module from all git hooks
            it("should remove the hook from all locations", function(done) {
                run("hooks remove --all-hooks " + local_valid_installed_name, function(err, stdout, stderr) {
                    stdout.should.not.include("Unable to remove");
                    stdout.should.include("Removeing");
                    stdout.should.include("hooks.json");
                    done(err);
                });
            });
        });

        describe("with the --hard arg", function() {
            //* --hard: Also removes the module from the project's dependencies parameter.
            it("should remove the hook from the package.json", function(done) {
                run("hooks remove --hard " + local_valid_installed_name, function(err, stdout, stderr) {
                    stdout.should.include("devDependencies");
                    stdout.should.include("package.json");
                    done(err);
                });
            });
        });
    });

    describe("with the --hook arg", function() {
        //* --hook <GIT HOOK NAME>: remove module from specified git hook.
        it("should remove the hook if it exhists", function(done) {
            run("hooks add --hook post-commit " + local_valid_module, function(err) {
                if (err) {
                    done(err);
                } else {
                    run("hooks remove --hook post-commit " + local_valid_installed_name, function(err, stdout, stderr) {
                        stdout.should.include("Removeing");
                        stdout.should.include("hooks.json");
                        done(err);
                    });
                }
            });
        });

        it("should return hook not found if the hook's not found", function(done) {
            run("hooks remove --hook post-commit " + local_valid_installed_name, function(err, stdout, stderr) {
                stdout.should.include("Unable to remove");
                done(err);
            });
        });

    });

    after(function(done) {
        //tear folder down
        cleanUp(done);
    });

});