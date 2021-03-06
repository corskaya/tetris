const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 40;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_MESSAGE_SIZE = 6 * CELL_SIZE;

const CANVAS_INFO_WIDTH = 6 * CELL_SIZE;
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH + CANVAS_INFO_WIDTH;

const Cell = { I: 0, T: 1, Z: 2, S: 3, O: 4, L: 5, J: 6, Space: 7 };

const colors = [
    'rgb(64,224,208)',
    'rgb(128,0,128)',
    'rgb(255,0,0)',
    'rgb(0,255,0)',
    'rgb(255,255,0)',
    'rgb(255,165,0)',
    'rgb(0,0,255)',
    'rgb(255,255,255)'
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

const startPositions = [
    [{ x: 3, y: -2 }, { x: 3, y: -4 }, { x: 3, y: -3 }, { x: 3, y: -4 }],
    [{ x: 4, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -3 }],
    [{ x: 4, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -3 }],
    [{ x: 4, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -3 }],
    [{ x: 4, y: -2 }, { x: 4, y: -2 }, { x: 4, y: -2 }, { x: 4, y: -2 }],
    [{ x: 4, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -3 }],
    [{ x: 4, y: -2 }, { x: 3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -3 }],
];

function fill(i, j, color) {
    ctx.fillStyle = color;
    ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function fillWithCoordinates(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(y, x, CELL_SIZE, CELL_SIZE);
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
            }
        }
    }
}

function drawBorder() {
    stroke(0, 0, 'rgb(0, 0, 0)', CANVAS_WIDTH, CANVAS_HEIGHT);
    stroke(0, COLS, 'rgb(0, 0, 0)', CANVAS_INFO_WIDTH, CANVAS_HEIGHT);
}

function drawNextLabel() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT', CANVAS_WIDTH + CANVAS_INFO_WIDTH / 2, 50);
}

function drawNextShape() {
    ctx.clearRect(CANVAS_WIDTH, 60, CANVAS_INFO_WIDTH, 4 * CELL_SIZE + 40);
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.strokeRect(CANVAS_WIDTH + CELL_SIZE - 20, 70, 4 * CELL_SIZE + 40, 4 * CELL_SIZE + 40);
    ctx.fillStyle = 'rgb(245, 245, 245)';
    ctx.fillRect(CANVAS_WIDTH + CELL_SIZE - 20, 70, 4 * CELL_SIZE + 40, 4 * CELL_SIZE + 40);

    let shape = shapes[nextShape.code][nextShape.rotation];
    let left = shape[0].length;
    let right = 0;
    let up = shape.length;
    let bottom = 0;

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                if (j > right) right = j;
                if (j < left) left = j;
                if (i > bottom) bottom = i;
                if (i < up) up = i;
            }
        }
    }

    let shapeHeight = (bottom - up + 1) * CELL_SIZE;
    let shapeWidth = (right - left + 1) * CELL_SIZE;
    let marginUp = (CELL_SIZE * 4 - shapeHeight) / 2;
    let marginLeft = (CANVAS_INFO_WIDTH - shapeWidth) / 2;

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                fillWithCoordinates(90 + marginUp + (i - up) * CELL_SIZE, CANVAS_WIDTH + marginLeft + (j - left) * CELL_SIZE, colors[nextShape.code]);
            }
        }
    }
}

function drawScoreLabel() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCORE', CANVAS_WIDTH + CANVAS_INFO_WIDTH / 2, 4 * CELL_SIZE + 160);
}

function drawScore() {
    ctx.clearRect(CANVAS_WIDTH, 4 * CELL_SIZE + 160, CANVAS_INFO_WIDTH, 60);
    ctx.fillStyle = 'rgb(55, 55, 55)';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, CANVAS_WIDTH + 120, 4 * CELL_SIZE + 220);
}

function initShape() {
    getNextShape();
    getCurrentShape();
}

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

function printArea() {
    drawArea();
    drawShape();
    drawBorder();
}

function keydown(e) {
    if (isGameOver) {
        if (e.code !== "KeyR") {
            return;
        }
        restartGame();
        return;
    }

    if (isPaused && e.code !== "KeyP") {
        return;
    }

    if (detectCollision(e.code)) {
        return;
    }

    switch (e.code) {
        case "ArrowDown":
            currentShape.y++;
            break;
        case "ArrowLeft":
            currentShape.x--;
            break;
        case "ArrowRight":
            currentShape.x++;
            break;
        case "ArrowUp":
            currentShape.rotation = (currentShape.rotation + 1) % 4;
            break;
        case "Space":
            currentShape.rotation = (currentShape.rotation + 3) % 4;
            break;
        case "KeyP":
            pauseGame();
            return;
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
    let code = currentSet.pop();
    let rotation = Math.floor(Math.random() * 4);
    let startPosition = startPositions[code][rotation];

    nextShape = { x: startPosition.x, y: startPosition.y, code, rotation };
    drawNextShape();
}

function getCurrentShape() {
    currentShape = { x: nextShape.x, y: nextShape.y, code: nextShape.code, rotation: nextShape.rotation };

    if (currentSet.length === 0) {
        currentSet = createSet();
    }

    getNextShape();
    if (area !== undefined) {
        keydown({ code: "ArrowDown" });
    }
}

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
                    if (newI >= ROWS || (newJ >= 0 && newJ < COLS && newI >= 0 && area[newI][newJ] !== Cell.Space)) {
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
                    if (newI < 0) {
                        break;
                    }
                    let newJ = i + x + direction[1];
                    if (newJ < 0 || newJ >= COLS) {
                        return true;
                    }
                    if (newI >= ROWS || (direction[0] > 0 && area[newI][newJ] !== Cell.Space)) {
                        freezeShape();
                        getCurrentShape();
                        return true;
                    }
                    if (area[newI][newJ] !== Cell.Space) {
                        return true;
                    }
                }
            }
        }

        let cells = [];
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    let x1 = i + y + direction[0];
                    let y1 = j + x + direction[1];
                    if (x1 >= 0) {
                        cells.push({ x: x1, y: y1 });
                    }
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
                const i1 = i + currentShape.y;
                const j1 = j + currentShape.x;
                if (i1 < 0) {
                    gameOver();
                    return;
                }
                area[i1][j1] = currentShape.code;
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

    let blocks = ROWS - remainingBlocks.length;
    for (let i = blocks - 1; i >= 0; i--) {
        let newSpaceBlock = [];
        for (let j = 0; j < COLS; j++) {
            newSpaceBlock.push(Cell.Space);
        }
        area.unshift(newSpaceBlock);
    }

    if (blocks > 0) {
        score += (2 ** blocks - 1) * 100;
        drawScore();
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(timer);

    const startHeight = (CANVAS_HEIGHT - CANVAS_MESSAGE_SIZE) / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, startHeight, CANVAS_WIDTH, CANVAS_MESSAGE_SIZE);
    ctx.font = '48px serif';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, startHeight + 60);
    ctx.fillText('Score: ' + score, CANVAS_WIDTH / 2, startHeight + 135);
    ctx.font = '36px serif';
    ctx.fillText('Press "R" to restart', CANVAS_WIDTH / 2, startHeight + 210);
}

function pauseGame() {
    if (isPaused) {
        isPaused = false;
        timer = setInterval(refreshScreen, interval);
    } else {
        gamePaused();
    }
}

function gamePaused() {
    isPaused = true;
    clearInterval(timer);

    const startHeight = (CANVAS_HEIGHT - CANVAS_MESSAGE_SIZE) / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, startHeight, CANVAS_WIDTH, CANVAS_MESSAGE_SIZE);
    ctx.font = '48px serif';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('GAME PAUSED', CANVAS_WIDTH / 2, startHeight + 60);
    ctx.font = '36px serif';
    ctx.fillText('Press "P" to resume', CANVAS_WIDTH / 2, startHeight + 210);
}

let area;
let currentSet;
let nextSet;
let currentShape;
let nextShape;
let isGameOver;
let isPaused;
let score;
let timer;
let interval;

function restartGame() {
    isGameOver = false;
    isPaused = false;
    currentSet = createSet();
    nextSet = createSet();
    initShape();
    initArea();
    printArea();
    score = 0;
    drawScore();
    interval = 1000;
    timer = setInterval(refreshScreen, interval);
}

document.addEventListener('keydown', keydown);

window.onload = () => {
    restartGame();
    drawNextLabel();
    drawScoreLabel();
}
