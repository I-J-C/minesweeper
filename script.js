class Tile {
    constructor(grid, [row, column], Board) {
        this.mine = false;
        this.hidden = true;
        this.counter = null;
        this.row = row;
        this.column = column;
        this.grid = grid;
        this.id = `${row}-${column}`;
        this.Board = Board;
        this.createTileElement();
        this.addTileListeners();
    }

    createTileElement() {
        let newElement = document.createElement('div');
        newElement.setAttribute('id', this.id);
        newElement.classList.add('tile');
        newElement.classList.add('hidden');
        this.element = newElement;
        return this.element;
    }

    //to tick up the counter for numbers on the grid
    countUp() {
        if (this.counter === null) {
            this.counter = 1;
        } else {
            this.counter++;
        }
    }

    removeCount() {
        //this is just in case a mine tile gets a counter to prevent bugs
        this.counter = null;
    }
    //this increments the counter for numbered tiles
    mineCounter() {
        if (this.mine === true) {
            let matrix = this.matrixFormation();
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] !== undefined && matrix[i][j].mine === false) {
                        matrix[i][j].countUp();
                    }
                }
            }
        }
    }

    matrixFormation() {
        //form populated matrix
        let matrix = []
        for (let i = -1; i <= 1; i++) {
            matrix[i + 1] = [];
            for (let j = -1; j <= 1; j++) {
                if (this.grid[this.row + i] !== undefined && this.grid[this.row + i][this.column + j] !== undefined) {
                    matrix[i + 1][j + 1] = this.grid[this.row + i][this.column + j];
                }
            }
        }
        return matrix;
    }

    addTileListeners() {
        this.tileReveal();

        this.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            if (this.element.classList.contains('hidden')) {
                if (!this.element.classList.contains('flag')) {
                    this.element.classList.add('flag');
                    this.Board.flagCount--;
                } else {
                    this.element.classList.remove('flag');
                    this.tileReveal();
                    this.Board.flagCount++;
                }
            }
            this.Board.trackFlagCounter();
        }, {
            signal: this.Board.controller.signal
        });
    }

    tileReveal() {
        this.element.addEventListener('click', () => {
            if (!this.element.classList.contains('flag')) {
                //this checks for first tile clicked to populate mines
                if (this.Board.tileClicked === false) {
                    this.Board.tileClicked = true;
                    this.Board.chooseMines(this.row, this.column);
                    //Start timer here (stretch goal)
                    this.Board.startTimer();
                }
                this.element.classList.remove('hidden');
                this.hidden = false;
                this.element.classList.add('tile-content');
                if (this.mine === true) {
                    this.element.style.setProperty('--tile-bg', "url(img/mine.png)");
                    if (this.Board.mineClicked === false) {
                        this.element.classList.add('red');
                        this.Board.mineClicked = true;
                        this.Board.clickMines();
                        this.Board.controller.abort();
                        gameStatus.innerHTML = 'Loss';
                        //End timer here (stretch goal)
                        this.Board.stopTimer();
                        //add lost game function here (stretch goal)
                    }
                }
                switch (this.counter) {
                    case 1:
                        this.element.style.setProperty('--tile-bg', "url(img/one.png)");
                        break;
                    case 2:
                        this.element.style.setProperty('--tile-bg', "url(img/two.png)");
                        break;
                    case 3:
                        this.element.style.setProperty('--tile-bg', "url(img/three.png)");
                        break;
                    case 4:
                        this.element.style.setProperty('--tile-bg', "url(img/four.png)");
                        break;
                    case 5:
                        this.element.style.setProperty('--tile-bg', "url(img/five.png)");
                        break;
                    case 6:
                        this.element.style.setProperty('--tile-bg', "url(img/six.png)");
                        break;
                    case 7:
                        this.element.style.setProperty('--tile-bg', "url(img/seven.png)");
                        break;
                    case 8:
                        this.element.style.setProperty('--tile-bg', "url(img/eight.png)");
                        break;
                }
                if (!this.counter && !this.mine) {
                    this.Board.clickBlank(this.row, this.column);
                }
                let win = this.Board.checkWin();
                if (win === true) {
                    // WIN CONDITION HERE
                    gameStatus.innerHTML = 'Win!';
                    this.Board.stopTimer();
                    this.Board.controller.abort();
                }
            }
        }, {
            once: true,
            signal: this.Board.controller.signal
        });
    }

}

//class for the grid formation upon game start
class Board {
    constructor(rows = 10, columns = 10, mineCount = 10) {
        let controller = new AbortController();
        this.tileClicked = false;
        this.controller = controller;
        this.rows = rows;
        this.columns = columns;
        this.mineCount = mineCount;
        this.tiles = [];
        this.grid = [];
        this.remainingTiles = []
        this.mineClicked = false;
        this.flagCount = mineCount;
        this.flagCounter = document.getElementById('flag-counter');
        this.makeGrid();
        this.makeTiles();
        this.trackFlagCounter();
    }

    makeGrid() {
        let newGrid = []
        let counter = 0;
        for (let i = 0; i < this.rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.columns; j++) {
                newGrid[i][j] = counter;
                counter++
            }
        }
        this.grid = newGrid;
    }

    makeTiles() {
        //creating elements for the grid
        for (let i = 0; i < this.rows; i++) {
            let newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.setAttribute('id', `row${i}`);
            gridElement.appendChild(newRow);
            for (let j = 0; j < this.columns; j++) {
                let newTile = new Tile(this.grid, [i, j], this);
                this.grid[i][j] = newTile;
                newRow.appendChild(newTile.element);
                this.tiles.push(newTile);
            }
        }
        this.remainingTiles = this.tiles;
    }

    chooseMines(firstRow, firstColumn) {
        this.mineArray = [];
        while (this.mineArray.length < this.mineCount) {
            let mineNumber = Math.floor(Math.random() * (this.rows * this.columns));
            if (!this.mineArray.includes(mineNumber) && mineNumber !== (firstRow * 10 + firstColumn)) {
                this.mineArray.push(mineNumber);
                let mineTile = this.tiles[mineNumber];
                mineTile.mine = true;
                mineTile.mineCounter();
                mineTile.removeCount();
            }
        }
    }

    trackFlagCounter() {
        this.flagCounter.innerHTML = this.flagCount;
    }

    clickMines() {
        for (let i = 0; i < this.mineArray.length; i++) {
            this.tiles[this.mineArray[i]].element.click();
        }
    }

    clickBlank(row, column) {
        if (row < 0 || column < 0 || row === this.rows || column === this.columns || this.grid[row][column].traversed === true) {
            return;
        }
        this.grid[row][column].traversed = true;
        this.grid[row][column].element.click();
        //This checks for a numbered tile to stop in that direction
        if (this.grid[row][column].counter !== null) {
            return;
        }
        this.clickBlank(row + 1, column); //go down
        this.clickBlank(row - 1, column); //go up
        this.clickBlank(row, column + 1); //go right
        this.clickBlank(row, column - 1); //go left
        return;
    }

    startTimer() {
        seconds.innerHTML = 0;
        if (!this.timerID) {
            if (this.totalSeconds > 0 || !this.totalSeconds) {
                this.totalSeconds = 0;
            }
            this.timerID = setInterval(() => {
                //based on code from here: http://stackoverflow.com/questions/45808844/adding-start-stop-reset-button-for-timer
                this.totalSeconds++;
                //minute option here for later
                // minutes.innerHTML = minute;
                seconds.innerHTML = this.totalSeconds;
                
            }, 1000);
        }
    }

    stopTimer() {
        clearInterval(this.timerID);
        this.totalSeconds = null;
        this.timerID = null;
    }

    checkWin() {
        this.remainingTiles = this.tiles.filter((tile) => {
            return tile.hidden;
        });
        if (this.remainingTiles.length === this.mineArray.length) {
            return true;
        } else {
            return false;
        }
    }
}


const resetButton = document.getElementById('reset-game');
const gridElement = document.getElementById('grid');
const gameStatus = document.getElementById('game-status');
const timer = document.getElementById('timer');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

let board = new Board();

resetButton.addEventListener('click', resetGame);

function resetGame() {
    board.stopTimer();
    gridElement.innerHTML = '';
    board = new Board();
    gameStatus.innerHTML = '';
}