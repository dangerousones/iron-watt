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
    util = require("./src/util")

d("IronWatt Started")
d("Loading Config")
require("./src/conf").readConf().on("load", () => {
    d("Config loaded!")
    util.minecraft.downloadServerAuto()
})