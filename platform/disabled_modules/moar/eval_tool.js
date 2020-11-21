
class EvalTool {
    init() {
        console.log("Init eval tool")
        this.requires = ["Textarea"]
        this.enabled = false
    }

    playerEnter(socket) {
        var self = this
        this.text = ""
		var scaleModifier = 13

		this.consoleCube = {
			"object_id": "37753",
			"type": "cube",
			"scaleX": (parseFloat("0.008691") * (scaleModifier+2))+ "",
			"scaleY": (parseFloat("0.003") * (scaleModifier+2))+ "",
			"scaleZ": (parseFloat("0.01056") * (scaleModifier+2))+ ""
		}
		this.editPlane = {
			"object_id": "7894",
			"type": "plane",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.07",
			"posY": "0.52",
			"posZ": "-0.15",
			"parent": "37753"
		}
		this.outputPlane = {
			"object_id": "7895",
			"type": "plane",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.03",
			"posY": "0.55",
			"posZ": "0.35",
			"parent": "37753"
		}
		this.playButtonPlane = {
			"object_id": "7896",
			"type": "plane",
			"scaleX": "0.010",
			"scaleY": "1",
			"scaleZ": "0.010",
			"posY": "0.7",
			"parent": "37753",
			"posX": "-0.32",
			"posZ": "0.15"
		}
		this.saveButtonPlane = {
			"object_id": "7897",
			"type": "plane",
			"scaleX": "0.010",
			"scaleY": "1",
			"scaleZ": "0.010",
			"posY": "0.7",
			"parent": "37753",
			"posX": "-0.45",
			"posZ": "0.15"
		}

		this.consoleCube.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.consoleCube.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.consoleCube.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.consoleCube)
        avros.io.sockets.emit("object description", this.editPlane)
        avros.io.sockets.emit("object description", this.outputPlane)
        avros.io.sockets.emit("object description", this.playButtonPlane)
        avros.io.sockets.emit("object description", this.saveButtonPlane)


        /*
        socket.on("key down", function(evt) {
            if (isVoid(evt)) {
                return;
            }
            if (evt.key == "Shift" || evt.key == "AltGr") {
            } else if (evt.key == "Enter") {
                self.exec(self.text)
                self.text = ""
            } else if (evt.key == "Backspace") {
                self.text = self.text.substr(0, self.text.length-1)
            } else {
                self.text = self.text + evt.key
            }
            self.texture()

        })*/

        socket.on("button down", function(evt) {
            console.log(evt)

            var rol = 0
            if (evt.button[0] == 'r') {
                rol = 1
            }
            if (self.playButtonPlane.object_id == self.raycastTarget[rol]) {
                self.exec(self.editTxt.text)
        		self.playButtonPlane.posY = "0.65"
                avros.io.sockets.emit("object description", self.playButtonPlane)
                setTimeout(function() {
            		self.playButtonPlane.posY = "0.7"
                    avros.io.sockets.emit("object description", self.playButtonPlane)
                }, 500)
            }

            if (self.saveButtonPlane.object_id == self.raycastTarget[rol]) {

        		self.saveButtonPlane.posY = "0.65"
                avros.io.sockets.emit("object description", self.saveButtonPlane)
                setTimeout(function() {
            		self.saveButtonPlane.posY = "0.7"
                    avros.io.sockets.emit("object description", self.saveButtonPlane)
                }, 500)
            }
        })


        self.raycastTarget = ["", ""]
        socket.on("raycast event", function(evt) {
            //console.log(evt)
            if (evt.object_id != self.raycastTarget[parseInt(evt.rightOrLeft)]) {
                self.raycastTarget[parseInt(evt.rightOrLeft)] = evt.object_id
            }
        })

        avros.io.sockets.emit("add tag", {
			"object_id": this.consoleCube.object_id,
			"tag": "Grab"
		})
        avros.io.sockets.emit("add tag", {
			"object_id": this.consoleCube.object_id,
			"tag": "Scalable"
		})
        avros.io.sockets.emit("add tag", {
			"object_id":  this.saveButtonPlane.object_id,
			"tag": "Raycast"
		})
        avros.io.sockets.emit("add tag", {
			"object_id":  this.playButtonPlane.object_id,
			"tag": "Raycast"
		})
        self.playTexture()
        self.saveTexture()


        var Textarea = eval("("+fs.readFileSync("./module/textarea.js").toString('utf-8')+")")
        this.editTxt  = new Textarea()
        this.editTxt.new(socket, this.editPlane.object_id)
        this.editTxt.text = "lol"

        this.outTxt = new Textarea()
        this.outTxt.new(socket, this.outputPlane.object_id, 700, 300)
    }

    exec(cmd) {
        try{
            this.out = eval(cmd)
        } catch (e) {
            this.out = e
        }
        console.log("exec")
        this.outTxt.text = this.out
    }


    playTexture() {
        const { createCanvas, loadImage } = require('canvas')

        loadImage('play.png').then((play) => {
                this.canvas = createCanvas(100, 100)
                this.ctx = this.canvas.getContext('2d')
                var self = this

                /*
                                self.ctx.fillStyle = 'rgba(255,255,255,1)'
                                self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
                //this.ctx.clearRect(0,  0, this.canvas.width, this.canvas.height);
                self.ctx.font = '30px Arial'
                self.ctx.fillStyle = 'rgba(0,0,0,1)'
    */


                this.ctx.drawImage(play, 0, 0, 100, 100)

                avros.io.sockets.emit("set texture", {
                    "object_id": this.playButtonPlane.object_id,
                    "texture": self.getTexture(this.canvas)
                })
        })

    }
    saveTexture() {
        const { createCanvas, loadImage } = require('canvas')

            loadImage('save.png').then((save) => {
                this.canvas = createCanvas(100, 100)
                this.ctx = this.canvas.getContext('2d')
                var self = this

                /*
                                self.ctx.fillStyle = 'rgba(255,255,255,1)'
                                self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
                //this.ctx.clearRect(0,  0, this.canvas.width, this.canvas.height);
                self.ctx.font = '30px Arial'
                self.ctx.fillStyle = 'rgba(0,0,0,1)'
    */


                this.ctx.drawImage(save, 0, 0, 100, 100)

                avros.io.sockets.emit("set texture", {
                    "object_id": this.saveButtonPlane.object_id,
                    "texture": self.getTexture(this.canvas)
                })
            })

    }


	getTexture(canvas) {
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}



	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
