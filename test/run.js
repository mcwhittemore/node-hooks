describe("[hooks run]", function() {

    var local_valid_module = "../test-valid";

    describe("if hooks.json file", function() {

        beforeEach(function(done) {
            this.timeout = 100000;
            cleanUp(function() {
                setUp(function() {
                    run("git init && hooks init && hooks install && hooks install --soft --hook pre-commit " + local_valid_module, function(err) {
                        done(err);
                    });
                });
            });
        });

        var fs = require("fs");


        it("is missing, this should exit nicely", function(done) {
            var hooksJsonPath = test_folder + "/hooks.json";
            run("rm hooks.json && hooks run pre-commit", function(err, stdout, stderr) {
                stdout.should.include("Has hooks been merged into this branch?");
                fs.existsSync(hooksJsonPath).should.not.be.ok;
                done(err);
            });
        });

        it("exhists, this should continue", function(done) {
            var hooksJsonPath = test_folder + "/hooks.json";
            run("hooks run pre-commit", function(err, stdout, stderr) {
                stdout.should.include("this is a test");
                stdout.should.include("pre-commit");
                fs.existsSync(hooksJsonPath).should.be.ok;
                done(err);
            });
        });

    });

    describe("should", function() {
        var hooks = require("../lib/possible-hooks");

        before(function(done) {
            this.timeout = 100000;
            cleanUp(function() {
                setUp(function() {
                    run("git init && hooks init && hooks install", function(err) {
                        done(err);
                    });
                });
            });
        });

        describe("work for", function() {
            var hookTest = function(hook, done) {
                run("hooks install --soft --hook " + hook + " " + local_valid_module, function(err, stdout, stderr) {
                    if (err) {
                        done(err);
                    } else {
                        run("hooks run " + hook, function(err, stdout, stderr) {
                            stdout.should.include("this is a test");
                            stdout.should.include(hook);
                            done(err);
                        });
                    }
                });
            }

            it("applypatch-msg", function(done) {
                hookTest("applypatch-msg", done)
            });
            it("pre-applypatch", function(done) {
                hookTest("pre-applypatch", done)
            });
            it("post-applypatch", function(done) {
                hookTest("post-applypatch", done)
            });
            it("pre-commit", function(done) {
                hookTest("pre-commit", done)
            });
            it("prepare-commit-msg", function(done) {
                hookTest("prepare-commit-msg", done)
            });
            it("commit-msg", function(done) {
                hookTest("commit-msg", done)
            });
            it("post-commit", function(done) {
                hookTest("post-commit", done)
            });
            it("pre-rebase", function(done) {
                hookTest("pre-rebase", done)
            });
            it("post-checkout", function(done) {
                hookTest("post-checkout", done)
            });
            it("post-merge", function(done) {
                hookTest("post-merge", done)
            });
            it("pre-receive", function(done) {
                hookTest("pre-receive", done)
            });
            it("update", function(done) {
                hookTest("update", done)
            });
            it("post-receive", function(done) {
                hookTest("post-receive", done)
            });
            it("post-update", function(done) {
                hookTest("post-update", done)
            });
            it("pre-auto-gc", function(done) {
                hookTest("pre-auto-gc", done)
            });
            it("post-rewrite", function(done) {
                hookTest("post-rewrite", done)
            });
        });

        describe("not work for invalid hooks", function() {
            var invalid = hooks.join("");
            it("like " + invalid, function(done) {
                run("hooks install --soft --hook post-rewrite " + local_valid_module, function(err, stdout, stderr) {
                    if (err) {
                        console.log("here?");
                        done(err);
                    } else {
                        run("hooks run " + invalid, function(err, stdout, stderr) {
                            stderr.should.include("is not a valid git-hook");
                            done();
                        });
                    }
                });
            });
        });

        after(function(done) {
            cleanUp(done);
        });
    });

});