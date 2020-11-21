
const EventEmitter = require('events');


/*
Demiliisi // jahtaa alokkaita

			"object_id": "unique id",
			"type": "sphere",
			"scaleX": "0.04500",
			"scaleY": "0.04500",
			"scaleZ": "0.04500",
			"posX": player.head.position.x.toString(),
			"posY": player.head.position.y.toString(),
			"posZ": player.head.position.z.toString(),
			"rotX": player.head.rotation._x.toString(),
			"rotY": player.head.rotation._y.toString(),
			"rotZ": player.head.rotation._z.toString(),
			"rotW": player.head.rotation._w.toString(),
			"name": "PlayerCamera",
			"owner": name

*/

module.exports = class PublicMethods extends EventEmitter {
	constructor() {
        super()
	}

	// Function: getPlayerSocket
	// Returns socket.IO component of the connected player
	getPlayerSocket(playerName) {
		var self = this
		var sockets = this.io.sockets.clients()

		var keys = Object.keys(sockets["sockets"])
		for (var i = 0; i < keys.length; i ++) {
			if (sockets.sockets[keys[i]].playerName == playerName) {
				if (isVoid(sockets.sockets[keys[i]])) {
					self.systemMessage("warnng: player "+playerName+" doesnt have a socket")
				}
				return sockets.sockets[keys[i]]
			}
		}
	}

	// Function: playerObjectExists
	// Returns true or false
	playerObjectExists(playerName, objectId) {
		for (var i2 = 0; i2 < this.players[playerName].objects.length; i2 ++) {
			if (this.players[playerName].objects[i2].object_id == objectId) {
				return true
			}
		}
		return false
	}


	// Function: objectExists
	// Checks if the object exists in the instance
	objectExists(objectId) {
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			if (this.playerObjectExists(playerNames[i], objectId)) {
				return true
			}
		}
		return false
	}


	// Function: objectExists
	// Checks if the object exists in the instance
	playerHasObject(playerName, objectName) {
		var all = this.allObjects()
		for (var i = 0; i < all.length; i ++) {
			if (all[i].owner == playerName && all[i].name == objectName) {
				return true
			}
		}
		return false
	}


	// Function: createObject
	// spawns object into the instance pool
	createObject(obj) {
		var playerNames = Object.keys(this.players)
		for (var i = 0; i < playerNames.length; i ++) {
			this.getPlayerSocket(playerNames[i]).emit("object changed", obj)
		}
	}

	// Function: getObjectById
	// Returns object by id
	getObjectByRawId(objectId) {
		for (var i = 0; i < this.allObjects.length; i ++) {
			if (this.allObjects[i].raw.object_id == objectId) {
				return this.allObjects[i]
			}
		}
	}

	// Function: getObjectById
	// Returns object by id
	getObjectByName(objectName) {
		var obj = this.allObjects()
		for (var i = 0; i < obj.length; i ++) {
			if (isVoid(obj[i].name)) { continue }
			if (obj[i].name == objectName) {
				return obj[i]
			}
		}
	}

	// Function: allObjects
	// Returns raw syntax objects from all players
	/*allObjects() {
		var objs = []
		for (var i = 0; i < scene.children.length; i ++) {
            objs.push(scene.children[i])

            if (scene.children[i].children.length > 0) {

            }
		}
		return objs
	}*/

    getWorldPosition(obj) {
        obj.updateMatrixWorld();
        var worldMatrix = obj.matrixWorld;
        return new this.THREE.Vector3().setFromMatrixPosition(worldMatrix);
    }

    setParent(obj1, obj2) {
        this.io.sockets.emit("set parent", {
            "object_id": obj1.raw.object_id,
            "parent": obj2.raw.object_id
        })
        obj1.raw.parent = obj2.raw.object_id
        obj2.add(obj1)
    }


    getParentRelativePosition(obj) {
        var objParent = this.getObjectByRawId(obj.raw.parent);
        if (isVoid(objParent)) {
            return obj.position;
        }

        var math3d = require("math3d")

        var Vector3 = math3d.Vector3;
        var Quaternion = math3d.Quaternion;
        var Transform = math3d.Transform;

        // substract scale from position
        var pos1alt = new Vector3(obj.position.x/obj.scale.x, obj.position.y/obj.scale.x, obj.position.z/obj.scale.x);
        var pos1alt2 = new Vector3(obj.position.x*obj.scale.x, obj.position.y*obj.scale.x, obj.position.z*obj.scale.x);
        var pos1 = new Vector3(obj.position.x, obj.position.y, obj.position.z);
        var pos2 = new Vector3(objParent.position.x, objParent.position.y, objParent.position.z);

        //console.log(obj.position)
        //console.log(objParent.position)

        var rot1 = new Quaternion(
            parseFloat(obj.raw.rotX),
            parseFloat(obj.raw.rotY),
            parseFloat(obj.raw.rotZ),
            parseFloat(obj.raw.rotZ)
        )
        var rot2 = new Quaternion(
            parseFloat(objParent.raw.rotX),
            parseFloat(objParent.raw.rotY),
            parseFloat(objParent.raw.rotZ),
            parseFloat(objParent.raw.rotW)
        )

        var t1 = new Transform(pos1, rot2);
        var t2 = new Transform(pos2, rot2);

        t2.addChild(t1);

        var result = t1.transformPosition(pos2);


//process.exit(0)
        return new this.THREE.Vector3(result.x, result.y, result.z)
    }

	// Function: generateId
	// Generates an identity
	generateId() {
		var min=1;
		var max=100000;
		return Math.floor(Math.random() * (+max - +min)) + +min;
	}
}


function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}
