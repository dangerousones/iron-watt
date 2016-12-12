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
"use strict"

const EventEmitter = require("events").EventEmitter,
    d = require("debug")("IronWatt:proxy"),
    MCp = require('minecraft-protocol'),
    states = MCp.states

const util = require("../util"),
    Minecraft = require("../minecraft")

class Proxy extends Minecraft {
    constructor() {
        super()
        if (typeof conf === 'undefined') {
            require("../conf").readConf()
        }
    }

    start() {
        super.start()
        process.on('exit', () => {
            this.stop(false, undefined, process.exit)
        })
        process.on('SIGINT', () => {
            this.stop(false, undefined, process.exit)
        })
        process.on('SIGTERM', () => {
            this.stop(false, undefined, process.exit)
        })

        d("Starting proxy...")
        this.srv = MCp.createServer(conf.minecraft.options.proxy)
        this.srv.on('login', function (client) {
            let addr = client.socket.remoteAddress
            d('Incoming connection from:', addr)
            let endedClient = false
            let endedTargetClient = false
            client.on('end', function () {
                endedClient = true
                d('Connection closed by client:', addr)
                if (!endedTargetClient)
                    targetClient.end("End")
            })
            client.on('error', function (err) {
                endedClient = true
                d('Connection error by client:', addr)
                d(err.stack)
                if (!endedTargetClient)
                    targetClient.end("Error")
            })
            let targetClient = MCp.createClient({
                host: "127.0.0.1",
                port: conf.minecraft.options.server["server-port"] || 25566,
                username: client.username,
                keepAlive: false,
                version: conf.minecraft.options.proxy.version
            })
            client.on('packet', function (data, meta) {
                if (targetClient.state === states.PLAY && meta.state === states.PLAY) {
                    if (!endedTargetClient)
                        targetClient.write(meta.name, data)
                }
            })
            targetClient.on('packet', function (data, meta) {
                if (meta.state === states.PLAY && client.state === states.PLAY) {
                    if (!endedClient) {
                        client.write(meta.name, data)
                        if (meta.name === 'set_compression') {
                            client.compressionThreshold = data.threshold
                        }
                    }
                }
            })
            let bufferEqual = require('buffer-equal')
            targetClient.on('raw', function (buffer, meta) {
                if (client.state !== states.PLAY || meta.state !== states.PLAY)
                    return
                let packetData = targetClient.deserializer.parsePacketBuffer(buffer).data.params
                let packetBuff = client.serializer.createPacketBuffer({name: meta.name, params: packetData})
                if (!bufferEqual(buffer, packetBuff)) {
                    d("client<-server: Error in packet " + meta.state + "." + meta.name)
                    d("received buffer", buffer.toString('hex'))
                    d("produced buffer", packetBuff.toString('hex'))
                    d("received length", buffer.length)
                    d("produced length", packetBuff.length)
                }
            })
            client.on('raw', function (buffer, meta) {
                if (meta.state !== states.PLAY || targetClient.state !== states.PLAY)
                    return
                let packetData = client.deserializer.parsePacketBuffer(buffer).data.params
                let packetBuff = targetClient.serializer.createPacketBuffer({name: meta.name, params: packetData})
                if (!bufferEqual(buffer, packetBuff)) {
                    d("client->server: Error in packet " + meta.state + "." + meta.name)
                    d("received buffer", buffer.toString('hex'))
                    d("produced buffer", packetBuff.toString('hex'))
                    d("received length", buffer.length)
                    d("produced length", packetBuff.length)
                }
            })
            targetClient.on('end', function () {
                endedTargetClient = true
                d('Connection closed by server', '(' + addr + ')')
                if (!endedClient)
                    client.end("End")
            })
            targetClient.on('error', function (err) {
                endedTargetClient = true
                d('Connection error by server', '(' + addr + ') ', err)
                d(err.stack)
                if (!endedClient)
                    client.end("Error")
            })
        })
    }

    stop(force, waitTime, callback) {
        if (typeof this.srv !== 'undefined' && typeof this.srv.close === 'function') this.srv.close()
        super.stop(force, waitTime, function () {
            if (typeof callback === 'function') callback()
        })
    }
}

module.exports = Proxy