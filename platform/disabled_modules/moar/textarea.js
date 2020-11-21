/*
78%
v raycast control
v selecting
- tilde 90%

base.module['evailTool']


*/


class Textarea {
    new(socket, objectId, width, height) {
        var self = this
        this.chars = []
        this._text = ""
        this.tildeAt = 1

        this.bgColor = '#282c34'
        this.textColor = '#f00'
        this.tildeColor = '#0000ff'
        this.selectColor = '#ffffff'

        if (isVoid(width)) {
            this.width = 700
        }
        else {
            this.width = width
        }

        if (isVoid(height)) {
            this.height = 700
        }
        else {
            this.height = height
        }

        this.padding = 10

        this.textSize = 24

        const { createCanvas, loadImage } = require('canvas')
        this.canvas = createCanvas(this.width, this.height)
        this.ctx = this.canvas.getContext('2d')

        this.ctx.font = this.textSize+"pt Courier"

        this.socket = socket
        this.objectId = objectId
        this.tildeStart()

        this.mouseDown = [false, false]
        this.selectStart = 0
        this.selectEnd = 0


        avros.io.sockets.emit("add tag", {
			"object_id":  objectId,
			"tag": "Raycast"
		})
        avros.io.sockets.emit("add tag", {
			"object_id":  objectId,
			"tag": "Keyboard"
		})
        socket.on("raycast event", function(obj) {
            //console.log(obj)
            self.raycast(obj)
        })
        socket.on("raycast end", function(obj) {
            //console.log(obj)
        })
        socket.on("button down", function(obj) {
            //console.log(obj)
            self.buttonDown(socket.playerName, obj)
        })
        socket.on("button up", function(obj) {
            //console.log(obj)
            self.buttonUp(socket.playerName, obj)
        })
        socket.on("key down", function(evt) {
            console.log(evt)
            self.keyDown(evt.key)
        })
    }

    buttonUp(name, evt) {
        if (evt.button == "R_TRIGGER" || evt.button == "L_TRIGGER") {
            var rol = 1
            if (evt.button[0] == 'R') {
                rol = 0
            }
            this.mouseDown[parseInt(rol)] = false
        }
    }

    raycast(evt) {
        //console.log(evt)
        if (!isVoid(self.rayLock)) {
            return
        }
        if (parseFloat(evt.x) == 0) {
            return
        }
        if (parseInt(evt.rightOrLeft) == 1) { return }
        this.x = Math.round(parseFloat(evt.x) * this.width)
        this.y = this.height - Math.round(parseFloat(evt.y) * this.height)

        if (!this.mouseDown[parseInt(evt.rightOrLeft)]) {
            return;
        }
        //console.log("lel")
        if (evt.object_id == this.objectId) {
            var lastSelectEnd = this.selectEnd
            this.selectEnd = this.mouseAction(this.x, this.y)

            if (this.selectEnd != lastSelectEnd) {
                //console.log("rc")
                //console.log(this.selectEnd)
                //console.log(this.selectStart)
                this.update()
            }
        }
    }

    buttonDown(name, evt) {
        if (isVoid(this.x)){
            return;
        }
        if (evt.button == "R_TRIGGER" || evt.button == "L_TRIGGER") {
            var lastTildeAt = this.tildeAt
            this.tildeAt = this.mouseAction(this.x, this.y)

            console.log("tilde is at " + this.tildeAt)
                        console.log(this.x+", "+this.y)

            if (this.tildeAt != lastTildeAt) {
                this.update()
            }
            this.tildeAt = this.mouseAction(this.x, this.y)
            var rol = 1
            if (evt.button[0] == 'R') {
                rol = 0
            }
            this.mouseDown[rol] = true
            this.selectedText().null()
            this.selectStart = this.mouseAction(this.x, this.y)
            this.selectEnd = this.mouseAction(this.x, this.y)
            console.log()
            //console.log(this.selectStart)
            //console.log(this.selectEnd)
            //this.socket.emit("tts", {"say": "hello", "user_id": evt.user_id})
        }
        if (evt.button == "A") {
            var self = this
            this.socket.once("transfer clipboard", function(data) {
                self.clipboardTransferComplete(data)


            });
            this.socket.emit("get clipboard", {
                "user_id": evt.user_id,
                "getter": "368"
            })
        }
        if (evt.button == "B") {
            console.log("copied "+ this.selectedText().text)
            this.socket.emit("set clipboard", {"user_id": evt.user_id, "content": this.selectedText().text})
            this.selectedText().delete()
        }
    }

    tildeStart() {
        var self = this
        this.showTilde = true
        this.tildeBlinkTimer = setInterval(function () {
            self.showTilde = !self.showTilde
            self._update()
        }, 500)
    }

    _update() {
        this.draw()
        //console.log("here")
        avros.io.sockets.emit("set texture", {
            "object_id": this.objectId,
            "texture": this.getTexture()
        })
    }



    set text(text) {
        text = text.toString();
        //text = text.replace(/\r\n/g, "\n");
        this._text = text;
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
        for (var i = 0; i < this._text.length+1; i ++) {
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

            //console.log(this.tildeAt)
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
                    console.log(data)
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
            console.log("set tilde to "+this.tildeAt)
            this.update()
            this.rayLock = true
            var self = this
            setTimeout(function() {
                self.rayLock = null
            }, 500)
        }
        if (key == "Backspace") {
            if (this.selectedText().length > 0) {
                this.selectedText().delete()
            } else {
                if (this.tildeAt > 1) {
                    this._text = this._text.substr(0, this.tildeAt-1)
                     + this._text.substr(this.tildeAt)
                }


                this.tildeAt -= 1
                this.update()
            }
        }
    }

    mouseAction(x, y) {
        if (isVoid(this.chars)) { return }
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
                return i+1
            }
        }
        var lastChar = this.chars[this.chars.length-1]
        if (this.within(
            [x, y],
            [x-1, y-1],
            [lastChar.w+50, lastChar.h])) {
                return this.chars.length
            }
        return 1
    }


    update() {
        //console.log(this.chars[0].w)
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
