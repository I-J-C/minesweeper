class Tile {
    constructor(grid, [row, column], Board) {
        this.mine = false;
        this.hidden = true;
        this.counter = null;
        this.row = row;
        this.column = column;
        this.grid = grid
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
                if (this.grid[this.row + i] !== undefined && this.grid[this.column + j] !== undefined) {
                    matrix[i + 1][j + 1] = this.grid[this.row + i][this.column + j];
                    //mark center tile somehow?
                }
            }
        }
        // console.log(matrix);
        return matrix;
    }

    addTileListeners() {
        this.tileReveal();

        this.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            // let flagCount = this.Board.mineCount;
            if (this.element.classList.contains('hidden')) {
                if (!this.element.classList.contains('flag')) {
                    this.element.classList.add('flag');
                    // flagCount--;
                } else {
                    this.element.classList.remove('flag');
                    this.tileReveal();
                    // flagCount++;
                }
            }
            //Use flagcount to update the mine counter (in stretch goals)
        }, {
            signal: this.Board.controller.signal
        });
    }

    tileReveal() {
        const controller = new AbortController();
        this.element.addEventListener('click', () => {
            if (!this.element.classList.contains('flag')) {
                //this checks for first tile clicked to populate mines
                if (this.Board.tileClicked === false) {
                    this.Board.tileClicked = true;
                    this.Board.chooseMines(this.row, this.column);
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
                        // console.log('you lose')
                        //End timer here (stretch goal)
                        //ADD LOST GAME FUNCTION HERE
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
                    // console.log('you win!')
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
        this.makeGrid();
        this.makeTiles();
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
        let gridElement = document.getElementById('grid');
        for (let i = 0; i < this.rows; i++) {
            let newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.setAttribute('id', `row${i}`);
            gridElement.appendChild(newRow);
            // console.log(newRow);
            for (let j = 0; j < this.columns; j++) {
                let newTile = new Tile(this.grid, [i, j], this);
                this.grid[i][j] = newTile;
                newRow.appendChild(newTile.element);
                this.tiles.push(newTile);
                // console.log(newTile.element);
            }
        }
        this.remainingTiles = this.tiles;
    }

    chooseMines(firstRow, firstColumn) {
        this.mineArray = [];
        while (this.mineArray.length < this.mineCount) {
            let mineNumber = Math.floor(Math.random() * (this.rows * this.columns));
            if (!this.mineArray.includes(mineNumber) && mineNumber !== (firstRow*10 + firstColumn)) {
                this.mineArray.push(mineNumber);
                let mineTile = this.tiles[mineNumber];
                mineTile.mine = true;
                mineTile.mineCounter();
                mineTile.removeCount();
            }
        }
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
new Board();

const resetButton = document.getElementById('reset-game');
const gridElement = document.getElementById('grid');

resetButton.addEventListener('click', () => {
    gridElement.innerHTML = '';
    new Board();
    //start timer here (stretch goal)
});