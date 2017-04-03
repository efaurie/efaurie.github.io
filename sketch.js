let sw = 5;
let sep = 5;

let points = [];

let scale = null;
let maxVal = null;
let minVal = null;

let pointsInFrame = null;
let table = null;

function setScale() {
    let maxValue = null;
    let minValue = null;

    points.forEach(function(element) {
        if(maxValue == null) {
            maxValue = element.high.y;
        } else {
            maxValue = max(element.high.y, maxValue);
        }

        if(minValue == null) {
            minValue = element.low.y;
        } else {
            minValue = min(element.low.y, minValue);
        }
    });

    scale = (windowHeight - 20) / (maxValue - minValue);
    maxVal = maxValue;
    minVal = minValue;
}

function DataPoint(y, subType) {
    this.iteration = frameCount;

    this.x = windowWidth - 25;
    this.y = y;

    this.subType = subType

    this.scaleY = function() {
        if(this.subType === 'high') {
            scaledY = scale * (maxVal - this.y)
        } else {
            scaledY = (windowHeight - 20) + (scale * (minVal - this.y))
        }
        return Math.floor(scaledY);
    }

    this.display = function() {
        this.x = this.x - sw - sep;
        point(this.x, this.scaleY());
    }
}

function preload() {
    table = loadTable('./data/CBOE_VX1.csv', 'csv', 'header');
}

function getRow(i) {
    let element = table.rows[i].arr;

    return {
        tradeDate: element[0],
        high: parseFloat(element[2]),
        low: parseFloat(element[3])
    }
}

function setup() {
    pointsInFrame = Math.floor((windowWidth - 20)/sw);
    createCanvas(windowWidth - 20, windowHeight - 20);
    frameRate(35);
    strokeWeight(2);
    stroke(0, 0, 0);
}

function addPoint() {
    tempPoints = {};

    let row = getRow(frameCount-1);

    tempPoints.high = new DataPoint(row.high * 100, 'high');
    tempPoints.low = new DataPoint(row.low * 100, 'low');

    points.push(tempPoints);
}

function draw() {
    background(255);

    if(frameCount < (table.rows.length)) {
        addPoint();
        setScale();

        if(points.length > pointsInFrame) {
            points.splice(0, points.length - pointsInFrame);
        }

        for(var i = 0; i < points.length; i++) {
            push();
            strokeWeight(sw);
            stroke(0, 153, 51);
            points[i].high.display();
            if(i > 0) {
                strokeWeight(1);
                line(points[i-1].high.x, points[i-1].high.scaleY(), points[i].high.x, points[i].high.scaleY())
            }
            pop();

            push();
            strokeWeight(sw);
            stroke(255, 0, 0);
            points[i].low.display();
            if(i > 0) {
                strokeWeight(1);
                line(points[i-1].low.x, points[i-1].low.scaleY(), points[i].low.x, points[i].low.scaleY())
            }
            pop();
        }
    } else {
        noLoop();
    }
}