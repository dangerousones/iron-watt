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

const fs = require('fs'),
    http = require('http'),
    https = require('https'),
    path = require("path"),
    d = require("debug")("IronWatt:main"),
    crypto = require('crypto')
let options = {};

fs.readdir(process.cwd(), (err, files) => {
    //If config Exists, load it.
    if (files.indexOf("IronWatt.json") !== -1) {
        options = require(path.join(process.cwd(), "IronWatt"))
    }

    // Set default options
    options = Object.assign({
        "minecraft": {
            // See https://launchermeta.mojang.com/mc/game/version_manifest.json for valid id's
            "version": "1.11"
        }
    }, options)

    let jarName=`minecraft-server-${options.minecraft.version}.jar`
    // if server jar neaded exists, don't download it
    if (files.indexOf(jarName) === -1) {
        d(`Minecraft Server jar ${jarName} not found.`)
        https.get("https://launchermeta.mojang.com/mc/game/version_manifest.json", function (res) {
            let error;
            if (res.statusCode !== 200) {
                error = new Error(`Request for version_manifest Failed. Status Code: ${res.statusCode}`);
            }
            if (error) {
                d(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }

            // Decode It!
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    parsedData.versions.forEach((ver) => {
                        if (ver.id === options.minecraft.version) {
                            https.get(ver.url, function (res) {
                                let error;
                                if (res.statusCode !== 200) {
                                    error = new Error(`Request for ${options.minecraft.version}.json Status Code: ${res.statusCode}`);
                                }
                                if (error) {
                                    d(error.message);
                                    // consume response data to free up memory
                                    res.resume();
                                    return;
                                }

                                // Decode It!
                                res.setEncoding('utf8');
                                let rawData = '';
                                res.on('data', (chunk) => rawData += chunk);
                                res.on('end', () => {
                                    try {
                                        let json = JSON.parse(rawData);
                                        d(`Starting ${jarName} download.`)
                                        https.get(json.downloads.server.url, function (res) {
                                            let error;
                                            if (res.statusCode !== 200) {
                                                error = new Error(`Request for server.jar Failed. Status Code: ${res.statusCode}`);
                                            }
                                            if (error) {
                                                d(error.message);
                                                // consume response data to free up memory
                                                res.resume();
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
                                                    if (hash.read() === json.downloads.server.sha1) {
                                                        d(`Hash matches ${json.downloads.server.sha1}`)
                                                    } else {
                                                        d(`Hash mismatch: ${json.downloads.server.sha1}`)
                                                        process.exit(1)
                                                    }
                                                });
                                                mcjar.pipe(hash);
                                            })
                                        })
                                    } catch (e) {
                                        d(e.message);
                                    }
                                })
                            })
                        }
                    })
                } catch (e) {
                    d(e.message);
                }
            });
        });
    }
})