
const { createCanvas, loadImage } = require('canvas')

var canvasWidth = 500;
var canvasHeight = 500;

var window = {
    innerWidth: canvasWidth,
    innerHeight: canvasHeight

};
var document = {
    createElement: function(name) {
        if (name == "canvas") {
            //return new Canvas(canvasWidth, canvasHeight);
        }
        return createCanvas(1000, 1000)
    },
    createElementNS: function(name) {

        return createCanvas(1000, 1000)
    }
};
