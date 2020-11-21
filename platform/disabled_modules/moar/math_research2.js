class MathResearch2 {
    init() {
        this.enabled = false
    }

    playerEnter(socket) {
        this.cube = {
            "object_id": "6541",
            "type": "cube",
            "scaleX": "0.1",
            "scaleY": "0.1",
            "scaleZ": "0.1"
        }


        var self = this
        var math3d = require("math3d")
        var Vector3 = math3d.Vector3;
        var Matrix4x4 = math3d.Matrix4x4;
        var Vector3 = math3d.Vector3;
        var Quaternion = math3d.Quaternion;
        var Transform = math3d.Transform;

        var pos = new Vector3(
            avros.players[socket.playerName].head.position.x,
            avros.players[socket.playerName].head.position.y,
            avros.players[socket.playerName].head.position.z
        )

        this.cube = avros.Convert.ThreeToAvros.rotation(this.cube, avros.players[socket.playerName].head.rotation)
        var quat = new Quaternion(
            parseFloat(this.cube.rotX),
            parseFloat(this.cube.rotY),
            parseFloat(this.cube.rotZ),
            parseFloat(this.cube.rotW)
        )


        var t1 = new Transform(pos, quat);
        //console.log(pos.values)
        var vec = t1.transformPosition(new Vector3(0,0,0.5))
        //console.log(vec.values)
        this.cube.posX = vec.values[0] + ""
        this.cube.posY = vec.values[1] + ""
        this.cube.posZ = vec.values[2] + ""
        avros.io.sockets.emit("object description", this.cube)
        console.log("here")

        avros.io.sockets.emit("add tag", {
			"object_id": this.cube.object_id,
			"tag": "Grab"
		})

    }
}
