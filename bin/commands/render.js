"use strict";

const debug = require("debug")("mdtk-cli/render");

exports.command = "render [input]";

exports.describe = "renders the given input markdown as HTML";

exports.builder = function (yargs) {
    yargs
        .option("output", {
            group: "Output",
            default: "-",
            normalize: true,
            description: "output html"
        })
        .option("packager", {
            group: "Output",
            default: "revealjs",
            description: "type of document"
        })
        .positional("input", {
            group: "Input",
            default: "-",
            type: "string",
            normalize: true,
            description: "input markdown"
        });
    return yargs;
};

exports.handler = async function (argv) {
    debug("%O", argv);

    const DependencyManager = require("../../src/dependencyManager");
    const deps = new DependencyManager();

    var {slurp} = require("../../src/utils");
    var markdown = await slurp(argv.input);

    const processor = require("../../src/processor")(argv, deps);
    const packager = require("../../src/packager");

    var html = await processor.render(markdown);
    var pkg = await packager.package(html, deps, argv || {});
    packager.write(pkg, argv);
};

