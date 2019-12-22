const Heap = require('./heap.js');
const TileBoard = require('./tileBoard.js');

function deepCopy(board){
    const copy = [];
    for(const row of board){
        const copyRow = [];
        for (const col of row){
            copyRow.push(col);
        }
        copy.push(copyRow);
    }
    return copy;
}

function makeMove( tile, explored, frontier ){
    if ( !tile.isExplored( explored ) ){
        let seen = false;

        for( const gen of frontier ){
            if (gen.isEqual(tile)){
                if (tile.fn < gen.fn){
                    gen.fn = tile.fn;
                    gen.path = tile.path; 
                    seen = true;
                    frontier.heapify();
                    break;
                }
            }
        }

        if (!seen){
            frontier.push(tile);
            return true;
        }
    }

    return false;
}

function search(initial, goal){
    const frontier = new Heap();
    frontier.push(initial);
    const explored = [];
    let generated = 1;
    const whileBool = true;
    while (whileBool){
        if (frontier.heap.length === 0){
            return [null, generated];
        }

        const node = frontier.pop();
        if (node.isGoal(goal)){
            return [node, generated];
        }

        explored.push(node);

        const left = [node.pos[0], node.pos[1] - 1];
        const right = [node.pos[0], node.pos[1] + 1];
        const up = [node.pos[0] - 1, node.pos[1]];
        const down = [node.pos[0] + 1, node.pos[1]];

        if(left[1] !== -1){
            const board = deepCopy(node.board);
            const firstPiece = board[left[0]][left[1]];
            const secondPiece = board[left[0]][left[1] + 1];
            board[left[0]][left[1]] = secondPiece;
            board[left[0]][left[1] + 1] = firstPiece;

            const leftTile = new TileBoard(board, left);
            leftTile.path = [...node.path, "L"];
            leftTile.fn = leftTile.path.length + leftTile.heuristic(goal);
            if (makeMove(leftTile, explored, frontier)){
                generated += 1;
            }
        }
        if ( right[1] !== 3 ){
            const board = deepCopy(node.board);
            const firstPiece = board[right[0]][right[1]];
            const secondPiece = board[right[0]][right[1] - 1];
            board[right[0]][right[1]] = secondPiece;
            board[right[0]][right[1] - 1] = firstPiece;
            const rightTile = new TileBoard(board, right);
            rightTile.path = [...node.path, "R"];
            rightTile.fn = rightTile.path.length + rightTile.heuristic(goal);
            if (makeMove(rightTile, explored, frontier)){
                generated += 1;
            }
        }

        if (up[0] !== -1){
            const board = deepCopy(node.board);
            const firstPiece = board[up[0]][up[1]];
            const secondPiece = board[up[0] + 1][up[1]];

            board[up[0]][up[1]] = secondPiece;
            board[up[0] + 1][up[1]] = firstPiece;

            const upTile = new TileBoard(board, up);
            upTile.path = [...node.path, "U"];
            upTile.fn = upTile.path.length + upTile.heuristic(goal);
            if (makeMove(upTile, explored, frontier)){
                generated += 1;
            }
        }
        if (down[0] !== 3){
            const board = deepCopy(node.board);
            const firstPiece = board[down[0]][down[1]];
            const secondPiece = board[down[0] - 1][up[1]];
            board[down[0]][down[1]] = secondPiece;
            board[down[0] - 1][up[1]] = firstPiece;
            
            const downTile = new TileBoard(board, down);
            downTile.path = [...node.path, "D"];
            downTile.fn = downTile.path.length + downTile.heuristic(goal);
            if (makeMove(downTile, explored, frontier)){
                generated += 1;
            }
        }
    }
}


function main(){
    const initialBoard = [[7, 4, 3], [5, 0, 6], [2, 8, 1]];
    const goalBoard = [[1, 0, 6], [4, 2, 3], [7, 5, 8]];
    // const goalBoard = [[2, 8, 3], [0, 1, 6], [7, 5, 4]]

    const initial = new TileBoard( initialBoard, [1, 1]);
    const goal = new TileBoard( goalBoard, [0, 1]);
    initial.fn = initial.heuristic(goal);

    const result = search(initial, goal);
    console.log(result);
}

main();