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
const jsonFile = require('jsonfile'),
    d = require("debug")("IronWatt:conf"),
    EventEmitter = require('events').EventEmitter;

const Conf = require("./conf")

module.exports = new (class extends EventEmitter {
    readConf(fileName) {
        if (fileName === undefined) fileName = "IronWatt.json"
        jsonFile.readFile(fileName, function (err, obj) {
            if (err) {
                // If err is file not found, just load default config anyhow
                if (err.code === "ENOENT") {
                    obj = {};
                } else throw err
            }
            global.conf = new Conf(obj)
            this.emit("load")
        }.bind(this))
    }

    saveConf(fileName, config) {
        if (fileName === undefined) fileName = "IronWatt.json"

        config = config ? config : conf
        if (config === undefined) {
            throw new Error("config is undefined")
        }

        jsonFile.writeFile(fileName, conf, {spaces: 4}, function (err) {
            if (err) throw err
            this.emit("save")
        }.bind(this))
    }
})()
