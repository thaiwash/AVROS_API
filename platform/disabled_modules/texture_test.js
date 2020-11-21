var fs = require("fs")

const { createCanvas, loadImage } = require('canvas')

class ObjectPlacement {

	constructor(avros) {
		var self = this
		this.placementObject = {
			"object_id": "84467",
			"type": "cube",
			"scaleX": "0.2",
			"scaleY": "0.2",
			"scaleZ": "0.2"
		}
		this.avros = avros
		this.canvas = createCanvas(100, 100)
		this.ctx = this.canvas.getContext('2d')
/*
		avros.app.get('/cardroom', function(req, res) {
			if (req.url == "/cardroom") {
				res.write(fs.readFileSync("./assetbundles/cardroom"));
				res.end();
			}
		})

this.room = {
    "object_id": "82688",
    "type": "asset/cardroom",
	"scaleX": "1",
	"scaleY": "1",
	"scaleZ": "1",
	"posX":"-1.43101",
	"posY":"0",
	"posZ":"4.997593",
	"scaleX":"0.6400161",
	"scaleY":"0.6400077",
	"scaleZ":"0.6400147"
}*/
		//console.log(avros)
		this.avros.on("player entered", function(playerName) {
			//avros.io.sockets.emit("tts", {"say" : "Greetings "+playerName})
			//self.createSphere(playerName)

			self.avros.getPlayerSocket(playerName).on("button down",  function(data) {
				self.buttonDownEvent(playerName, data)
			})
			var plane = Object.assign({}, self.placementObject)
			plane.object_id = "2262";
			//console.log(avros.players[playerName].rightController)
			plane = self.avros.Convert.ThreeToAvros.position(plane, self.avros.players[playerName].rightController.position)
			plane = self.avros.Convert.ThreeToAvros.rotation(plane, self.avros.players[playerName].rightController.rotation)
			self.avros.getPlayerSocket(playerName).emit("object description", plane)

			/*setTimeout( function() {
				self.avros.getPlayerSocket(playerName).emit("object description", self.room)
				console.log("remit")
			}, 1000)*/


			self.avros.io.sockets.emit("add tag", {
				"object_id": plane.object_id,
				"tag": "Grab"
			})
			self.avros.io.sockets.emit("add tag", {
				"object_id": plane.object_id,
				"tag": "Scalable"
			})
			self.ctx.fillStyle = 'rgba(0,0,255,1)'
			self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
			//this.ctx.clearRect(0,  0, this.canvas.width, this.canvas.height);
			self.ctx.font = '45px Arial'
			self.ctx.fillStyle = 'rgba(0,0,0,1)'

			self.ctx.fillText("hey", 30, 30)

			self.avros.io.sockets.emit("set texture", {
				"object_id": plane.object_id,
				"texture": self.getTexture()
			})



			self.avros.getPlayerSocket(playerName).on("joystick",  function(data) {
				self.controllerEvent(playerName, data)
			})
			avros.getPlayerSocket(playerName).on("button up",  function(data) {
				self.buttonUpEvent(playerName, data)
			})
		})
			this.grabbed = false
	}




	buttonUpEvent(playerName, data) {
		console.log(data)
		if (data.button == "R_JOYSTICK")  {
			this.shifted = false
		}
		if (data.button == "R_GRIP") {
			this.grabbed = false
		}
	}
	controllerEvent(playerName, data) {
		if (this.grabbed ) {
			return
		}

		if (data.rightOrLeft == 1) {
		}
		if (data.rightOrLeft == 0) {
			//avros.physics.world.bodies[0].velocity.x += parseFloat(data.y) / 10;

			//avros.physics.world.bodies[0].position.x += 0.1;
				var obj = this.avros.getObjectById("2262")
			if (this.shifted) {
				obj.scaleZ = parseFloat(obj.scaleZ) - (parseFloat(data.x) / 100);
			}else{
				obj.scaleX = parseFloat(obj.scaleX) - (parseFloat(data.x) / 100);

				obj.scaleY = parseFloat(obj.scaleY) - (parseFloat(data.y) / 100);


			}

				this.avros.getPlayerSocket(playerName).emit("object description", obj)
		}
	}



	// Legacy Shaders/Transparent/Cutout/Soft Edge Unlit
	getTexture(canvas) {
		return this.canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	buttonDownEvent(playerName, data) {
		if (data.button == "A") {
			fs.writeFileSync("coords.txt", JSON.stringify(this.avros.getObjectById("2262")))
			console.log("H'lo")
		}
		if (data.button == "R_JOYSTICK") {
			this.shifted = true
		}
		if (data.button == "R_GRIP") {
			this.grabbed = true
		}
	}
}
