const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 40;
const CANVAS_HEIGHT = canvas.height = ROWS * CELL_SIZE;
const CANVAS_WIDTH = canvas.width = COLS * CELL_SIZE;
const Cell = { I: 0, T: 1, Z: 2, S: 3, O: 4, L: 5, J: 6, Space: 7 }; Object.freeze(Cell);

let area;
let currentSet = createSet();
let nextSet = createSet();
let currentShape;
let nextShape;

const colors = [
    'rgb(64,224,208)',
    'rgb(128,0,128)',
    'rgb(255,0,0)',
    'rgb(0,255,0)',
    'rgb(255,255,0)',
    'rgb(255,165,0)',
    'rgb(0,0,255)',
    'rgb(255, 255, 255)'
];

const shapes = [
    [[1], [1], [1], [1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1], [1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[0, 1], [0, 1], [1, 1]]
];

function initArea() {
    area = [];
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLS; j++) {
            row.push(Cell.Space);
        }
        area.push(row);
    }
}

function fill(i, j, color) {
    ctx.fillStyle = color;
    ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function stroke(i, j, color, width = CELL_SIZE, height = CELL_SIZE) {
    ctx.strokeStyle = color;
    ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, width, height);
}

function drawArea() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            drawCell(i, j);
        }
    }
}

function drawCell(i, j) {
    fill(i, j, colors[area[i][j]]);
    stroke(i, j, area[i][j] !== Cell.Space ? 'rgb(0, 0, 0)' : 'rgb(200, 200, 200)');
}

function drawShape() {
    let shape = shapes[currentShape.code];

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                fill(i + currentShape.y, j + currentShape.x, colors[currentShape.code]);
                stroke(i + currentShape.y, j + currentShape.x, 'rgb(100, 100, 100)');
            }
        }
    }
}

function drawBorder() {
    stroke(0, 0, 'rgb(0, 0, 0)', CANVAS_WIDTH, CANVAS_HEIGHT);
}

function printArea() {
    drawArea();
    drawShape();
    drawBorder();
}

function keydown(e) {
    switch (e.code) {
        case "ArrowUp":
            currentShape.y--
            break;
        case "ArrowDown":
            currentShape.y++;
            break;
        case "ArrowLeft":
            currentShape.x--;
            break;
        case "ArrowRight":
            currentShape.x++;
            break;
        case "Space":
            getNextShape();
            break;
    }

    printArea();
}

function createSet() {
    let set = [Cell.I, Cell.T, Cell.Z, Cell.S, Cell.O, Cell.L, Cell.J];
    shuffleArray(set);
    return set;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getNextShape() {
    if (nextShape === undefined) {
        nextShape = { x: 4, y: 0, code: currentSet.pop() };
    }
    currentShape = { x: 4, y: 0, code: nextShape.code };
    if (currentSet.length === 0) {
        currentSet = createSet();
    }
    nextShape = { x: 4, y: 0, code: currentSet.pop() };
}

document.addEventListener('keydown', keydown);

getNextShape();
initArea();
printArea();
