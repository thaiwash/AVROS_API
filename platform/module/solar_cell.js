/*
    Complete: 20%

    Hinge operation: no animation: good enough
                    animation: good
                    hinge follors controller: perfect
*/



class SolarCell {
    init() {
        console.log("Init Cell")
        this.enabled = true
    }

    playerEnter(socket) {
		var scaleModifier = 13

		this.cover = {
			"object_id": "38383",
			"type": "cube",
			"scaleX": (parseFloat("0.00691") * (scaleModifier+2))+ "",
			"scaleY": (parseFloat("0.0003") * (scaleModifier+2))+ "",
			"scaleZ": (parseFloat("0.01056") * (scaleModifier+2))+ ""
		}
		this.pages = {
            "parent": "38383",
			"object_id": "387283",
			"type": "cube",
			"scaleX":0.95+ "",
			"scaleY":3+ "",
			"scaleZ":0.95+ "",
			"posY":2+ ""
		}
		this.backCover = {
            "parent": "38383",
			"object_id": "387343",
			"type": "cube",
			"scaleX": 1+ "",
			"scaleY": 1+ "",
			"scaleZ": 1+ "",
			"posY":7+ ""
		}
		this.backPages = {
            "parent": "38383",
			"object_id": "387363",
			"type": "cube",
			"scaleX":0.95+ "",
			"scaleY":3+ "",
			"scaleZ":0.95+ "",
			"posY":5+ ""
		}

    	this.hinge = {
            "parent": "38383",
    		"object_id": "38273",
    		"type": "cube",
    		"scaleX":0.05+ "",
    		"scaleY":8+ "",
    		"scaleZ":1 + "",
			"posY":3.5+ "",
			"posX":0.525+ ""
    	}


		this.cover.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.cover.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.cover.posZ = avros.players[socket.playerName].leftController.position.z + ""



        avros.io.sockets.emit("object description", this.cover)
        avros.io.sockets.emit("object description", this.pages)
        avros.io.sockets.emit("object description", this.backCover)
        avros.io.sockets.emit("object description", this.backPages)
        avros.io.sockets.emit("object description", this.hinge)

        this.grip = [false,false]
        this.bookOpen = false
        var self = this
        socket.on("button down", function(obj) {
            if (obj.button == "R_GRIP") {
                console.log(avros.getObjectByRawId("38383").raw.parent)
                console.log(avros.players[socket.playerName].leftController.grabberId)
                // todo: check if the book is in right hand
                if (self.grip[1]) {
                    console.log("hi")
                    if (!this.bookOpen) {
                        self.openBook()
                        this.bookOpen = true
                    } else {
                        self.closeBook()
                        this.bookOpen = false
                    }
                }
                self.grip[0] = true
            }
            if (obj.button == "L_GRIP") {
                self.grip[1] = true
            }
        })
        socket.on("button up", function(obj) {
            if (obj.button == "R_GRIP") {
                self.grip[0] = false
            }
            if (obj.button == "L_GRIP") {
                self.grip[1] = false
            }
        })

        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.cover.object_id,
			"tag": "Grab"
		})
        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.pages.object_id,
			"tag": "GrabMyParent"
		})
        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.backPages.object_id,
			"tag": "GrabMyParent"
		})
        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.backCover.object_id,
			"tag": "GrabMyParent"
		})
        this.texture()
    }

    closeBook() {

        this.backCover = {
            "parent": "38383",
            "object_id": "387343",
            "type": "cube",
            "scaleX": 1+ "",
            "scaleY": 1+ "",
            "scaleZ": 1+ "",
            "posY":7+ ""
        }
        this.backPages = {
            "parent": "38383",
            "object_id": "387363",
            "type": "cube",
            "scaleX":0.95+ "",
            "scaleY":3+ "",
            "scaleZ":0.95+ "",
            "posY":5+ ""
        }

        this.hinge = {
            "parent": "38383",
            "object_id": "38273",
            "type": "cube",
            "scaleX":0.05+ "",
            "scaleY":8+ "",
            "scaleZ":1 + "",
            "posY":3.5+ "",
            "posX":0.525+ ""
        }



        this.readingPlane = {
            "parent": "38383",
            "object_id": "29286",
            "type": "plane",
            "scaleX":0+ "",
            "scaleY":0+ "",
            "scaleZ":0 + "",
            "posY":3.6+ "",
            "posX":0.650+ "",
            "posZ":0+ ""
        }

        avros.io.sockets.emit("object description", this.backCover)
        avros.io.sockets.emit("object description", this.backPages)
        avros.io.sockets.emit("object description", this.hinge)
        avros.io.sockets.emit("object description", this.readingPlane)
    }

    openBook() {

        this.backCover = {
            "parent": "38383",
            "object_id": "387343",
            "type": "cube",
            "scaleX": 1+ "",
            "scaleY": 1+ "",
            "scaleZ": 1+ "",
            "posY":0+ "",
            "posX":1.29+ ""
        }
        this.backPages = {
            "parent": "38383",
            "object_id": "387363",
            "type": "cube",
            "scaleX":0.95+ "",
            "scaleY":3+ "",
            "scaleZ":0.95+ "",
            "posY":2+ "",
            "posX":1.29+ ""
        }

        this.hinge = {
            "parent": "38383",
            "object_id": "38273",
            "type": "cube",
            "scaleX":0.3+ "",
            "scaleY":1+ "",
            "scaleZ":1 + "",
            "posY":-0.4+ "",
            "posX":0.650+ ""
        }

        this.readingPlane = {
            "parent": "38383",
            "object_id": "29286",
            "type": "plane",
            "scaleX":0.222+ "",
            "scaleY":1+ "",
            "scaleZ":0.095 + "",
            "posY":3.6+ "",
            "posX":0.650+ "",
            "posZ":0+ ""
        }

        avros.io.sockets.emit("object description", this.backCover)
        avros.io.sockets.emit("object description", this.backPages)
        avros.io.sockets.emit("object description", this.hinge)
        avros.io.sockets.emit("object description", this.readingPlane)

        this.content()
    }

    texture() {
        const { createCanvas, loadImage } = require('canvas')

        loadImage('./img/book/cover_leather.jpg').then((cover) => {
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


                this.ctx.drawImage(cover, 0, 0, 100, 100)

                avros.io.sockets.emit("set texture", {
                    "object_id": this.cover.object_id,
                    "texture": self.getTexture(this.canvas)
                })
                avros.io.sockets.emit("set texture", {
                    "object_id": this.backCover.object_id,
                    "texture": self.getTexture(this.canvas)
                })
                avros.io.sockets.emit("set texture", {
                    "object_id": this.hinge.object_id,
                    "texture": self.getTexture(this.canvas)
                })

                loadImage('./img/book/pages_side.jpg').then((cover) => {
                        this.canvas = createCanvas(100, 100)
                        this.ctx = this.canvas.getContext('2d')
                        var self = this


                        this.ctx.drawImage(cover, 0, 0, 100, 100)

                        avros.io.sockets.emit("set texture", {
                            "object_id": this.pages.object_id,
                            "texture": self.getTexture(this.canvas)
                        })
                        avros.io.sockets.emit("set texture", {
                            "object_id": this.backPages.object_id,
                            "texture": self.getTexture(this.canvas)
                        })
                })
        })

    }

    content() {
        const { createCanvas, loadImage } = require('canvas')
        loadImage('./img/book/pages.jpg').then((cover) => {
            this.canvas = createCanvas(1000, 1000)
            this.ctx = this.canvas.getContext('2d')
            var self = this

            this.ctx.drawImage(cover, 0, 0, 1000, 1000)

            avros.io.sockets.emit("set texture", {
                "object_id": this.readingPlane.object_id,
                "texture": self.getTexture(this.canvas)
            })
        })
    }


	getTexture(canvas) {
		return this.canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
