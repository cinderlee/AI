const Heap = require('./heap.js')
const TileBoard = require('./tileBoard.js')

function deepCopy(board){
    const copy = []
    for(const row of board){
        const copyRow = []
        for (const col of row){
            copyRow.push(col)
        }
        copy.push(copyRow)
    }
    return copy;
}

function makeMove( tile, explored, frontier ){
    if ( !tile.isExplored( explored ) ){
        let seen = false;

        for( let gen of frontier ){
            if (gen.isEqual(tile)){
                if (tile.fn < gen.fn){
                    gen.fn = tile.fn
                    gen.path = tile.path 
                    seen = true
                    frontier.heapify()
                    break
                }
            }
        }

        if (!seen){
            frontier.push(tile)
            return true
        }
    }

    return false
}

function search(initial, goal){
    const frontier = new Heap()
    frontier.push(initial)
    const explored = []
    let generated = 1
    while (true){
        if (frontier.heap.length === 0){
            return [null, generated]
        }

        const node = frontier.pop()
        if (node.isGoal(goal)){
            return [node, generated]
        }

        explored.push(node)

        const left = [node.pos[0], node.pos[1] - 1]
        const right = [node.pos[0], node.pos[1] + 1]
        const up = [node.pos[0] - 1, node.pos[1]]
        const down = [node.pos[0] + 1, node.pos[1]]

        if(left[1] !== -1){
            const board = deepCopy(node.board)
            const firstPiece = board[left[0]][left[1]]
            const secondPiece = board[left[0]][left[1] + 1]
            board[left[0]][left[1]] = secondPiece
            board[left[0]][left[1] + 1] = firstPiece

            const left_tile = new TileBoard(board, left)
            left_tile.path = [...node.path, "L"]
            left_tile.fn = left_tile.path.length + left_tile.heuristic(goal)
            if (makeMove(left_tile, explored, frontier)){
                generated += 1
            }
        }
        if ( right[1] !== 3 ){
            const board = deepCopy(node.board)
            const firstPiece = board[right[0]][right[1]]
            const secondPiece = board[right[0]][right[1] - 1]
            board[right[0]][right[1]] = secondPiece
            board[right[0]][right[1] - 1] = firstPiece
            const right_tile = new TileBoard(board, right)
            right_tile.path = [...node.path, "R"]
            right_tile.fn = right_tile.path.length + right_tile.heuristic(goal)
            if (makeMove(right_tile, explored, frontier)){
                generated += 1
            }
        }

        if (up[0] !== -1){
            const board = deepCopy(node.board)
            const firstPiece = board[up[0]][up[1]]
            const secondPiece = board[up[0] + 1][up[1]]

            board[up[0]][up[1]] = secondPiece
            board[up[0] + 1][up[1]] = firstPiece

            const up_tile = new TileBoard(board, up)
            up_tile.path = [...node.path, "U"]
            up_tile.fn = up_tile.path.length + up_tile.heuristic(goal)
            if (makeMove(up_tile, explored, frontier)){
                generated += 1
            }
        }
        if (down[0] !== 3){
            const board = deepCopy(node.board)
            const firstPiece = board[down[0]][down[1]]
            const secondPiece = board[down[0] - 1][up[1]]
            board[down[0]][down[1]] = secondPiece
            board[down[0] - 1][up[1]] = firstPiece
            
            const down_tile = new TileBoard(board, down)
            down_tile.path = [...node.path, "D"]
            down_tile.fn = down_tile.path.length + down_tile.heuristic(goal)
            if (makeMove(down_tile, explored, frontier)){
                generated += 1
            }
        }
    }
}


function main(){
    const initialBoard = [[7, 4, 3], [5, 0, 6], [2, 8, 1]]
    const goalBoard = [[1, 0, 6], [4, 2, 3], [7, 5, 8]]
    // const goalBoard = [[2, 8, 3], [0, 1, 6], [7, 5, 4]]

    const initial = new TileBoard( initialBoard, [1, 1])
    const goal = new TileBoard( goalBoard, [0, 1])
    initial.fn = initial.heuristic(goal)

    result = search(initial, goal)
    console.log(result)
}

main()