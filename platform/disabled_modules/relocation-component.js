class RelocationComponent {
    init() {
        this.requires = ["Physics"]
        console.log("relocation component loaded")
		this.playerColliderModel = {
			"type": "cube",
			"scaleX": "0.1",
			"scaleY": "0.1",
			"scaleZ": "0.1"
		}
    }

    playerEnter(socket) {
        var collider = Object.assign({}, this.playerColliderModel)
        collider.object_id = socket.playerName.hashCode();


        console.log(socket.playerName)
		var rotation = avros.players[socket.playerName].head.rotation;
		collider = avros.Convert.ThreeToAvros.position(collider, avros.players[socket.playerName].rightController.position)
		collider = avros.Convert.ThreeToAvros.rotation(collider, rotation)
        //cube.type = "empty"
        avros.getPlayerSocket(socket.playerName).emit("object description", collider)

        physics.add(collider)
    }
}
