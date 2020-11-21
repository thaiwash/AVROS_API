// PHASE 1: Create sphere
// PHASE 2: Set texture
// PHASE 3: Intersectional change of color

class Duality {
    init() {
        const { createCanvas, loadImage } = require('canvas')

        this.enabled = false


        var self = this
        this.players = {}

        this.instersecting = []
        this.lastControllerPosition = []

        avros.on("player update", function(playerName) {
            //self.controllerMove(playerName)
            self.intersectionCheck(playerName)
        })
/*
        avros.on("object changed", function(data) {
            //console.log("lel")
            if (data.name == "o" || data.name == "0") {
                //console.log(data)
                self.saveState(data)
                if (!isVoid(data.parent)) {
                    //self.say("parent is "+ data.parent)
                }
        //player.leftController.object_id
            }
        })



        var updateInterval = setInterval(function () {
            self.update()
        }, 3000)
        */
        /*
        avros.on("identification", function(data) {
            console.log(data)x§c§
            avros.getPlayerSocket(data.playerName).on("button down",
             function(data) {
                self.buttonDownEvent(data.playerName, data)
            })
            console.log(data)
        })*/

    }




    controllerMove(playerName) {
        var controllerPos = [
            avros.players[playerName].rightController.position,
            avros.players[playerName].leftController.position
        ]


        for (var rightOrLeft = 0; rightOrLeft < 2; rightOrLeft ++) {

            if (!isVoid(this.lastControllerPosition[rightOrLeft])) {

                //console.log(this.lastControllerPosition[0].x - right.x) // this.lastControllerPosition[0].x -
                var change = {
                    "x": this.lastControllerPosition[rightOrLeft].x - controllerPos[rightOrLeft].x,
                    "y": this.lastControllerPosition[rightOrLeft].y - controllerPos[rightOrLeft].y,
                    "z": this.lastControllerPosition[rightOrLeft].z - controllerPos[rightOrLeft].z
                }

                var rol = ["right", "left"]
                var grabbed = this.players[playerName].grabbed[rol[rightOrLeft]]
                if (!isVoid(grabbed)) {
                    for (var i = 0; i < grabbed.length; i++) {
                        var obj = grabbed[i]
                        if (obj.raw.parent) {

                        console.log(obj.raw.parent)

                            obj = avros.getObjectByRawId(obj.raw.parent)
                            console.log(obj.raw.object_id)

                        }
                        obj.position.x -= change.x
                        obj.position.y -= change.y
                        obj.position.z -= change.z

                        avros.changeObject(obj)
                    }

                }

            }
            this.lastControllerPosition[rightOrLeft] = Object.assign({}, controllerPos[rightOrLeft])
        }

    }

    playerEnter(socket) {
        var self = this
        //avros.io.sockets.emit("tts", {"say" : "Greetings "+socket.playerName})

        this.players[socket.playerName] = {}
        this.players[socket.playerName].grabbed = {}
        this.players[socket.playerName].grabbed.right = null
        this.players[socket.playerName].grabbed.left = null

        socket.on("button down",
             function(data) {
                self.buttonDownEvent(socket, data)
        })

        socket.on("button up",
             function(data) {
                self.buttonUpEvent(socket, data)
        })


        //this.parentingTest(socket)
/*
        avros.getPlayerSocket(socket.playerName).on("object destroyed", function(data) {
                //console.log("object destroyed event")
            avros.io.sockets.emit("tts", {"say" : "object destroyed"})
            self.destroy(data.object_id)
        })

        avros.getPlayerSocket(playerName).on("grab start", function(data) {
            self.grabbed[data.rightOrLeft] = data.object_id
        })

        avros.getPlayerSocket(playerName).on("grab end", function(data) {
            self.grabbed[data.rightOrLeft] = undefined
        })


        self.loadStates()
        */
    }


	intersectionCheck(playerName) {

        var controllerPos = [
            avros.players[playerName].rightController.position,
            avros.players[playerName].leftController.position
        ]
        var intersects = [false, false]
            //console.log(avros.allObjects.length)
        for (var i = 0; i < avros.allObjects.length; i ++) {
            var obj = avros.allObjects[i]
            if (obj.name == "TRUE" || obj.name == "FALSE") {
                //console.log("hear")
                var intersecting = false

                for (var rightOrLeft = 0; rightOrLeft < 2; rightOrLeft ++) {
                    // if the object is bigger than its distance to controller
                    //console.log(avros.getWorldPosition(obj))
        		    if (obj.scale.x > avros.getParentRelativePosition(obj).distanceTo(controllerPos[rightOrLeft])) {

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

	}

    getIntersecting(params) {
        var ret = []
        for (var i = 0; i < avros.scene.children.length; i ++) {
            var obj = avros.scene.children[i]
            if (!isVoid(obj.intersecting)) {
                if (obj.intersecting[0] == params[0] && obj.intersecting[1] == params[1]) {
                    ret.push(obj)
                }
            }
        }
        return ret
    }

	buttonUpEvent(socket, data) {
		if (data.button == "R_GRIP") {
            this.players[socket.playerName].grabbed.right = null
        }
		if (data.button == "L_GRIP") {
            this.players[socket.playerName].grabbed.left = null
        }
    }

    connect(socket) {

// todo: loop all removing parent
// wait with a 100ms interval until all abjects are updated.
        if (isVoid(this.players[socket.playerName].grabbed.left)
            || isVoid(this.players[socket.playerName].grabbed.right)) {
                return
        }

        var obj1 = null
        var obj2 = null

        if (this.players[socket.playerName].grabbed.left.length == 1) {
            obj1 = this.players[socket.playerName].grabbed.left[0]
        } else { return }

        if (this.players[socket.playerName].grabbed.right.length == 1) {
            obj2 = this.players[socket.playerName].grabbed.right[0]
        } else { return }


        this.players[socket.playerName].grabbed.right = null
        this.players[socket.playerName].grabbed.left = null

        this.say("connect")

        // PHASE 1: ungrab the spheres
        var ungrabbed1 = false
        var ungrabbed2 = false

        function listenerFunction(obj) {
            if (obj1.raw.object_id == obj.raw.object_id) {
                ungrabbed1 = true
            }
            if (obj2.raw.object_id == obj.raw.object_id) {
                ungrabbed2 = true
            }
            if (ungrabbed1 && ungrabbed2) {
                avros.removeListener("object updated", listenerFunction)
                proceedToUnparent()
            }
            console.log(obj.raw.object_id)
        }

        avros.on("object updated", listenerFunction)
        socket.emit("ungrab", {"rightOrLeft": "0"})
        socket.emit("ungrab", {"rightOrLeft": "1"})

        // PHASE 2: unparent spheres
        var sphereGroup = []
        function proceedToUnparent() {
            for (var i = 0; i < avros.scene.children.length; i++) {
                if (!isVoid(avros.scene.children[i].raw.parent)) {
                    if (avros.scene.children[i].raw.parent == obj1.raw.object_id) {
                        sphereGroup.push(avros.scene.children[i])
                    }
                    if (avros.scene.children[i].raw.parent == obj2.raw.object_id) {
                        sphereGroup.push(avros.scene.children[i])
                    }
                }
            }

            for (var i = 0; i < sphereGroup.length; i++) {
                avros.io.sockets.emit("set parent", {
                    "object_id": sphereGroup[i].raw.object_id,
                    "parent": ""
                })
            }

            proceedToPhase3()
        }


        // PHASE 3: parent spheres

        function proceedToPhase3() {
            console.log("3")

            avros.setParent(obj1, obj2)
            avros.io.sockets.emit("add tag", {
                "object_id": obj1.raw.object_id,
                "tag": "GrabMyParent"
            })
/*
            var dir = new THREE.Vector3(); // create once an reuse it

            dir.subVectors( obj1.position, obj2.position).normalize();


            var euler = new THREE.Euler().setFromVector3(dir, 'XYZ');

            obj1.raw.parent = obj2.raw.object_id
            obj1.raw.scaleX = parseFloat(obj1.raw.scaleX)/parseFloat(obj2.raw.scaleX)+ ""
            obj1.raw.scaleY = parseFloat(obj1.raw.scaleY)/parseFloat(obj2.raw.scaleY)+ ""
            obj1.raw.scaleZ = parseFloat(obj1.raw.scaleZ)/parseFloat(obj2.raw.scaleZ)+ ""

            obj1.raw.rotX = "0.001"
            obj1.raw.rotY = "0.001"
            obj1.raw.rotZ = "0.001"
            obj1.raw.rotW = "0.001"

            obj1.raw.posX = ((parseFloat(obj1.raw.posX) - parseFloat(obj2.raw.posX))/parseFloat(obj2.raw.scaleX)) + ""
            obj1.raw.posY = ((parseFloat(obj1.raw.posY) - parseFloat(obj2.raw.posY))/parseFloat(obj2.raw.scaleX)) + ""
            obj1.raw.posZ = ((parseFloat(obj1.raw.posZ) - parseFloat(obj2.raw.posZ))/parseFloat(obj2.raw.scaleX)) + ""
            console.log(obj1.raw.posX)

            obj2.raw.rotX = "0"
            obj2.raw.rotY = "0"
            obj2.raw.rotZ = "0"
            obj2.raw.rotW = "0"


            avros.io.sockets.emit("object description", obj2.raw)
            avros.io.sockets.emit("object description", obj1.raw)
            avros.io.sockets.emit("add tag", {
                "object_id": obj1.raw.object_id,
                "tag": "GrabMyParent"
            })
            */
        }
        /*    console.log(obj1.position.x)


            setTimeout(function(){

}, 1000)
            setTimeout(function(){



var dir = new THREE.Vector3(); // create once an reuse it

dir.subVectors(   obj1.position, obj2.position).normalize();


var euler = new THREE.Euler().setFromVector3(dir, 'XYZ');

obj1.raw.parent = obj2.raw.object_id
obj1.raw.scaleX = parseFloat(obj1.raw.scaleX)/parseFloat(obj2.raw.scaleX)+ ""
obj1.raw.scaleY = parseFloat(obj1.raw.scaleY)/parseFloat(obj2.raw.scaleY)+ ""
obj1.raw.scaleZ = parseFloat(obj1.raw.scaleZ)/parseFloat(obj2.raw.scaleZ)+ ""

obj1.raw.rotX = "0.001"
obj1.raw.rotY = "0.001"
obj1.raw.rotZ = "0.001"
obj1.raw.rotW = "0.001"

obj1.raw.posX = ((parseFloat(obj1.raw.posX) - parseFloat(obj2.raw.posX))/parseFloat(obj2.raw.scaleX)) + ""
obj1.raw.posY = ((parseFloat(obj1.raw.posY) - parseFloat(obj2.raw.posY))/parseFloat(obj2.raw.scaleX)) + ""
obj1.raw.posZ = ((parseFloat(obj1.raw.posZ) - parseFloat(obj2.raw.posZ))/parseFloat(obj2.raw.scaleX)) + ""
console.log(obj1.raw.posX)

obj2.raw.rotX = "0"
obj2.raw.rotY = "0"
obj2.raw.rotZ = "0"
obj2.raw.rotW = "0"


avros.io.sockets.emit("object description", obj2.raw)
avros.io.sockets.emit("object description", obj1.raw)
    avros.io.sockets.emit("add tag", {
        "object_id": obj1.raw.object_id,
        "tag": "GrabMyParent"
    })


}, 2000)

            setTimeout(function(){

            console.log(obj1.raw.posX)
}, 3000)

            //base.con.connect()
            //obj2.parent = obj.object_id
            //avros.getPlayerSocket(playerName).emit("ungrab", {"rightOrLeft": "1"})
            //avros.getPlayerSocket(playerName).emit("ungrab", {"rightOrLeft": "0"})
            //avros.getPlayerSocket(playerName).emit("object changed", obj2)

        }*/
    }
	// solace in serenity
	buttonDownEvent(socket, data) {

		if (data.button == "Y") {
		 //avros.io.sockets.emit("tts", {"say" : data.button})
			this.createSphere(socket.playerName, true)
		}
		if (data.button == "X") {
		 //avros.io.sockets.emit("tts", {"say" : data.button})
			this.createSphere(socket.playerName)
		}
		if (data.button == "R_JOYSTICK") {

            this.connect(socket)
		}

        if (data.button == "L_JOYSTICK") {
            this.paint("4640", "rgba(0,0,0,1)")
            /*
            console.log(avros.allObjects.length)
            for(var i = 0; i < avros.allObjects.length; i ++) {
                if (avros.allObjects[i].name == "TRUE") {

                    console.log(avros.allObjects[3].raw.posX)
                }
            }*/

            //console.log(avros.getWorldPosition())
        }
		if (data.button == "B") {
			//avros.io.sockets.emit("tts", {"say" : data.button})

		}

		if (data.button == "R_GRIP") {
			this.players[socket.playerName].grabbed.right = this.getIntersecting([socket.playerName, 0])
        }

		if (data.button == "L_GRIP") {
            this.players[socket.playerName].grabbed.left = this.getIntersecting([socket.playerName, 1])
        }
/*
		if (data.button == "L_GRIP") {

			if (!isVoid(this.intersecting[1])) {
				grabbed[1] = intersecting[1]
			}
		}*/

	}


	createSphere(playerName, blackOrWhite) {
        const { createCanvas, loadImage } = require('canvas')
		var self = this


		var obj = {
			"object_id": avros.generateId(),
			"scaleX": "0.03",
			"scaleY": "0.03",
			"scaleZ": "0.03",
			"type": "sphere",
			"name": "TRUE"
		}


		//console.log(avros.players)
		//console.log(playerName)
		//console.log(avros.players[playerName])

		obj.posX = avros.players[playerName].leftController.position.x + ""
		obj.posY = avros.players[playerName].leftController.position.y + ""
		obj.posZ = avros.players[playerName].leftController.position.z + ""

		obj.rotX = avros.players[playerName].leftController.rotation._x + ""
		obj.rotY = avros.players[playerName].leftController.rotation._y + ""
		obj.rotZ = avros.players[playerName].leftController.rotation._z + ""
		obj.rotW = avros.players[playerName].leftController.rotation._w + ""


		if (isVoid(avros.getPlayerSocket(playerName))) {
			return
		}

		if (isVoid(blackOrWhite)) {
			obj.name = "FALSE"
		}


        avros.io.sockets.emit("object description", obj)


        avros.io.sockets.emit("add tag", {
			"object_id": obj.object_id,
			"tag": "Grab"
		})

        avros.io.sockets.emit("add tag", {
			"object_id": obj.object_id,
			"tag": "Scalable"
		})

		if (isVoid(blackOrWhite)) {
			this.setTextureColor(obj.object_id, 'rgba(0,0,0,1)')
		} else {
			this.setTextureColor(obj.object_id, 'rgba(200,200,200,1)')
		}
	}

    setTextureColor(object_id, color) {
        const { createCanvas, loadImage } = require('canvas')
        this.canvas = createCanvas(1, 1)
        this.ctx = this.canvas.getContext('2d')
        var self = this
        self.ctx.fillStyle = color
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        avros.io.sockets.emit("set texture", {
            "object_id": object_id,
            "texture": self.getTexture(this.canvas)
        })
    }


	getTexture(canvas) {
        console.log(canvas.toDataURL())
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
