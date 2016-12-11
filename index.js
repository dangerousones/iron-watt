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
        util.minecraft.downloadServerAuto()
    }
    let jarName = conf.minecraft.getJarName()
    fs.stat(jarName, (err, stats) => {
        if (err && err.code === "ENOENT") {
            d(`Minecraft Server jar ${jarName} not found. Will Download now.`)
            downloadServer(jarName, callback)
        } else if (!err) {
            if (stats.isFile()) {
                // All good, can now run
                mc = new Minecraft()
                d("starting Minecraft")
                mc.start()
                // setTimeout(()=>{mc.stop()},5000)
            } else {
                throw new Error(`${jarName} is not a file`)
            }
        } else {
            throw err
        }
    })

})