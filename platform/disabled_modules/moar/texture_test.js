/*
    Complete: 100%
*/



class TextureTest {
    init() {
        console.log("Init Parenting")
        this.enabled = false
    }

    playerEnter(socket) {
		var scaleModifier = 13

		this.deck = {
			"object_id": "37753",
			"type": "cube",
			"scaleX": (parseFloat("0.00691") * (scaleModifier+2))+ "",
			"scaleY": (parseFloat("0.003") * (scaleModifier+2))+ "",
			"scaleZ": (parseFloat("0.01056") * (scaleModifier+2))+ ""
		}

		this.deck.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.deck.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.deck.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.deck)

        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.deck.object_id,
			"tag": "Grab"
		})

        this.texture()
    }

    texture() {
        const { createCanvas, loadImage } = require('canvas')
        this.canvas = createCanvas(100, 100)
        this.ctx = this.canvas.getContext('2d')
        var self = this
        self.ctx.fillStyle = 'rgba(0,0,255,1)'
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        //this.ctx.clearRect(0,  0, this.canvas.width, this.canvas.height);
        self.ctx.font = '45px Arial'
        self.ctx.fillStyle = 'rgba(0,0,0,1)'

        self.ctx.fillText("hey", 30, 30)

        avros.io.sockets.emit("set texture", {
            "object_id": this.deck.object_id,
            "texture": self.getTexture()
        })
    }


	getTexture(canvas) {
		return this.canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
