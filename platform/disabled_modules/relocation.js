var CANNON = require("cannon")

class Relocation {
	constructor() {

		this.playerControllerCubeTemplate = {
			"type": "cube",
			"scaleX": "0.1",
			"scaleY": "0.1",
			"scaleZ": "0.1"
		}

		this.cubes = []
		var self = this

		avros.on("player entered", function(playerName) {
			//avros.io.sockets.emit("tts", {"say" : "Greetings "+playerName})
			//self.createSphere(playerName)

			console.log(playerName+" player controller inited")
			var cube = Object.assign({}, self.playerControllerCubeTemplate)
			cube.object_id = playerName.hashCode();
			console.log(avros.players[playerName].rightController)

			var rotation = avros.players[playerName].head.rotation;
			setInterval(function() {
				console.log(avros.getObjectById(cube.object_id))
				var rotation = avros.Convert.AvrosToThree.rotation(avros.getObjectById(cube.object_id));
				rotation.x += 0.01
				cube = avros.Convert.ThreeToAvros.rotation(cube, rotation)
				avros.getPlayerSocket(playerName).emit("object description", cube)
			}, 1000)
			//rotation.x = 0
			cube = avros.Convert.ThreeToAvros.position(cube, avros.players[playerName].rightController.position)
			cube = avros.Convert.ThreeToAvros.rotation(cube, rotation)
			//avros.physics.add(cube)

			self.cubes.push(cube)

			//cube.type = "empty"
			avros.getPlayerSocket(playerName).emit("object description", cube)

			/*
			avros.io.sockets.emit("add tag", {
				"object_id": cube.object_id,
				"tag": "Grab"
			})*/
			/*
			avros.io.sockets.emit("add tag", {
				"object_id": cube.object_id,
				"tag": "Physics"
			})*/
			//avros.getPlayerSocket(playerName).emit("attach player", cube)

			avros.getPlayerSocket(playerName).on("joystick",  function(data) {
				self.controllerEvent(playerName, data)
			})


			avros.getPlayerSocket(playerName).on("button down",  function(data) {
				self.buttonDownEvent(playerName, data)
			})
			avros.getPlayerSocket(playerName).on("button up",  function(data) {
				self.buttonUpEvent(playerName, data)
			})



		})

	}

	buttonDownEvent(playerName, data) {
		if (data.button == "Y") {
			avros.getPlayerSocket(playerName).emit("mic")
		}
	}
	buttonUpEvent(playerName, data) {
		if (data.button == "Y") {
		}
	}

	controllerEvent(playerName, data) {
		if (data.rightOrLeft == 1) {
			//avros.physics.world.bodies[0].position.x += 0.1;
			avros.physics.world.bodies[0].angularVelocity.y = -(parseFloat(data.x) * 30);
			//avros.physics.world.bodies[0].velocity.x += 0.001;
			//onsole.log("act")
			//console.log(avros.physics.world.bodies[0].quaternion)

			var inverse = new CANNON.Quaternion();

			avros.physics.world.bodies[0].quaternion.inverse(inverse)
			var worldVelocity = inverse.vmult(new CANNON.Vec3(0,0, parseFloat(data.y) / 0.1))
			avros.physics.world.bodies[0].velocity.copy(worldVelocity)

			clearInterval(this.timeoutter2)
			this.timeoutter2 = setTimeout(function() {

				var inverse = new CANNON.Quaternion();

				avros.physics.world.bodies[0].quaternion.inverse(inverse)
				var worldVelocity = inverse.vmult(new CANNON.Vec3(0, 0, 0))
				avros.physics.world.bodies[0].velocity.copy(worldVelocity)
			}, 500)



			clearInterval(this.timeoutter1)
			this.timeoutter1 = setTimeout(function() {

				avros.physics.world.bodies[0].angularVelocity.y = 0
			}, 500)
		}
		if (data.rightOrLeft == 0) {
			//avros.physics.world.bodies[0].velocity.x += parseFloat(data.y) / 10;


		}

	}
}
