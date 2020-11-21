/*
    Complete: 100%
*/



class ParentingTest {
    init() {
        console.log("Init Parenting")
        this.enabled = false
    }

    playerEnter(socket) {
        console.log("hlo")
		var scaleModifier = 13

		this.deck = {
			"object_id": "37753",
			"type": "cube",
			"scaleX": (parseFloat("0.00691") * (scaleModifier+2))+ "",
			"scaleY": (parseFloat("0.003") * (scaleModifier+2))+ "",
			"scaleZ": (parseFloat("0.01056") * (scaleModifier+2))+ ""
		}
		this.deckMenuPlane = {
			"object_id": "7893",
			"type": "plane",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.10",
			"posY": "0.51",
			"parent": "37753"
		}

		this.placementObject = {
			"object_id": "8847738",
			"type": "cube",
			"scaleX": (parseFloat("0.00691") * scaleModifier)+ "",
			"scaleY": (parseFloat("0.0001") * scaleModifier)+ "",
			"scaleZ": (parseFloat("0.01056") * scaleModifier)+ ""
		}
		this.frontPlane = {
			"object_id": "8268",
			"type": "plane",
			"scaleX": "0.12",
			"scaleY": "1",
			"scaleZ": "0.115",
			"posY": "0.7",
			"parent": "8847738"
		}
		this.backPlane = {
			"object_id": "8267",
			"type": "plane",
			"scaleX": "0.12",
			"scaleY": "1",
			"scaleZ": "0.115",
			"posY": "-0.7",
			"parent": "8847738"
		}

		this.deck.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.deck.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.deck.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.deck)
        avros.io.sockets.emit("object description", this.deckMenuPlane)

        avros.getPlayerSocket(socket.playerName).emit("add tag", {
			"object_id": this.deck.object_id,
			"tag": "Grab"
		})

    }


	getTexture(canvas) {
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
