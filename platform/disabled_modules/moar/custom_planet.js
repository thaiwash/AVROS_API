class CustomPlanet {
    init() {
        console.log("Init Planet")
        this.enabled = false
    }

    playerEnter(socket) {
		var scaleModifier = 13

		this.planet = {
			"object_id": "37753",
			"type": "sphere",
			"scaleX": "0.1",
			"scaleY":"0.1",
			"scaleZ":"0.1",
		}

		this.planet.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.planet.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.planet.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.planet)

        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.planet.object_id,
			"tag": "Grab"
		})
        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.planet.object_id,
			"tag": "Scalable"
		})

        this.texture()
        this.createObj(socket)
    }

    createObj(socket) {
		this.slab = {
			"object_id": avros.generateId(),
			"type": "cube",
			"scaleX": "0.2",
			"scaleY":"0.1",
			"scaleZ":"0.1",
		}

		this.slab.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.slab.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.slab.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.slab)

        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.slab.object_id,
			"tag": "Grab"
		})
        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.slab.object_id,
			"tag": "Scalable"
		})
    }

    texture() {
        const { createCanvas, loadImage } = require('canvas')
        loadImage('./img/planet/planet_texture.jpg').then((cover) => {
            this.canvas = createCanvas(1000, 1000)
            this.ctx = this.canvas.getContext('2d')
            var self = this

            this.ctx.drawImage(cover, 0, 0, 1000, 1000)

            avros.io.sockets.emit("set texture", {
                "object_id": this.planet.object_id,
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
