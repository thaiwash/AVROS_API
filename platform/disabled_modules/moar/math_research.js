class MathResearch {
    init() {
        this.enabled = true
    }

    playerEnter(socket) {
        var self = this
        var math3d = require("math3d")
        var Vector3 = math3d.Vector3;
        var Matrix4x4 = math3d.Matrix4x4;
        var Vector3 = math3d.Vector3;
        var Quaternion = math3d.Quaternion;
        var Transform = math3d.Transform;

		this.consoleCube = {
			"object_id": avros.generateId(),
            "name": "console cube",
			"type": "cube",
			"scaleX": "0.1",
			"scaleY": "0.01",
			"scaleZ": "0.1"
		}
		this.addedSphere = {
			"object_id": avros.generateId(),
			"type": "sphere",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.10",
			"posY": "0.52",
			"posZ": "-0.7",
			"parent": this.consoleCube.object_id
		}
		this.testSphere = {
			"object_id": avros.generateId(),
			"type": "sphere",
			"scaleX": "0.01",
			"scaleY": "0.01",
			"scaleZ": "0.01"
		}
		this.confine = {
			"object_id": "1",
			"type": "cube",
			"scaleX": "100",
			"scaleY": "100",
			"scaleZ": "100",
			"posX": "50",
			"posY": "50",
			"posZ": "50"
		}
		this.playerCube = {
			"object_id": "2",
			"type": "empty",
			"scaleX": "1",
			"scaleY": "1",
			"scaleZ": "1",
			"posX": "50",
			"posY": "50",
			"posZ": "50"
		}


		this.consoleCube.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.consoleCube.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.consoleCube.posZ = avros.players[socket.playerName].leftController.position.z + ""

        console.log("player enter "+this.consoleCube.object_id)
		this.playerCube.posX = avros.players[socket.playerName].head.position.x + ""
		this.playerCube.posY = avros.players[socket.playerName].head.position.y + ""
		this.playerCube.posZ = avros.players[socket.playerName].head.position.z + ""

        avros.io.sockets.emit("object description", this.consoleCube)
        avros.io.sockets.emit("object description", this.addedSphere)
        avros.io.sockets.emit("object description", this.confine)
        avros.io.sockets.emit("object description", this.playerCube)

        avros.on("object updated", function(obj) {

            console.log(obj.raw.name)
            console.log(obj.raw.name)

            if (obj.raw.name == self.consoleCube.name) {
                //console.log("parent "+obj.raw.parent)
                var pos = new Vector3(
                    parseFloat(obj.raw.posX),
                    parseFloat(obj.raw.posY),
                    parseFloat(obj.raw.posZ)
                )
                var quat = new Quaternion(
                    parseFloat(obj.raw.rotX),
                    parseFloat(obj.raw.rotY),
                    parseFloat(obj.raw.rotZ),
                    parseFloat(obj.raw.rotW)
                )
                var t1 = new Transform(pos, quat);
                console.log(pos.values)
                var vec = t1.transformPosition(new Vector3(0.1,0,0))
                console.log(vec.values)
                self.testSphere.posX = vec.values[0]
                self.testSphere.posY = vec.values[1]
                self.testSphere.posZ = vec.values[2]
                avros.io.sockets.emit("object description", self.testSphere)
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

        avros.getPlayerSocket(socket.playerName).emit("attach player", this.playerCube)
        setTimeout(function() {

    		self.playerCube = {
    			"object_id": "2",
    			"type": "empty",
    			"scaleX": "1",
    			"scaleY": "1",
    			"scaleZ": "1",
    			"posX": "50",
    			"posY": "50",
    			"posZ": "50"
    		}
            avros.io.sockets.emit("object description", self.playerCube )
        }, 1000)
        this.texture()
    }

    texture() {
        const { createCanvas, loadImage } = require('canvas')
        loadImage('./img/planet/planet_texture.jpg').then((cover) => {
            this.canvas = createCanvas(1000, 1000)
            this.ctx = this.canvas.getContext('2d')
            var self = this

            this.ctx.drawImage(cover, 0, 0, 1000, 1000)

            avros.io.sockets.emit("set texture", {
                "object_id": this.confine.object_id,
                "texture": self.getTexture(this.canvas)
            })
        })
    }

	getTexture(canvas) {
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}
}
