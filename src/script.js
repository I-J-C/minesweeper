class Tile {
    constructor(grid, [row, column], mine = false) {
        let id = `${row}-${column}`;
        this.mine = mine;
        this.counter = null;
        this.row = row;
        this.column = column;
        this.grid = grid
        this.id = id;
        this.element = document.getElementById(id);
    }

    //to tick up the counter for numbers on the grid
    countUp() {
        if (this.counter === null) {
            this.counter = 1;
        } else {
            this.counter++;
        }
        console.log(this.counter);
    }

    //this increments the counter for numbered tiles
    mineCounter() {
        if (this.mine === true) {
            let matrix = this.matrixFormation();
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j].mine === false) {
                        matrix[i][j].countUp();
                    }
                }
            }
        }
    }


    matrixFormation() {
        //form empty matrix
        let matrix3 = Array(3).fill().map(() => (Array(3)));
        // console.log(matrix3);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                matrix3[i + 1][j + 1] = this.grid[this.row + i][this.column + j];
            }
        }
        console.log(matrix3);
        return matrix3;
    }
}
//the grid is in this format: grid[row][column];
grid = Array(10).fill().map(() => (Array(10).fill('tile')));
console.log(grid);
let tile = new Tile(grid, [3, 3]);
grid[3][3] = tile;

// tile.countUp();
// tile.countUp();
// tile.matrixFormation();