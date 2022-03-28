class Tile {
    constructor(grid, [row, column]) {
        let id = `${row}-${column}`;
        this.mine = false;
        this.counter = null;
        this.row = row;
        this.column = column;
        this.grid = grid
        this.id = id;
        this.element = document.getElementById(id);
    }

    createTileElement() {
        let newElement = document.createElement('div');
        newElement.setAttribute('id', this.id);
        newElement.classList.add('tile');
        // console.log(newElement);
        return newElement;
    }

    //to tick up the counter for numbers on the grid
    countUp() {
        if (this.counter === null) {
            this.counter = 1;
        } else {
            this.counter++;
        }
        // console.log(this.counter);
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
        console.log(matrix);
        return matrix;
    }

    //Insert tile reveal function here

    //Insert recursive blank opening here
}

//class for the grid formation upon game start
class Board {
    constructor(rows, columns, mineCount = 10) {
        this.rows = rows;
        this.columns = columns;
        this.mineCount = mineCount;
        this.tiles = [];
        this.grid = [];
        this.makeGrid();
        this.makeTiles();
        this.chooseMines();
        // this.grid = [];
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
                let newTile = new Tile(this.grid, [i, j]);
                this.grid[i][j] = newTile;
                newRow.appendChild(newTile.createTileElement());
                this.tiles.push(newTile);
            }
        }
        // console.log(this.grid);
    }

    chooseMines() {
        let mineArray = [];
        while (mineArray.length < this.mineCount) {
            let mineNumber = Math.floor(Math.random() * (this.rows * this.columns));
            if (!mineArray.includes(mineNumber)) {
                mineArray.push(mineNumber);
                let mineTile = this.tiles[mineNumber];
                mineTile.mine = true;
                // console.log(mineNumber);
                mineTile.mineCounter();
            }
        }
        // console.log(mineArray);
    }
}
//the grid is in this format: grid[row][column];
// grid = Array(10).fill().map(() => (Array(10).fill('tile')));
let grid = new Board(10, 10).grid;
// console.log(grid);
// let tile = new Tile(grid, [3, 3]);
// grid[3][3] = tile;


// tile.countUp();
// tile.countUp();
// tile.matrixFormation();