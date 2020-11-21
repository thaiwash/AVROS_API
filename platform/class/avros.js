

var fs = require("fs")
const express = require('express')
const PublicMethods = require("./PublicMethods.js")

/*

Object design

{
	"raw": {}
} extends THREE.3DObject

*/

class AVROS extends PublicMethods {
	constructor() {
        super()
        //this.setMaxListeres(1000)

        var self = this
		this.THREE = THREE
		this.Convert = Convert
		this.players = {}
		this.entanglements = []
		this.requiredTasks = []

		this.scene = new THREE.Scene()

        this.allObjects = []
		/* move to object property
		this.textureUpdateInterval = setInterval(function() {
			self.textureUpdate()
		}, 1000)
		*/
	}

	systemMessage(msg) {
        this.showLog = false
		if (this.showLog) {
			console.log(msg)
		}
    	this.emit('system message', msg)
	}

	open(port) {
        var self = this


		this.app = express()

		this.app.get('/players', function(req, res) {
			res.send(JSON.stringify(self.players, 0, 4));
			res.end();
		})
		var server = require('http').createServer(this.app);

		this.io = require('socket.io')(server);

		server.listen(port);

		this.io.on('connection', function(socket) {
			self.systemMessage("server: connection detected")
			self.initSocket(socket)
		})


		console.log("server: AVROS server listening on port "+ port)
		self.initTimers()
	}


	initTimers() {
        var self = this
		this.socketCleanupInterval = setInterval(function() {
			self.socketCleanup()
		}, 10000)

		/*
		this.bindScanInterval = setInterval(function() {
			self.bindScan()
		}, 1000)
		this.entanglementSyncInterval = setInterval(function() {
			self.entanglementSync()
		}, 3000)*/
	}

	socketCleanup() {
		var sockets = this.io.sockets.clients()
		//console.log(Object.keys(sockets))
		var keys = Object.keys(sockets["sockets"])

		var connectedPlayers = []
		for (var i = 0; i < keys.length; i ++) {
			//(sockets[keys[i]])
			//console.log(keys[i])
			//console.log(Object.keys(sockets["sockets"][keys[i]]))
			//console.log(sockets["sockets"][keys[i]].playerName)

			//console.log(sockets["sockets"][keys[i]].playerName)

			if (isVoid(sockets["sockets"][keys[i]].playerName)) {
				this.systemMessage("server: Unidentified socket disconnected")
				sockets["sockets"][keys[i]].disconnect()
				continue
			} else {
				connectedPlayers.push(sockets["sockets"][keys[i]].playerName)
			}
			/*
			if (this.players[sockets["sockets"][keys[i]].playerName].socket.id != keys[i]) {
				console.log("server: Socket id mismash, smash")
				sockets["sockets"][keys[i]].disconnect()
			}*/
		}

		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (connectedPlayers.indexOf(playerNames[i]) == -1) {
				//this.removePlayerOwnedObjects(playerNames[i])
				delete(this.players[playerNames[i]])
			}
		}
		this.systemMessage("server: no sockets "+ keys.length + " "+Object.keys(this.players))
	}

	deleteObject(socket, obj) {
		socket.emit("object destroyed", obj)
	}

	changeObject(_object) {


		var obj = _object.raw
		obj = Convert.ThreeToAvros.position(obj, _object.position)
		obj = Convert.ThreeToAvros.rotation(obj, _object.rotation)

		obj = Convert.ThreeToAvros.scale(obj, _object.scale)

		obj.transform_time = 100+""
		this.io.sockets.emit("object transform", obj)
	}

	registerObject(_object) {
		if (!isVoid(_object.object_id)) {
			obj = this.getObjectByRawId(_object.object_id)
		}
		if (obj == null) {
			var obj = new THREE.Object3D();
			this.scene.add(obj)
		}

		obj.position.copy(Convert.AvrosToThree.position(_object))
		obj.rotation.copy(Convert.AvrosToThree.rotation(_object))
		obj.scale.copy(Convert.AvrosToThree.scale(_object))
		obj.name = _object.name
		obj.raw = _object

        this.systemMessage(_object.object_id+ " parent "+_object.parent+ " updated")

        this.emit("object updated", obj)


        var found = -1
        for (var i = 0; i < this.allObjects.length; i ++) {
            if (this.allObjects[i].raw.object_id == _object.object_id) {
                found = i
            }
        }

        if (found != -1) {
            this.allObjects[found] = obj
        } else {
            this.allObjects.push(obj)
        }
        return obj;
	}

	initSocket(socket) {
        var self = this
		this.systemMessage("server: connection detected")

        socket.inited = false
		socket.on("syncronization event", function(data) {
			//console.log(data)
			//console.log("server: sync ")
			//console.log(JSON.stringify(data, 0, 4))
			if (isVoid(data)) {
				self.systemMessage("server: bad client dsconnected")
				socket.disconnect()
				return
			}
			self.syncEvent(socket, data)
			self.emit("player update", socket.playerName)
			clearTimeout(self.players[socket.playerName].syncTimer)
			setTimeout(function() {
				socket.emit("syncronization event callback")
			}, 100)
        })


		socket.on("object changed", function(data) {
			//console.log("obj_changed")

			self.registerObject(data)
		})

		this.systemMessage("server: who are you")
		socket.emit("who are you")
		socket.on("i am", function (data) {
			socket.playerName = data["playerName"]
			socket.emit("connection accepted")
			self.emit("connected", {"socket": socket})
			socket.emit("syncronization event callback")
			self.systemMessage(data["playerName"] + " identified")

		})

        socket.on("name changed", function(data) {
			socket.playerName = data["playerName"]
        })


		socket.on('disconnect', function(obj) {
			self.systemMessage(socket.playerName+" left the server")
			delete(self.players[socket.playerName])
		})
	}

	syncEvent(socket, data) {
		var name = socket.playerName
        var self = this

		var player = this.parseSyncData(data["data"])

		var controllerDistraction = 0

		var firstConnect = false

		if (isVoid(this.players[name])) {

			socket.syncTimeout = setTimeout(function() {
				socket.emit("syncronization event callback")
				self.syncEvent(socket, data)
			}, 0)

            socket.playerName = name

            player.leftController.object_id = this.generateId()
            player.rightController.object_id = this.generateId()
            player.head.object_id = this.generateId()
            player.objects = []

			self.systemMessage("server: "+name+" connected")
			firstConnect = true
		} else {
            player.objects = this.players[name].objects
			player.leftController.object_id = this.players[name].leftController.object_id
			player.rightController.object_id = this.players[name].rightController.object_id
			player.head.object_id = this.players[name].head.object_id
		}


		this.players[name] = player

		if (firstConnect) {
			self.emit('player entered', name);
		}
    }

    parseSyncData(data) {
		if (isVoid(data)) {
			this.systemMessage("server: sync data is void")
			return
		}
        var parse = data.split("|")
        var values = [];
        for (var i = 0; i < parse.length; i ++) {
            var chop = parse[i].replace("(", "")
            chop = chop.replace(")", "")
            chop = chop.replace(" ", "")
            chop = chop.replace(" ", "")
            chop = chop.replace(" ", "")
            chop = chop.replace(" ", "")
            values.push(chop.split(","))
        }
        var user = {}
        user.head = {}
        user.head.position = new THREE.Vector3(
            parseFloat(values[0][0]),
            parseFloat(values[0][1]),
            parseFloat(values[0][2])
        )
        user.head.rotation = Convert.AvrosToThree.rotation({
			"rotX": values[1][0],
			"rotY": values[1][1],
			"rotZ": values[1][2],
			"rotW": values[1][3]
		})

        user.rightController = {}
        user.rightController.position = new THREE.Vector3(
            parseFloat(values[2][0]),
            parseFloat(values[2][1]),
            parseFloat(values[2][2])
        )

        user.rightController.rotation = Convert.AvrosToThree.rotation({
			"rotX": values[3][0],
			"rotY": values[3][1],
			"rotZ": values[3][2],
			"rotW": values[3][3]
		})


        user.leftController = {}
        user.leftController.position = new THREE.Vector3(
            parseFloat(values[4][0]),
            parseFloat(values[4][1]),
            parseFloat(values[4][2])
        )
        user.leftController.rotation = Convert.AvrosToThree.rotation({
			"rotX": values[5][0],
			"rotY": values[5][1],
			"rotZ": values[5][2],
			"rotW": values[5][3]
		})

        user.rightController.grabberId = parse[6]
        user.leftController.grabberId = parse[7]


		// failed to configure default spawn position
		var scene = new THREE.Scene()

		var cam = new THREE.Object3D();
		scene.add(cam)
		cam.position.copy(user.head.position)
		cam.rotation.copy(user.head.rotation)

		scene.updateMatrixWorld();

		var positioner = new THREE.Object3D();
		cam.add(positioner);
		positioner.position.set(0.1,-0.1,-0.4);

		scene.updateMatrixWorld();
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition( positioner.matrixWorld );
		user.defaultSpawn = vector

//parent.updateMatrixWorld();







		/*user.defaultSpawn = new THREE.Vector3(
			positioner.position.x+cam.position.x,
			positioner.position.y+cam.position.y,
			positioner.position.z+cam.position.z
		)*/


		return user
    }

	generateId() {
		var min=1;
		var max=100000;
		return Math.floor(Math.random() * (+max - +min)) + +min;
	}
}


var Convert = {
	ThreeToAvros: {
		position: function (avrosJson, threeVector3) {
			avrosJson.posX = threeVector3.x + ""
			avrosJson.posY = threeVector3.y + ""
			avrosJson.posZ = threeVector3.z + ""

			return avrosJson
		},

		rotation: function (avrosJson, threeVector3) {

			threeVector3.z *= -1; // flip Z

			threeVector3.y -= (Math.PI); // Y is 180 degrees off

			var quat = new THREE.Quaternion();
			quat.setFromEuler(threeVector3);


			avrosJson.rotX = (-quat._x) + ""
			avrosJson.rotY = quat._y + ""
			avrosJson.rotZ = quat._z + ""
			avrosJson.rotW = (-quat._w) + ""
			return avrosJson
		},

		scale: function (avrosJson, threeVector3) {
			avrosJson.scaleX = threeVector3.x + ""
			avrosJson.scaleY = threeVector3.y + ""
			avrosJson.scaleZ = threeVector3.z + ""

			return avrosJson
		}
	},
	AvrosToThree: {

		position: function (avrosJson) {
			return new THREE.Vector3(
				parseFloat(avrosJson.posX),
				parseFloat(avrosJson.posY),
				parseFloat(avrosJson.posZ))
		},

		rotation: function (avrosJson) {

			var qx = parseFloat(avrosJson.rotX)
			var qy = parseFloat(avrosJson.rotY)
			var qz = parseFloat(avrosJson.rotZ)
			var qw = parseFloat(avrosJson.rotW)

			var q = new THREE.Quaternion( -qx, qy, qz, -qw )
			var v = new THREE.Euler()
			v.setFromQuaternion( q )

			v.y += (Math.PI) // Y is 180 degrees off


			v.z *= -1 // flip Z

			//this.camera.rotation.copy(v)
			return v
		},

		scale: function (avrosJson) {
			return new THREE.Vector3(
				parseFloat(avrosJson.scaleX),
				parseFloat(avrosJson.scaleY),
				parseFloat(avrosJson.scaleZ))
		}
	}
}

function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}
var THREE = null
module.exports = function(_THREE) {
	THREE = _THREE
	return new AVROS(THREE)
}
