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
        Object.assign(this, {
            "minecraft": {
                // See https://launchermeta.mojang.com/mc/game/version_manifest.json for valid id's
                "version": "1.11",

                // Auto download Minecraft jar if non-exist?
                "autoDownload": true,
            }
        }, conf)
        this.minecraft.getJarName = function () {
            return `minecraft-server-${conf.minecraft.version}.jar`
        }
    }
}