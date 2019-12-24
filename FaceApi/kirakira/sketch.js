let faceapi;
let video;
let detections;
const imgs = [
    "./eye_l.png",
    "./eye_r.png",
    "./eye_l_blink.png",
    "./eye_r_blink.png"
]
let eye_l
let eye_r

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    eye_l = loadImage(imgs[0])
    eye_r = loadImage(imgs[1])
}

function setup() {
    createCanvas(700, 500);

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

        const face = faceArea(detections[i])

        // drawPart(mouth, true);
        // drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);
        drawStar(leftEye, eye_l, face)
        drawStar(rightEye, eye_r, face)
    }

}

function drawPart(feature, closed) {

    beginShape();
    for (let i = 0; i < feature.length; i++) {
        const x = feature[i]._x
        const y = feature[i]._y
        vertex(x, y)
    }

    if (closed === true) {
        endShape(CLOSE);
    } else {
        endShape();
    }

}

function drawStar(eye, eye_image, faceArea) {
    const area = getTrapezoidArea(eye[0], eye[1], eye[2], eye[3])
    console.log(area)
    const center = getCenter(eye)
    let [r, g, b] = [Math.random() * 255, 255, 255]
    // if (area < 100) {
    //     [r, g, b] = [Math.random() * 255, 255, 255]
    //     console.log("blink!")
    //     eye_l = loadImage(imgs[2])
    //     eye_r = loadImage(imgs[3])
    // }else{
    //     eye_l = loadImage(imgs[0])
    //     eye_r = loadImage(imgs[1])
    // }
    // colorMode(HSB, 255)
    // let c = color(r, g, b)
    // fill(c)
    // noStroke()
    // ellipse(center.avgX, center.avgY , 20, 20)
    const eye_size = {x: faceArea.x, y: faceArea.y, width: faceArea.boxWidth / 2, height: faceArea.boxHeight / 2}
    image(eye_image, center.avgX - eye_size.width/2, center.avgY - eye_size.height/2, eye_size.width, eye_size.height)
}

function getTrapezoidArea(p0, p1, p2, p3) {
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

function faceArea(detection) {
    const alignedRect = detection.alignedRect;
    const x = alignedRect._box._x
    const y = alignedRect._box._y
    const boxWidth = alignedRect._box._width
    const boxHeight = alignedRect._box._height

    return {x, y, boxWidth, boxHeight}
}

function faceArea(detection) {
    const alignedRect = detection.alignedRect;
    const x = alignedRect._box._x
    const y = alignedRect._box._y
    const boxWidth = alignedRect._box._width
    const boxHeight = alignedRect._box._height

    return {x, y, boxWidth, boxHeight}
}