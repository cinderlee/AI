import Heap from './heap.js'
import TileBoard from './tileBoard.js'

const cardNum = 9; 
const col = 3;

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

function createBoard(boardType, boardDiv){
    for (let count = 0; count < cardNum; count++){
        if (count % col === 0 && count !== 0){
            boardDiv.appendChild(document.createElement("br"));
        }
        const cardBox = document.createElement("div");
        cardBox.setAttribute('id', `${boardType}box${count}`);
        if(boardType !== 'animate'){
            const inputBox = document.createElement("input");
            inputBox.setAttribute('type', 'text');
            inputBox.setAttribute('id', `${boardType}Input${count}`)
            cardBox.appendChild(inputBox);
        }
        boardDiv.append(cardBox)
    }
}

function fetchBoardValues(boardType){
    const boardVals = [];
    let row = [];
    let zeroPos;
    for (let count = 0; count < cardNum; count++){
        const inputCard = document.querySelector(`#${boardType}Input${count}`)
        if (inputCard.value.trim() === ''){
            return 'Empty cell detected.'
        }
        row.push(parseInt(inputCard.value))
        if (row[row.length - 1] === 0){
            const r = boardVals.length;
            const c = count % col;
            zeroPos = [r, c];
        }
        if (count % col === col - 1){
            boardVals.push(row);
            row = []
        }
    }
    return [boardVals, zeroPos];
}

async function animateTiles(zeroId, otherId, direction, goalBoard){
    const zeroBox = document.getElementById(`animatebox${zeroId}`);
    const otherBox = document.getElementById(`animatebox${otherId}`)
    console.log(zeroId, otherId)
    let pos = 0;
    const id = setInterval(frame, 10);
    
    
    zeroBox.setAttribute('id',`animatebox${otherId}`)
    otherBox.setAttribute('id', `animatebox${zeroId}`)

    const otherRow = Math.floor(zeroId/3)
    const otherCol = zeroId % 3
    const zeroRow = Math.floor(otherId / 3)
    const zeroCol = otherId % 3;

    const otherVal = parseInt(otherBox.firstChild.nodeValue)
    if (goalBoard [otherRow][otherCol] === otherVal){
        otherBox.style.backgroundColor = '#b3e6b3'
    }
    else{
        otherBox.style.backgroundColor = '#ffb3b3'
    }
    if (goalBoard [zeroRow][zeroCol] === 0){
        zeroBox.style.backgroundColor = '#b3e6b3'
    }
    else{
        zeroBox.style.backgroundColor = '#ffb3b3'
    }
    console.log(otherVal)

    return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });

    function frame() {
        if (pos == 100) {
            clearInterval(id);
        } else {
            pos++;
            if (direction === 'U'){
                const zeroPos = parseInt(zeroBox.style.top.replace('px', ''))
                const otherPos = parseInt(otherBox.style.top.replace('px', ''))
                zeroBox.style.top = `${zeroPos - 1}px`
                otherBox.style.top = `${otherPos + 1}px`
            }
            else if (direction === 'D'){
                const zeroPos = parseInt(zeroBox.style.top.replace('px', ''))
                const otherPos = parseInt(otherBox.style.top.replace('px', ''))
                zeroBox.style.top = `${zeroPos + 1}px`
                otherBox.style.top = `${otherPos - 1}px`
            }
            else if (direction === 'L'){
                const zeroPos = parseInt(zeroBox.style.left.replace('px', ''))
                const otherPos = parseInt(otherBox.style.left.replace('px', ''))
                zeroBox.style.left = `${zeroPos - 1}px`
                otherBox.style.left = `${otherPos + 1}px`
            }
            else{
                const zeroPos = parseInt(zeroBox.style.left.replace('px', ''))
                const otherPos = parseInt(otherBox.style.left.replace('px', ''))
                zeroBox.style.left = `${zeroPos + 1}px`
                otherBox.style.left = `${otherPos - 1}px`
            }
        } 
    }
}

async function animationHandler(zeroId, path, goalBoard) {
    const animateBtnContainer = document.querySelector('.animateBtn')
    animateBtnContainer.setAttribute('style', 'display:none');
    for (const element of path){
        await animateTiles(zeroId, ...element, goalBoard)
        zeroId = element[0]
    }
    const resetContainer = document.querySelector('.reset')
    resetContainer.setAttribute('style', 'display:inline');
}

function fetchPathCoords(startCoord, directions){
    let [r, c] = [...startCoord];
    const path = [];
    for (const elem of directions){
        if (elem === 'U'){
            r--;
        } else if(elem === 'D'){
            r++;
        } else if (elem === 'L'){
            c--
        } else{
            c++;
        }
        const idNum = r * 3 + c;
        path.push( [idNum, elem]);
    }
    return path;
}

function solveClickHandler(){
    const error_div = document.querySelector('.error-message');
    let startInfo = fetchBoardValues('start')
    let goalInfo = fetchBoardValues('goal');
    if (startInfo[0] === 'Empty cell detected.' || goalInfo[0] === 'Empty cell detected.'){
        error_div.setAttribute('style', 'display:block');
    }
    else{
        error_div.setAttribute('style', 'display:none');

        const initial = new TileBoard(...startInfo);
        const goal = new TileBoard(...goalInfo);
        initial.fn = initial.heuristic(goal);

        const result = search(initial, goal);
        const startBoard = startInfo[0]
        const goalBoard = goalInfo[0]
        const path = fetchPathCoords(startInfo[1], result[0].path)
        const animateBoard = document.querySelector('.animateBoard');
        document.querySelector('.animate').setAttribute('style', 'display:inline')
        document.querySelector('.start').setAttribute('style', 'display:none')
        createBoard('animate', animateBoard)
        for (let i = 0; i < 9; i++){
            let rowVal = Math.floor(i / 3)
            let colVal = i % 3
            const containerVal = document.createTextNode(startBoard[rowVal][colVal]);
            const container = document.querySelector(`#animatebox${i}`)
            container.setAttribute('style', `top:${rowVal * 100}px;left:${(colVal * 100)}px`)

            if (startBoard[rowVal][colVal] === goalBoard[rowVal][colVal]){
                container.style.backgroundColor = '#b3e6b3'
            }
            else {
                container.style.backgroundColor = '#ffb3b3'
            }
            container.appendChild(containerVal)
        }
        
        const animateButton = document.createElement('button')
        animateButton.setAttribute('class', 'animate-btn')
        const animateText = document.createTextNode('Animate!')
        animateButton.appendChild(animateText)

        const animateBtnContainer = document.querySelector('.animateBtn')
        animateBtnContainer.appendChild(animateButton)
        
        const [startR, startC] = [...startInfo[1]]
        let zeroId = startR * 3 + startC;
        animateButton.addEventListener('click', () => animationHandler(zeroId, path, goalBoard));
    }
}

function clearBoards(){
    for (let count = 0; count < 9; count++){
        const startInput = document.querySelector(`#startInput${count}`);
        const goalInput = document.querySelector(`#goalInput${count}`);
        startInput.value = '';
        goalInput.value = '';

        const animateBox = document.querySelector(`#animatebox${count}`)
        animateBox.removeChild(animateBox.firstChild);
    }

    const animateBoard = document.querySelector('.animateBoard');
    while (animateBoard.firstChild){
        animateBoard.removeChild(animateBoard.firstChild)
    }

}

function resetHandler(){
    const animateContainer = document.querySelector('.animate')
    animateContainer.setAttribute('style', 'display:none');
    const animateBtnContainer = document.querySelector('.animateBtn')
    animateBtnContainer.setAttribute('style', 'display:inline');
    const animateButton = document.querySelector('.animate-btn');
    animateBtnContainer.removeChild(animateButton)
    
    const resetContainer = document.querySelector('.reset')
    resetContainer.setAttribute('style', 'display:none')

   clearBoards();
   const startContainer = document.querySelector('.start');
   startContainer.setAttribute('style', 'display:inline');
}

function main() {
    const startBoard = document.querySelector('.startBoard');
    createBoard('start', startBoard)

    const goalBoard = document.querySelector('.goalBoard');
    createBoard('goal', goalBoard);

    const solveButton = document.querySelector('.play-btn');
    solveButton.addEventListener('click', solveClickHandler)

    const resetButton = document.querySelector('.reset-btn')
    resetButton.addEventListener('click', resetHandler)
}

document.addEventListener('DOMContentLoaded', main);