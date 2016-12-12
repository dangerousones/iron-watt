/*******************************************************
 * Copyright (C) 2016 Kaiden Prince me@kaienprince.com
 *
 * This file is part of IronWatt.
 *
 * IronWatt can not be copied and/or distributed, in part
 * or in whole, without the express written permission of Kaiden Prince,
 * Unless otherwise specified in the License file, bundled with this
 * application
 *******************************************************/
"use strict";

const d = require("debug")("IronWatt:main"),
    fs = require('fs'),
    util = require("./src/util"),
    Minecraft = require("./src/proxy")

d("IronWatt Started")
d("Loading Config")
let mc;
require("./src/conf").readConf().on("load", () => {
    d("Config loaded!")
    if (conf.minecraft.autoDownload) {
        util.minecraft.downloadServerAuto(next)
    } else next()
    function next() {
        let jarName = conf.minecraft.getJarName()
        fs.stat(jarName, (err, stats) => {
            if (err && err.code === "ENOENT") {
                new Error(`Minecraft jar ${jarName} not found`)
            } else if (!err) {
                if (stats.isFile()) {
                    // All good, can now run
                    mc = new Minecraft()
                    d("starting Minecraft")
                    mc.start()
                } else {
                    throw new Error(`${jarName} is not a file`)
                }
            } else {
                throw err
            }
        })
    }
})

const readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function (line) {
    mc.writeLine(line)
})