

class Physics {
    init() {
        console.log("physics loaded")

        var clockFrequency = 200

        this.CANNON = require("cannon")
		var self = this
		this.avros = avros
		var alphaMode = false

		this.world = new this.CANNON.World();
		this.world.gravity.set(0, -20,  0); // m/s²


		this.fixedTimeStep = (clockFrequency/1000) / 60.0;

		this.maxSubSteps = 3;

		setInterval(function () {
			self.update()
		}, clockFrequency)

		this.linked = []
    }


	addStatic(obj) {
		if (obj.type == "cube") {
			var shape = new this.CANNON.Box(new CANNON.Vec3(
				parseFloat(obj.scaleX/2),
				parseFloat(obj.scaleY/2),
				parseFloat(obj.scaleZ/2)
			));
			var physicsCube = new this.CANNON.Body({ mass: 0 });
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
			var shape = new this.CANNON.Box(new CANNON.Vec3(
				parseFloat(obj.scaleX/2),
				parseFloat(obj.scaleY/2),
				parseFloat(obj.scaleZ/2)
			));
			var physicsCube = new this.CANNON.Body({ mass: 1 });
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

    oneSecUpdate() {
        //console.log("update test")
    }
}
