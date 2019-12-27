import Heap from './heap.js';
import TileBoard from './tileBoard.js';
import { animateTiles } from './animation.js';
import { deepCopy, hide, show, sideVal, borderVal } from './utils.js';

const cardNum = 9; 
const col = 3;

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

function createInputBoard(boardType, boardDiv){
    for (let count = 0; count < cardNum; count++){
        if (count % col === 0 && count !== 0){
            boardDiv.appendChild(document.createElement("br"));
        }
        const cardBox = document.createElement("div");
        cardBox.setAttribute('id', `${boardType}box${count}`);
        const inputBox = document.createElement("input");
        inputBox.setAttribute('type', 'text');
        inputBox.setAttribute('id', `${boardType}Input${count}`)
        cardBox.appendChild(inputBox);
        boardDiv.append(cardBox)
    }
}

function createAnimateBoard(boardDiv, startBoard, goalBoard){
    for (let count = 0; count < cardNum; count++){
        if (count % col === 0 && count !== 0){
            boardDiv.appendChild(document.createElement("br"));
        }
        const cardBox = document.createElement("div");
        cardBox.setAttribute('id', `animatebox${count}`);
        
        let rowVal = Math.floor(count / 3)
        let colVal = count % 3
        const containerVal = document.createTextNode(startBoard[rowVal][colVal]);
        cardBox.setAttribute('style', `top:${rowVal * (sideVal + 2 * borderVal)}px;left:${(colVal * (sideVal + 2 * borderVal))}px`)

        if (startBoard[rowVal][colVal] === goalBoard[rowVal][colVal]){
            cardBox.style.backgroundColor = '#b3e6b3'
        }
        else {
            cardBox.style.backgroundColor = '#ffb3b3'
        }
        cardBox.appendChild(containerVal)
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

async function animationHandler(zeroId, path, goalBoard) {
    const animateBtnContainer = document.querySelector('.animateBtn')
    hide(animateBtnContainer)
    for (const element of path){
        await animateTiles(zeroId, ...element, goalBoard)
        zeroId = element[0]
    }
    const resetContainer = document.querySelector('.reset')
    show(resetContainer)
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
    const errorDiv = document.querySelector('.error-message');
    let startInfo = fetchBoardValues('start')
    let goalInfo = fetchBoardValues('goal');
    if (startInfo[0] === 'Empty cell detected.' || goalInfo[0] === 'Empty cell detected.'){
        errorDiv.setAttribute('style', 'display:block');
    }
    else{
        hide(errorDiv)

        const initial = new TileBoard(...startInfo);
        const goal = new TileBoard(...goalInfo);
        initial.fn = initial.heuristic(goal);

        const result = search(initial, goal);
        const startBoard = startInfo[0]
        const goalBoard = goalInfo[0]
        const path = fetchPathCoords(startInfo[1], result[0].path)
        const animateBoard = document.querySelector('.animateBoard');
        show(document.querySelector('.animate'))
        hide(document.querySelector('.start'))
        createAnimateBoard(animateBoard, startBoard, goalBoard)
        
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
    hide(document.querySelector('.animate'))
    const animateBtnContainer = document.querySelector('.animateBtn')
    show(animateBtnContainer)
    const animateButton = document.querySelector('.animate-btn');
    animateBtnContainer.removeChild(animateButton)
    
    hide(document.querySelector('.reset'))

    clearBoards();
    show(document.querySelector('.start'))
}

function main() {
    const startBoard = document.querySelector('.startBoard');
    createInputBoard('start', startBoard)

    const goalBoard = document.querySelector('.goalBoard');
    createInputBoard('goal', goalBoard);

    const solveButton = document.querySelector('.play-btn');
    solveButton.addEventListener('click', solveClickHandler)

    const resetButton = document.querySelector('.reset-btn')
    resetButton.addEventListener('click', resetHandler)
}

document.addEventListener('DOMContentLoaded', main);