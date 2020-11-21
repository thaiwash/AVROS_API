
var CANNON = require("cannon")

class Physics {
	init() {
		var self = this
		this.avros = avros
		var alphaMode = false

		this.world = new CANNON.World();
		this.world.gravity.set(0, -20,  0); // m/s²


		this.fixedTimeStep = (clockFrequency/1000) / 60.0;
			/*
		if (alphaMode) {clockFrequency
			this.fixedTimeStep = 1.0 / 60.0; // seconds
		} else {
			this.fixedTimeStep = 10.0 / 60.0;clockFrequency
		}*/
		this.maxSubSteps = 3;

		/*setInterval(function () {
			self.update()
		}, (alphaMode) ? 1000 : 100)
		*/
		setInterval(function () {
			self.update()
		}, clockFrequency)

		this.linked = []


	}


	addStatic(obj) {
		if (obj.type == "cube") {
			var shape = new CANNON.Box(new CANNON.Vec3(
				parseFloat(obj.scaleX/2),
				parseFloat(obj.scaleY/2),
				parseFloat(obj.scaleZ/2)
			));
			var physicsCube = new CANNON.Body({ mass: 0 });
			physicsCube.addShape(shape);
			physicsCube.updateMassProperties();
			this.world.add(physicsCube);

			var quat = new this.avros.THREE.Quaternion();
			quat.setFromEuler(this.avros.Convert.AvrosToThree.rotation(obj));


			// should I use cannon vecs?
			physicsCube.position.copy(this.avros.Convert.AvrosToThree.position(obj));
			physicsCube.quaternion.copy(quat)

		}
	}
	add(obj) {
		if (obj.type == "cube") {
			var shape = new CANNON.Box(new CANNON.Vec3(
				parseFloat(obj.scaleX/2),
				parseFloat(obj.scaleY/2),
				parseFloat(obj.scaleZ/2)
			));
			var physicsCube = new CANNON.Body({ mass: 1 });
			physicsCube.addShape(shape);
			physicsCube.updateMassProperties();
			this.world.add(physicsCube);

			var quat = new this.avros.THREE.Quaternion();
			quat.setFromEuler(this.avros.Convert.AvrosToThree.rotation(obj));


			// should I use cannon vecs?
			physicsCube.position.copy(this.avros.Convert.AvrosToThree.position(obj));
			physicsCube.quaternion.copy(quat)

			this.linked.push({"avros": obj, "physics": physicsCube})
		}
	}

	getObjectById(id) {
		for (var i = 0; i < this.links.length; i++) {
			if (this.links[i].avros.object_id == id) {
				return this.linked[i].physics
			}
		}
	}


	update() {

		var time = (new Date).getTime()

		for (var i = 0; i < this.linked.length; i++) {

			this.linked[i].last = Object.assign({}, this.linked[i].avros)
			this.linked[i].avros = this.avros.Convert.ThreeToAvros.position(this.linked[i].avros, this.linked[i].physics.position)

			var quat = new this.avros.THREE.Quaternion(
				this.linked[i].physics.quaternion.x,
				this.linked[i].physics.quaternion.y,
				this.linked[i].physics.quaternion.z,
				this.linked[i].physics.quaternion.w
			)

			var v = new this.avros.THREE.Euler();
			v.setFromQuaternion(  quat );

			this.linked[i].avros = this.avros.Convert.ThreeToAvros.rotation(this.linked[i].avros, v)
			if (!isVoid(this.linked[i].avros.object_id)) {
				// change this in avros and let sync call handle it
				this.linked[i].avros.transform_time = clockFrequency+""
				/*
				console.log(parseFloat(this.linked[i].last.posY).toFixed(2)+" "+parseFloat(this.linked[i].avros.posY).toFixed(2))

				console.log()*/
				if ((parseFloat(this.linked[i].last.posY).toFixed(2) !== parseFloat(this.linked[i].avros.posY).toFixed(2))) {
					this.avros.io.sockets.emit("object transform", this.linked[i].avros)
				}
			}
		}


		if(this.lastTime !== undefined){

			var dt = (time - this.lastTime) / clockFrequency;
			//console.log(this.world)
			this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
		}
		this.lastTime = time
	}
}

module.exports = function(avros) {
	return new Physics(avros)
}

 String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}
