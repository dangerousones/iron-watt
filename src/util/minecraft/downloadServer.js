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
const httpJSON = require("../httpJSON"),
    https = require("https"),
    fs = require('fs'),
    crypto = require("crypto"),
    d = require("debug")("IronWatt:util:minecraft:downloadServer")

module.exports = function (jarName, callback) {
    const launchermeta = "https://launchermeta.mojang.com/mc/game/version_manifest.json"

    d(`downloading and parsing launchermeta`)
    httpJSON(launchermeta, (err, launchermetaData) => {
        if (err) throw err
        if (launchermetaData && launchermetaData.versions) {
            httpJSON(launchermetaData.versions[launchermetaData.versions.findIndex(ver => ver.id === conf.minecraft.version)].url, (err, mcFiles) => {
                if (err) throw err
                if (mcFiles && mcFiles.downloads && mcFiles.downloads.server && mcFiles.downloads.server.url) {
                    d("download and parse complete. Will download jar now.")
                    https.get(mcFiles.downloads.server.url, function (res) {
                        let error;
                        if (res.statusCode !== 200) {
                            error = new Error(`Request for server.jar Failed. Status Code: ${res.statusCode}`);
                        }
                        if (error) {
                            // consume response data to free up memory
                            res.resume();
                            throw error
                            return;
                        }
                        let mcjar = fs.createWriteStream(jarName);
                        res.pipe(mcjar)
                        res.on('end', () => {
                            mcjar.close();
                            d(`Download complete. Will Now check hash...`)

                            mcjar = fs.createReadStream(jarName);
                            let hash = crypto.createHash('sha1');
                            hash.setEncoding('hex');

                            mcjar.on('end', function () {
                                hash.end();
                                if (hash.read() === mcFiles.downloads.server.sha1) {
                                    d(`Hash matches ${mcFiles.downloads.server.sha1}`)
                                } else {
                                    d(`Hash mismatch: ${mcFiles.downloads.server.sha1}`)
                                    process.exit(1)
                                }
                            });
                            mcjar.pipe(hash);
                        })
                    })
                }
            })
        }
    })
}