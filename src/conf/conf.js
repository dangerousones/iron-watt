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

module.exports = class Conf {
    constructor(conf) {
        const defaultConf = {
            "minecraft": {
                // See https://launchermeta.mojang.com/mc/game/version_manifest.json for valid id's
                "version": "1.11",

                // Auto download Minecraft jar if non-exist?
                "autoDownload": true,
                "getJarName": function () {
                    return `minecraft-server-${defaultConf.minecraft.version}.jar`
                },

                "options": {
                    server: {
                        "gamemode": 1,
                        "enable-command-block": true,
                        "max-players": 100,
                        "server-port": 25566,
                        "server-ip": "127.0.0.1",
                        "online-mode": false
                    },
                    proxy: {
                        "port": 25565,
                        "ip": "0.0.0.0",
                        "online-mode": false,
                        version: "1.11"
                    }
                },
            }
        }

        function merge(objArr) {
            let result = {};
            objArr.forEach((obj) => {
                if (typeof obj !== "undefined") {
                    Object.keys(obj).forEach((key) => {
                        if (typeof obj[key] === 'object') {
                            result[key] = merge([result[key], obj[key]])
                        } else {
                            result[key] = obj[key]
                        }
                    })
                }
            })
            return result
        }

        Object.assign(this, merge([defaultConf, conf]))
    }
}