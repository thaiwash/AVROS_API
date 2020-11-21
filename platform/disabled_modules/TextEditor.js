/* todo fix eof tilde confusion */
var socket = require('socket.io-client')('http://51.38.185.65:9774');
var fs = require("fs")

var appId  = 667
socket.on('connect', function(){});
socket.on('disconnect', function(){});



socket.on('welcome', function(){
    console.log("got connection")
    socket.emit("spirit entering matrix", {"user_id": appId});
})

var cube = {
    "_id": "5af671c986b4093a03472688",
    "object_id": "82688",
    "type": "cube",
    "posX": "-0.1153316",
    "posY": "-0.01580912",
    "posZ": "-0.1566545",
    "rotW": "-0.2689151",
    "rotX": "-0.2196632",
    "rotY": "0.8342858",
    "rotZ": "-0.4282523",
    "scaleX": "0.2000001",
    "scaleY": "0.2000001",
    "user_id": "7707"
}

var backPlane = {
    "_id": "5af671c986b4093a03472689",
    "object_id": "82698",
    "type": "plane",
    "parent": "82688",
    "posX": "0",
    "posY": "0",
    "posZ": "0.6",
    "rotW": "0.7071068",
    "rotX": "0.7071068",
    "rotY": "0",
    "rotZ": "0",
    "scaleX": "0.1",
    "scaleY": "0.1",
    "scaleZ": "0.1",
    "user_id": "7707"
}

var frontPlane = {
    "object_id": "82708",
    "type": "plane",
    "parent": "82688",
    "posX": "0",
    "posY": "0",
    "posZ": "-0.6",
    "rotW": "-3.090862E-08",
    "rotX": "-3.090862E-08",
    "rotY": "-0.7071068",
    "rotZ": "0.7071068",
    "scaleX": "0.1",
    "scaleY": "0.1",
    "scaleZ": "0.1",
    "user_id": "7707"
}

socket.on("spirit entered", function (data) {
    //console.log(data)
})
/*
var lastTime = 0;
function createTexture() {
var time = (new Date()).getTime();

ctx.font = '12px Impact';
ctx.fillStyle="#000000";
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="#FF0000";
ctx.fillText("TimeNow  "+(time -lastTime), 50, 50);

var te = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,255,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + te.width, 102);
ctx.stroke();
lastTime = time;
return canvas.toDataURL().substr("data:image/png;base64,".length);
}
*/


function sendObjectData(socket) {
    socket.emit("object created", cube)
    socket.emit("object created", frontPlane)
    socket.emit("object created", backPlane)

    socket.emit("texture update", {
        "object_id": frontPlane.object_id,
        "texture": createTexture()
    })
    socket.emit("texture update", {
        "object_id": backPlane.object_id,
        "texture": createTexture()
    })
}

socket.on("load matrix", function (data) {
    //console.log(data)
    var goLoaded = false;
    for (var i = 0; i < data.objects.length; i++) {
        if (data.objects[i].object_id == cube.object_id) {
            goLoaded = true;
        }
    }
    if (!goLoaded) {
        sendObjectData(socket)
    }
})

/*
socket.on("texture update complete", function(data) {
if (data.object_id == frontPlane.object_id) {
}
})
*/

socket.on("controller event", function(data) {
    textEditor.controllerEvent(data)
})

/*
socket.emit("texture update", {
"object_id": frontPlane.object_id,
"texture": createTexture()
})*/


class AVROSE {
    constructor() {
        // default configurations
        var self = this
        this.socket_url = "http://51.38.185.65:9774"
        this.appId = 667

        init()
        registerEvents()
    }


    init() {
        this.socket = require('socket.io-client')(socket_url)
        var Canvas = require('canvas')
        this.canvas = new Canvas(100, 100)
        this.ctx = canvas.getContext('2d')
    }

    registerEvents() {
        socket.on('connect', function(){});
        socket.on('disconnect', function(){});

        socket.on('welcome', function(){
            console.log("got connection")
            socket.emit("spirit entering matrix", {"user_id": this.appId});
        })

        socket.on("load matrix", function (data) {
            // check if we need to create it to the server
            var goLoaded = false;
            for (var i = 0; i < data.objects.length; i++) {
                if (data.objects[i].object_id == cube.object_id) {
                    goLoaded = true;
                }
            }
            if (!goLoaded) {
                sendObjectData(socket)
            }
        })
    }


    get GO() {
        return {
            "cube": {
                "_id": "5af671c986b4093a03472688",
                "object_id": "82688",
                "type": "cube",
                "posX": "-0.1153316",
                "posY": "-0.01580912",
                "posZ": "-0.1566545",
                "rotW": "-0.2689151",
                "rotX": "-0.2196632",
                "rotY": "0.8342858",
                "rotZ": "-0.4282523",
                "scaleX": "0.2000001",
                "scaleY": "0.2000001",
                "user_id": "7707"
            },
            "backPlane": {
                "_id": "5af671c986b4093a03472689",
                "object_id": "82698",
                "type": "plane",
                "parent": "82688",
                "posX": "0",
                "posY": "0",
                "posZ": "0.6",
                "rotW": "0.7071068",
                "rotX": "0.7071068",
                "rotY": "0",
                "rotZ": "0",
                "scaleX": "0.1",
                "scaleY": "0.1",
                "scaleZ": "0.1",
                "user_id": "7707"
            },
            "frontPlane": {
                "object_id": "82708",
                "type": "plane",
                "parent": "82688",
                "posX": "0",
                "posY": "0",
                "posZ": "-0.6",
                "rotW": "-3.090862E-08",
                "rotX": "-3.090862E-08",
                "rotY": "-0.7071068",
                "rotZ": "0.7071068",
                "scaleX": "0.1",
                "scaleY": "0.1",
                "scaleZ": "0.1",
                "user_id": "7707"
            }
        }
    }
}




class TextEditor {
    constructor(socket, objectId) {
        var self = this
        this.chars = []
        this._text = ""
        this.tildeAt = 0

        this.bgColor = '#282c34'
        this.textColor = '#f00'
        this.tildeColor = '#0000ff'
        this.selectColor = '#ffffff'

        this.width = 500
        this.height = 500
        this.padding = 10

        this.textSize = 12

        var Canvas = require('canvas')
        this.canvas = new Canvas(this.width, this.height)
        this.ctx = this.canvas.getContext('2d')

        this.ctx.font = this.textSize+"pt Courier"

        this.socket = socket
        this.objectId = objectId
        this.tildeStart()

        this.mouseDown = [false, false]
        this.selectStart = 0
        this.selectEnd = 0
    }

    tildeStart() {
        var self = this
        this.showTilde = true
        this.tildeBlinkTimer = setInterval(function () {
            self.showTilde = !self.showTilde
            self.update()
        }, 500)
    }

    update() {
        this.draw()
        //console.log("here")
        this.socket.emit("texture update", {
            "object_id": this.objectId,
            "texture": this.getTexture()
        })
    }



        set text(text) {
            text = text.toString();
            //text = text.replace(/\r\n/g, "\n");
            this._text = text + "\n";
        }

        get text() {
            return this._text
        }

    draw() {
        // clear
        function clear (self) {
            self.ctx.fillStyle = self.bgColor
            self.ctx.fillRect(0, 0, self.width, self.height)
        }
        clear(this)

        var x = this.padding
        var y = this.padding

        var col = 1
        var row = 1

        var selected = false

        this.ctx.fillStyle = this.textColor
        var backgroundHeight = this.textSize +
        Math.round(this.textSize/2)

        this.chars = []
        var __text = ""

        var cnt = 0
        for (var i = 0; i < this._text.length; i ++) {
            // banned char
            if (this._text.charCodeAt(i) == 13) {
                continue
            }
            cnt += 1
            var char = this._text.charAt(i);
            var charWidth = this.ctx.measureText(char).width;

            if (char == "\n") {
                charWidth = this.width - x
            }

            if (Math.abs(this.selectStart-this.selectEnd) > 0) {
                this.ctx.fillStyle = this.selectColor
                var start = 0
                var length = Math.abs(this.selectStart-this.selectEnd)
                if (this.selectStart < this.selectEnd) {
                    start = this.selectStart
                } else {
                    start = this.selectEnd
                }
                this.tildeAt = start
                if (cnt >= start && cnt < (start + length)) {
                    this.ctx.fillRect(
                        x, y, charWidth, backgroundHeight
                    )
                    selected = true
                } else {
                    selected = false
                }
                this.ctx.fillStyle = this.textColor
            }

            if (this.showTilde && this.tildeAt == cnt && !selected) {
                this.drawTilde(x, this.padding + (backgroundHeight * (row - 1)), backgroundHeight)
            }



            if (char != "\n") {
                this.ctx.fillText(
                    char,
                    x,
                    y + this.textSize + Math.round(this.textSize / 6)
                )
            }


            this.chars.push({
                "char": char,
                "x": x,
                "y": y,
                "w": charWidth,
                "h": backgroundHeight,
                "col": col,
                "row": row,
                "selected": selected
            })
            x += charWidth
            col ++
            if (char == "\n") {
                x = this.padding
                y += backgroundHeight
                row ++
                col = 1
            }

            __text += char
        }
        this._text = __text
    }

    drawTilde(x, y, lineHeight) {
        var lineWidth = 2
        this.ctx.strokeStyle = this.tildeColor
        this.ctx.lineWidth = lineWidth
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x, y + lineHeight)
        this.ctx.stroke()
    }

    getTexture() {
        return this.canvas.toDataURL().substr("data:image/png;base64,".length);
    }

    clipboardTransferComplete(data) {
        console.log(data)
        var self = this;
        self.insertText(data.content, self.tildeAt)
        self.tildeAt += data.content.length
    }

    controllerEvent(evt) {
        var self = this
        console.log(evt)
        var x = evt.x * this.width
        var y = (1 - evt.y) * this.height
        if (evt.type == "ButtonDown") {
            if (evt.button == "R_TRIGGER" || evt.button == "L_TRIGGER") {
                var lastTildeAt = this.tildeAt
                this.tildeAt = this.mouseAction(x, y)
                if (this.tildeAt != lastTildeAt) {
                    this.update()
                }
                this.tildeAt = this.mouseAction(x, y)
                this.mouseDown[parseInt(evt.right_or_left)] = true
                this.selectedText().null()
                this.selectStart = this.mouseAction(x, y)
                this.selectEnd = this.mouseAction(x, y)
                //console.log("bd")
                //console.log(this.selectStart)
                //console.log(this.selectEnd)
                this.socket.emit("tts", {"say": "hello", "user_id": evt.user_id})
            }
            if (evt.button == "A") {
                socket.off("transfer clipboard");
                socket.on("transfer clipboard", function(data) {
                    self.clipboardTransferComplete(data)
                });
                console.log("getter "+ appId)
                socket.emit("get clipboard", {
                    "user_id": evt.user_id,
                    "getter": ""+appId
                })
            }
            if (evt.button == "B") {
                console.log("copied "+ this.selectedText().text)
                socket.emit("set clipboard", {"user_id": evt.user_id, "content": this.selectedText().text})
                this.selectedText().delete()
            }
        }
        if (this.mouseDown[parseInt(evt.right_or_left)]) {
            if (evt.type == "Raycast") {
                var lastSelectEnd = this.selectEnd
                this.selectEnd = this.mouseAction(x, y)
                if (this.selectEnd != lastSelectEnd) {
                    //console.log("rc")
                    //console.log(this.selectEnd)
                    //console.log(this.selectStart)
                    this.update()
                }
            }
        }
        if (evt.type == "ButtonUp") {
            if (evt.button == "R_TRIGGER" || evt.button == "L_TRIGGER") {
                this.mouseDown[parseInt(evt.right_or_left)] = false
            }
        }

        if (evt.type == "KeyDown" || evt.type == "KeyDowm") {
            this.keyDown(evt.button)
        }
    }

    selectedText() {
        var self = this
        var text = ""
        var cnt = 0
        for (var i = 0; i < this.chars.length; i ++) {
            if (this.chars[i].selected) {
                cnt += 1
                text += this.chars[i].char
            }
        }
        return {
            "text": text,
            "length": cnt,
            "delete": function() {
                var newText = ""
                for (var i = 0; i < self.chars.length; i ++) {
                    //console.log(self.chars[i])
                    if (!self.chars[i].selected) {
                        //console.log(self.chars[i].char)
                        newText += self.chars[i].char
                    }
                }
                self._text = newText

                self.selectStart = self.tildeAt
                self.selectEnd = self.tildeAt
            },
            "null": function() {
                for (var i = 0; i < self.chars.length; i ++) {
                    //console.log(self.chars[i])
                    if (self.chars[i].selected) {
                        self.chars[i].selected = false
                    }
                }
                self.selectStart = self.tildeAt
                self.selectEnd = self.tildeAt
                //console.log("here")
            }
        }
    }

    insertText(text, pos) {

        this._text = this._text.substr(0, pos)
        + text
        + this._text.substr(pos, this._text.length)
    }

    keyDown(key) {
        //console.log(key.charCodeAt(0))
        if (key == "Enter") {
            key = "\n"
        }
        if (key.length == 1) {
            this.selectedText().delete()

            this.insertText(key, this.tildeAt )

            this.tildeAt += 1
            this.update()
        }
        if (key == "Backspace") {
            if (this.selectedText().length > 0) {
                this.selectedText().delete()
            } else {
                if (this.tildeAt > 0) {
                    this._text = this._
                    .substr(0, this.tildeAt-1)
                    + this._text.substr(this.tildeAt)
                }


                this.tildeAt -= 1
                this.update()
            }
        }
    }

    mouseAction(x, y) {
        if ( x < this.padding ) { x = this.padding }
        if ( y < this.padding ) { y = this.padding }
        if ( y > this.textSize + (this._text.split("\n").length * this.textSize)) {
            y = this.textSize + (this._text.split("\n").length * this.textSize)
        }

        x += Math.round(this.chars[0].w / 2)

        for (var i = 0; i < this.chars.length; i++) {
            if (this.within(
                [x, y],
                [this.chars[i].x, this.chars[i].y],
                [this.chars[i].w, this.chars[i].h]
            )) {
                return i
            }
        }
        return 0
    }




    within(crd, pos, size) {
        if (crd[0] >= pos[0] && crd[0] <= pos[0]+size[0]) {
            if (crd[1] >= pos[1] && crd[1] <= pos[1]+size[1]) {
                return true
            }
        }
        return false
    }
}

var textEditor = new TextEditor(socket, frontPlane.object_id)
//textEditor.text = "hello \n second line"
var VRDebug = require("./DebugConsole.js")
var d = VRDebug(socket, backPlane.object_id)

textEditor.text = fs.readFileSync("TestApp.js")

setInterval(function() {
    //console.log("tick");
    d.text = JSON.stringify(textEditor.chars, null, 4)
    d.update()
},1000)
