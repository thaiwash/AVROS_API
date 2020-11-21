class ObjectInspect {

    init() {
        console.log("Object inspect")
        this.requires = ["Textarea"]
        this.enabled = false
        var self = this
    }

    checkCollision() {

        if (isVoid(this.inspectSphere)) {
            return;
        }

        //var inspectSphere =

        var intersects = [false, false]
            //console.log(avros.allObjects.length)
        for (var i = 0; i < avros.allObjects.length; i ++) {
            var obj = avros.allObjects[i]
            var intersecting = false

            for (var rightOrLeft = 0; rightOrLeft < 2; rightOrLeft ++) {
                // if the object is bigger than its distance to controller
                //console.log(avros.getWorldPosition(obj))
    		    if (obj.scale.x > avros.getParentRelativePosition(obj).distanceTo(this.inspectSphere)) {

                    if (isVoid(obj.intersecting)) {
                        if (obj.name == "FALSE") {
                            this.setTextureColor(obj.raw.object_id, 'rgba(50,50,50,1)')
                        } else {
                            this.setTextureColor(obj.raw.object_id, 'rgba(255,255,255,1)')
                        }
                        obj.intersecting = [playerName, rightOrLeft]
                    }
                    intersecting = true
                }
            }
            if (!intersecting) {
                if (!isVoid(obj.intersecting)) {
                    if (obj.name == "FALSE") {
                        this.setTextureColor(obj.raw.object_id, 'rgba(0,0,0,1)')
                    } else {
                        this.setTextureColor(obj.raw.object_id, 'rgba(200,200,200,1)')
                    }
                    obj.intersecting = null
                }
            }
        }
    }

    playerEnter(socket) {
        var self = this
        this.text = ""

		this.consoleCube = {
			"object_id": "8473",
			"type": "cube",
			"scaleX": "0.1",
			"scaleY": "0.01",
			"scaleZ": "0.1"
		}
		this.editPlane = {
			"object_id": "7834",
			"type": "plane",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.10",
			"posY": "0.52",
			"posZ": "0.0",
			"parent": this.consoleCube.object_id
		}
		this.inspectSphere = {
			"object_id": "7474",
			"type": "sphere",
			"scaleX": "0.10",
			"scaleY": "1",
			"scaleZ": "0.10",
			"posY": "0.52",
			"posZ": "-0.7",
			"parent": this.consoleCube.object_id
		}

		this.consoleCube.posX = avros.players[socket.playerName].leftController.position.x + ""
		this.consoleCube.posY = avros.players[socket.playerName].leftController.position.y + ""
		this.consoleCube.posZ = avros.players[socket.playerName].leftController.position.z + ""

        avros.io.sockets.emit("object description", this.consoleCube)
        avros.io.sockets.emit("object description", this.editPlane)
        avros.io.sockets.emit("object description", this.inspectSphere)






        avros.io.sockets.emit("add tag", {
			"object_id": this.consoleCube.object_id,
			"tag": "Grab"
		})
        avros.io.sockets.emit("add tag", {
			"object_id": this.consoleCube.object_id,
			"tag": "Scalable"
		})


        var Textarea = eval("("+fs.readFileSync("./module/textarea.js").toString('utf-8')+")")
        this.editTxt  = new Textarea()
        this.editTxt.new(socket, this.editPlane.object_id)
        this.editTxt.text = "lol"


    }
}
