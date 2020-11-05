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
    [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    ],
    [
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
    ],
    [
        [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
        [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
        [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
    ],
    [
        [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
        [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
    ],
    [
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]]
    ],
    [
        [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
        [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
        [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
    ],
    [
        [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
        [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
    ]
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
    if (area[i][j] === Cell.Space) {
        stroke(i, j, 'rgb(200, 200, 200)');
    }
}

function drawShape() {
    let shape = shapes[currentShape.code][currentShape.rotation];

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                fill(i + currentShape.y, j + currentShape.x, colors[currentShape.code]);
                // stroke(i + currentShape.y, j + currentShape.x, 'rgb(100, 100, 100)');
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
    if (detectCollision(e.code)) {
        return;
    }

    switch (e.code) {
        case "ArrowUp":
            rotateClockwise();
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
            rotateCounterClockwise();
            break;
    }

    printArea();
}

function rotateClockwise() {
    currentShape.rotation = (currentShape.rotation + 1) % 4;
}

function rotateCounterClockwise() {
    currentShape.rotation = (currentShape.rotation + 3) % 4;
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

function initShape() {
    getNextShape();
    getCurrentShape();
}

function getNextShape() {
    nextShape = { x: 4, y: 0, code: currentSet.pop(), rotation: Math.floor(Math.random() * 4) };
}

function getCurrentShape() {
    currentShape = { x: 4, y: 0, code: nextShape.code, rotation: nextShape.rotation };

    if (currentSet.length === 0) {
        currentSet = createSet();
    }

    getNextShape();
    if (area !== undefined) {
        keydown({ code: "ArrowDown" });
    }
}

document.addEventListener('keydown', keydown);

initShape();
initArea();
printArea();

var t = setInterval(refreshScreen, 800);

function refreshScreen() {
    keydown({ code: "ArrowDown" });
}

function detectCollision(code) {
    let direction = [0, 0];
    let isRotation = false;

    switch (code) {
        case "ArrowDown":
            direction = [1, 0];
            break;
        case "ArrowLeft":
            direction = [0, -1];
            break;
        case "ArrowRight":
            direction = [0, 1];
            break;
        case "ArrowUp":
            isRotation = true;
            break;
        case "Space":
            isRotation = true;
            break;
    }

    let x = currentShape.x;
    let y = currentShape.y;

    if (isRotation) {
        let rotation = code === "ArrowUp" ? 1 : -1;
        let rotatedShape = shapes[currentShape.code][(currentShape.rotation + rotation + 4) % 4];
        let maxLeft = 0;
        let maxRight = 0;
        for (let i = 0; i < rotatedShape.length; i++) {
            for (let j = 0; j < rotatedShape[i].length; j++) {
                if (rotatedShape[i][j] === 1) {
                    let newI = i + y;
                    let newJ = j + x;
                    if (newI >= ROWS || (newJ >= 0 && newJ < COLS && area[newI][newJ] !== Cell.Space)) {
                        return true;
                    }
                    if (newJ < 0) {
                        let left = 0 - newJ;
                        if (left > maxLeft) maxLeft = left;
                    } if (newJ >= COLS) {
                        let right = newJ - COLS + 1;
                        if (right > maxRight) maxRight = right;
                    }
                }
            }
        }
        if (maxLeft > 0 || maxRight > 0) {
            for (let i = 0; i < rotatedShape.length; i++) {
                for (let j = 0; j < rotatedShape[i].length; j++) {
                    if (rotatedShape[i][j] === 1) {
                        let newI = i + y + direction[0];
                        let newJ = j + x + (maxLeft > 0 ? maxLeft : -maxRight);
                        if (area[newI][newJ] !== Cell.Space) {
                            return true;
                        }
                    }
                }
            }
            currentShape.x += maxLeft;
            currentShape.x -= maxRight;
        }
    } else {
        let shape = shapes[currentShape.code][currentShape.rotation];
        for (let i = 0; i < shape[0].length; i++) {
            for (let j = shape.length - 1; j >= 0; j--) {
                if (shape[j][i] === 1) {
                    let newI = j + y + direction[0];
                    let newJ = i + x + direction[1];
                    if (newJ < 0 || newJ >= COLS) {
                        return true;
                    }
                    if (newI >= ROWS || area[newI][newJ] !== Cell.Space) {
                        freezeShape();
                        getCurrentShape();
                        return true;
                    }
                }
            }
        }

        let cells = [];
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    cells.push({ x: i + y + direction[0], y: j + x + direction[1] });
                }
            }
        }

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            if (cell.y < 0 || cell.y >= COLS) {
                return true;
            }
            if (area[cell.x][cell.y] !== Cell.Space) {
                return true;
            }
        }

        return false;
    }
}

function freezeShape() {
    let shape = shapes[currentShape.code][currentShape.rotation];
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                area[i + currentShape.y][j + currentShape.x] = currentShape.code;
            }
        }
    }

    let remainingBlocks = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (area[i][j] === Cell.Space) {
                remainingBlocks.push(i);
                break;
            }
        }
    }

    for (let i = ROWS - 1; i >= 0; i--) {
        if (remainingBlocks.indexOf(i) === -1) {
            area.splice(i, 1);
        }
    }

    for (let i = ROWS - remainingBlocks.length - 1; i >= 0; i--) {
        let newSpaceBlock = [];
        for (let j = 0; j < COLS; j++) {
            newSpaceBlock.push(Cell.Space);
        }
        area.unshift(newSpaceBlock);
    }
}