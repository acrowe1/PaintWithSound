let x;
let y;
let dragging = false;
let colors;
let selectedColor;
const size = 10;
let synth;
let clearButton;
let saveButton;

function setup() {
  createCanvas(1000, 1000);
  selectedColor = color('white');
  synth = new Tone.Synth().toDestination();

  colors = [new ColorSquare(0, 0, color('red')),
            new ColorSquare(0, 20, color('orange')),
            new ColorSquare(0, 40, color('yellow')),
            new ColorSquare(0, 60, color('limegreen')),
            new ColorSquare(0, 80, color('lightblue')),
            new ColorSquare(0, 100, color('blue')),
            new ColorSquare(0, 120, color('magenta')),
            new ColorSquare(0, 140, color('brown')),
            new ColorSquare(0, 160, color('white')),
            new ColorSquare(0, 180, color('black'))];

  clearButton = createButton('Clear');
  clearButton.position(1, 200);
  clearButton.mousePressed(clearCanvas);

  saveButton = createButton('Save');
  saveButton.position(1, 225);
  saveButton.mousePressed(saveCanvasToFile);
}

function draw() {
  for (let i = 0; i < colors.length; i++) {
    colors[i].draw();
  }

  stroke(selectedColor);
  fill(selectedColor);
  
  x = mouseX;
  y = mouseY;
  if (dragging) {
    circle(x, y, size);
    playNote();
  }
}

function playNote() {
  synth.triggerRelease(); // Stop any active notes
  let note = map(mouseY, 0, height, 48, 72);
  let velocity = map(mouseX, 0, width, 0.2, 1);
  synth.triggerAttackRelease(Tone.Frequency(note, "midi"), "8n", undefined, velocity);
}


function mousePressed() {
  dragging = true;
  
  let isInColorSquare = false;
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].contains(mouseX, mouseY)) {
      selectedColor = colors[i].fill;
      isInColorSquare = true;
      break;
    }
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging) {
    x += mouseX - pmouseX;
    y += mouseY - pmouseY;
  }
}

function clearCanvas() {
  background(255);
}

function saveCanvasToFile() {
  saveCanvas('painting', 'png');
}

class ColorSquare {
  constructor(x, y, fill) {
    this.x = x;
    this.y = y;
    this.fill = fill;
  }

  draw() {
    stroke(225);
    fill(this.fill);
    square(this.x, this.y, 20);
  }

  contains(x, y) {
    let insideX = x >= this.x && x <= this.x + 100;
    let insideY = y >= this.y && y <= this.y + 20;
    return insideX && insideY;
  }
}
