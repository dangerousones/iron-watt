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
module.exports = function (uri, callback) {
    let http
    if (uri.match(/^https:\/\//)) {
        http = require("https")
    } else {
        http = require("http")
    }
    http.get(uri, function (res) {
        let error;
        if (res.statusCode !== 200) {
            error = new Error(`Request Failed. Status Code: ${res.statusCode}`);
        }
        if (error) {
            // consume response data to free up memory
            res.resume();
            callback(error)
            return;
        }

        // Decode It!
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => rawData += chunk)
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData)
                if (callback) callback(error, parsedData)
            } catch (e) {
                throw e
            }
        })
    })
}