class Tile {
    constructor(grid, [row, column]) {
        let id = `${row}-${column}`;
        this.mine = false;
        this.counter = null;
        this.row = row;
        this.column = column;
        this.grid = grid
        this.id = id;
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

    // tileContent() {
    //     //might want to look into ::before content to hide the content from devtools? idk.
    //     if (this.mine === true) {
    //         //insert mine image here, but using M for now
    //         this.element.innerHTML = 'M';
    //     } else if (this.counter !== null) {
    //         //insert counter value in box
    //         this.element.innerHTML = this.counter;
    //     }
    // }

    //Insert tile reveal function here
    addTileListeners() {
        this.tileReveal();

        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.element.classList.contains('hidden')) {
                if (!this.element.classList.contains('flag')) {
                    this.element.classList.add('flag');
                } else {
                    this.element.classList.remove('flag');
                    this.tileReveal();
                }
            }
        });
    }

    tileReveal() {
        this.element.addEventListener('click', ()=> {
            if(!this.element.classList.contains('flag')){
                this.element.classList.remove('hidden');
                this.element.classList.add('tile-content');
                if(this.mine === true){
                    this.element.style.setProperty('--tile-bg', "url(img/mine.png)");
                    // this.element.classList.add('red');
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
            }
        }, {once: true});
    }


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
        this.populateElements();
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
                newRow.appendChild(newTile.element);
                this.tiles.push(newTile);
                // console.log(newTile.element);
            }
        }
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
                mineTile.removeCount();
            }
        }
        // console.log(mineArray);
    }

    //can use this function to add the event listeners
    populateElements() {
        for (let i = 0; i < this.tiles.length; i++) {
            // this.tiles[i].tileContent();
        }
    }
}

let grid = new Board(10, 10).grid;