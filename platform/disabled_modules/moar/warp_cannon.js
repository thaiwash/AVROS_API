

class WarpCannon {
    init() {
        console.log("Init WC")
    }


	getTexture(canvas) {
		return canvas.toDataURL().substr("data:image/png;base64,".length);
	}

	say(words) {
		avros.io.sockets.emit("tts", {"say" : words})
	}
}
