// jaa et kiinnosta langennutta?
var fs = require("fs")
eval(fs.readFileSync("./lib/threeHeader.js").toString())
var THREE = require("./lib/three.js")
eval(fs.readFileSync("./lib/additionalRenderers.js").toString())
eval(fs.readFileSync("./lib/SceneUtils.js").toString())
eval(fs.readFileSync("./util.js").toString())
const camelCase = require('camelcase');

const express = require('express')
var path = require("path")
//var nwm = require("./nwm")(avros)
// localhost:9000
var avros = require("./class/avros.js")(THREE)

avros.open(9099)
avros.showLog = false
clockFrequency = 200


avros.app.use(express.static('./public'))


avros.io.on('connection', function(socket) {
    socket.on('app info request', function() {
        console.log("app info request")
        avros.io.sockets.emit("app info callback",
        {
            "name" : "Hangout",
            "icon" : fs.readFileSync('./icon.png', 'base64')
        })
    })

})


class BaseClass {
    constructor() {
        this.module = []
        this.initModules()

        var self = this

        avros.on("connected", function(data) {
            data.socket.emit("tts", {"say": "Connected"})
            self.collectiveCall("playerAwake", data.socket)
        })
        avros.on("player entered", function(name) {
            self.collectiveCall("playerEnter", avros.getPlayerSocket(name))
        })
    }

    hasComponent(component) {
        for (var i = 0; i < Object.keys(this.module).length; i ++) {

            if (Object.keys(this.module)[i] == component) {
                return true
            }
        }
        return false
    }

    initModules() {
        var self = this;
        var files = fs.readdirSync("./module").sort()
        for (var i = 0; i < files.length; i ++) {
            var module = files[i].substr(0, files[i].length-3)
            var moduleClass = eval("("+fs.readFileSync("./module/"+files[i]).toString('utf-8')+")")
            var moduleName = camelCase(module, {pascalCase: true});

            this.module[moduleName] = new moduleClass();

            eval("var "+moduleName+ " = self.module['"+moduleName+"']")

            //this.modules[module] = eval("new "+camelCase(module, {pascalCase: true})+"()")
        }


        // requires
        for (var i = 0; i < Object.keys(this.module).length; i ++) {
            var module = this.module[Object.keys(this.module)[i]]

            if (typeof module.init === "function") {
                module.init()
            }
        }

        for (var i = 0; i < Object.keys(this.module).length; i ++) {
            var module = this.module[Object.keys(this.module)[i]]
            if (typeof module.requires !== "undefined") {
                for (var i2 = 0; i2 < module.requires.length; i2 ++) {
                    if (typeof this.module[module.requires[i2]] === "undefined") {
                        console.warn(Object.keys(this.module)[i] + " needs "+ module.requires[i2])
                    }
                }
            }
        }



        this.updateInterval = setInterval(function() { self.update() }, 1000)
    }

    update() {
        for (var i = 0; i < Object.keys(this.module).length; i ++) {
            var module = this.module[Object.keys(this.module)[i]]
            if (typeof module.update === "function") {
                if (!isVoid(module.enabled)) {
                    if (module.enabled) {
                        module.update()
                    }
                } else {
                    module.update()
                }
            }
        }
    }

    collectiveCall(func, params) {
        for (var i = 0; i < Object.keys(this.module).length; i ++) {
            var module = this.module[Object.keys(this.module)[i]]
            if (typeof module[func] === "function") {
                if (!isVoid(module.enabled)) {
                    if (module.enabled) {
                        module[func](params)
                    }
                } else {
                    module[func](params)
                }
            }
        }
    }
}

var base = new BaseClass();
