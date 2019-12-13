let faceapi;
let video;
let detections;
let RGB = {r:0, g:0, b:0}
let stars = []

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}


function setup() {
    createCanvas(360, 270);

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(RIGHT);
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(video, 0, 0, width, height)
    if (detections) {
        if (detections.length > 0) {
            // console.log(detections)
            drawBox(detections)
            drawLandmarks(detections)
        }

    }
    faceapi.detect(gotResults)
}

function drawBox(detections) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight = alignedRect._box._height

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
    }

}

function drawLandmarks(detections) {
    noFill();
    stroke(161, 95, 251)
    strokeWeight(2)

    for (let i = 0; i < detections.length; i++) {
        const mouth = detections[i].parts.mouth;
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);
        drawStar(leftEye, "L")
        drawStar(rightEye, "R")
    }

}

function drawPart(feature, closed) {

    // beginShape();
    // for (let i = 0; i < feature.length; i++) {
    //     const x = feature[i]._x
    //     const y = feature[i]._y
    //     vertex(x, y)
    // }
    //
    // if (closed === true) {
    //     endShape(CLOSE);
    // } else {
    //     endShape();
    // }

}

function drawStar(eye, LR) {
    const area = getArea(eye[0], eye[1], eye[2], eye[3])
    const center = getCenter(eye)
    // console.log(center.avgX, center.avgY)
    // console.log(area)
    // if(area < 10){
    //     RGB = {r:Math.random()*255, g:Math.random()*255,b:Math.random()*255}

        // for(let i = 0 ; i++ ; i < 100) {
        //     translate(center.avgX, center.avgY)
            // stars.push(new Star(0, 0, 30, 30, 5))
            // stars[i].draw()

    const star = new Star(center.avgX, center.avgY, 3, 10, 5, LR)
    stars.push(star)

    // if (stars.length < 100) {
    // if(area < 10){

    stars.forEach(star => {
            star.draw()
    })
    // }
        // }
    if(stars.length > 100) stars.shift()
    // }

}

function getArea(p0, p1, p2, p3) {
    const totalArea = (p0._y + p3._y) * (p3._x - p0._x) / 2
    const area1 = (p0._y + p1._y) * (p1._x - p0._x) / 2
    const area2 = (p1._y + p2._y) * (p2._x - p1._x) / 2
    const area3 = (p2._y + p3._y) * (p3._x - p2._x) / 2
    const area = totalArea - area1 - area2 - area3
    return area
}

function getCenter(arr) {
    const sumX = arr.reduce((sum, item) => {
            return sum + item._x;
        }, 0
    )
    const sumY = arr.reduce((sum, item) => {
            return sum + item._y;
        }, 0
    )
    const avgX = sumX / arr.length
    const avgY = sumY / arr.length
    return {avgX, avgY}
}

class Star{
    constructor(x, y, radius1, radius2, npoints, LR) {
        this.x = x
        this.y = y
        this.vy = (Math.random() + 1) * -10
        this.radius1 = radius1
        this.radius2 = radius2
        this.npoints = npoints
        this.color= color(Math.random()*255,Math.random()*255,Math.random()*255)
        if(LR === "L"){
            this.angleX = Math.random() * -10
        }else {
            this.angleX = Math.random() * 10
        }
    }
    draw(){
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;
        fill(this.color)
        noStroke()
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius2;
            let sy = this.y + sin(a) * this.radius2;
            vertex(sx, sy);
            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);

        this.vy +=  3
        this.y += this.vy
        this.x += this.angleX
    }
}