import detectIE from 'lib/utils/detect-ie-util';

/**
* @description mark the occupied spots
* @param {Array} item grid tile
* @param {Number} row current row
* @param {Number} col current col
* @param {Array} grid flag to enable/disable dense algo
* @returns {void}
*/
function markOccupiedSpots(item, row, col, grid) {
    const spanRow = item.spanRow ? item.spanRow : 1;
    const spanCol = item.spanCol ? item.spanCol : 1;

    for (let r = row; r <= (row + (spanRow - 1)); r += 1) {
        for (let c = col; c <= (col + (spanCol - 1)); c += 1) {
            if (!grid[r]) {
                grid[r] = {};
            }
            grid[r][c] = true;
        }
    }
}

/**
* @description check if the spot is valid
* @param {Array} item grid tile
* @param {Number} row current row
* @param {Number} col current col
* @param {Array} grid flag to enable/disable dense algo
* @param {Array} maxCols max columns
* @returns {boolean} valid
*/
function checkValidSpot(item, row, col, grid, maxCols) {
    const spanRow = item.spanRow ? item.spanRow : 1;
    let spanCol = item.spanCol ? item.spanCol : 1;

    if (spanCol > maxCols) {
        spanCol = maxCols;
    }

    if (col > 1 && (col + (spanCol - 1)) > maxCols) {
        return false;
    }

    for (let r = row; r <= (row + (spanRow - 1)); r += 1) {
        for (let c = col; c <= (col + (spanCol - 1)); c += 1) {
            if (c > maxCols) {
                break;
            }
            if (!grid[r]) {
                grid[r] = {};
            }
            if (grid[r][c]) {
                return false;
            }
        }
        if (r === (row + (spanRow - 1))) {
            return true;
        }
    }
    return false;
}

/**
* @description find a valid vacant spot
* @param {Array} item grid tile
* @param {Number} row current row
* @param {Array} grid flag to enable/disable dense algo
* @param {Array} maxCols max columns
* @returns {object} spot
*/
function findVacantSpot(item, row, grid, maxCols) {
    let spot = {};

    for (let r = row; ;r += 1) {
        for (let c = 1; c <= maxCols; c += 1) {
            if (!(grid[r] && grid[r][c]) && checkValidSpot(item, r, c, grid, maxCols)) {
                spot = {
                    row: r,
                    col: c
                };
                return spot;
            }
        }
    }
}

/**
* @description assign row and column to every grid item where grid auto-alignment is not supported
* @param {Array} items grid tiles
* @param {Number} currentRow current row
* @param {Number} currentCol current col
* @param {Boolean} fluidLayout flag to enable/disable dense algo
* @param {Number} maxCols max Number of colums in grid
* @returns {Object} row and col
*/
function arrangeItems(items, currentRow, currentCol, fluidLayout, maxCols) {
    if (detectIE() && detectIE() < 16) {
        const grid = [];
        let row = currentRow;
        let col = currentCol;

        items.forEach((item) => {
            const layout = (item.layout && item.layout.split('x')) || (item.browseGridLayout && item.browseGridLayout.split('x'));

            if (layout) {
                item.spanCol = Number(layout[0]);
                item.spanRow = Number(layout[1]);
            } else {
                item.spanCol = 1;
                item.spanRow = 1;
            }

            const spot = findVacantSpot(item, row, grid, maxCols);

            markOccupiedSpots(item, spot.row, spot.col, grid);

            item.row = spot.row;
            item.col = spot.col;

            if (!fluidLayout) {
                row = spot[row];
                col = spot[col];
            }
        });

        return {
            items,
            row,
            col
        };
    }
    return false;
}

export default arrangeItems;
