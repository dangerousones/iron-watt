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
const downloadServer = require("./downloadServer"),
    fs = require('fs'),
    d = require("debug")("IronWatt:util:minecraft:downloadServerAuto")

module.exports = function (callback) {
    let jarName = `minecraft-server-${conf.minecraft.version}.jar`

    fs.stat(jarName, (err, stats) => {
        if (err && err.code === "ENOENT") {
            d(`Minecraft Server jar ${jarName} not found.`)
            downloadServer(jarName, callback)
        } else {
            if (typeof callback === 'function') callback(err)
        }
    })
}