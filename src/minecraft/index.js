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

const EventEmitter = require("events").EventEmitter,
    child_process = require("child_process"),
    path = require("path"),
    d = require("debug")("IronWatt:minecraft")

class Minecraft extends EventEmitter {
    constructor() {
        super()
        if (typeof conf === 'undefined') {
            require("../conf").readConf()
        }
    }

    start() {
        process.on('exit', this.stop)
        process.on('SIGINT', this.stop)
        process.on('SIGTERM', this.stop)

        d("running jar")
        this.mc = child_process.execFile(
            path.join(process.env.JAVA_HOME, "bin", "java"),
            ["-jar", conf.minecraft.getJarName(),
                "nogui"
            ]
        )
        this.mc.stdin.setEncoding('utf8')
        this.mc.stdout.setEncoding('utf8')
        this.mc.stderr.setEncoding('utf8')
        this.mc.stdout.on('data', onStdout.bind(this))
        this.mc.stderr.on('data', onStderr.bind(this))

        let bufStdout = ""

        function onStdout(data) {
            bufStdout += data
            const lines = bufStdout.split('\n')
            for (let i = 0; i < lines.length - 1; i++) {
                d(lines[i])
                this.emit('data', lines[i])
            }
            bufStdout = lines[lines.length - 1]
        }

        let bufStderr = ""

        function onStderr(data) {
            bufStderr += data
            const lines = bufStdout.split('\n')
            for (let i = 0; i < lines.length - 1; i++) {
                console.error(new Date() + ": " + lines[i])
            }
            bufStdout = lines[lines.length - 1]
        }
    }

    stop(force, waitTime, callback) {
        d('killing child processes');
        if (typeof this.mc !== "undefined") {
            if (!force && typeof this.mc.stdin.write === 'function') {
                this.mc.stdin.write("stop\n")
                let TO = setTimeout(function () {
                    this.mc.kill()
                    if (typeof callback === 'function') callback()
                }.bind(this), typeof waitTime === 'number' ? waitTime : 60000)
                this.mc.on("close", () => {
                    clearTimeout(TO)
                    if (typeof callback === 'function') callback()
                })
            } else {
                this.mc.kill()
                if (typeof callback === 'function') callback()
            }
        }
    }

    restart(force, waitTime, callback) {
        this.stop(false, waitTime, () => {
            this.start()
            if (typeof callback === 'function') callback()
        })
    }


}

module.exports = Minecraft