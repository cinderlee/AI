const cardNum = 9; 
const col = 3;

class Heap{
    constructor(heapLst = []){
        this.heap = heapLst;
        this.heapify();
    }

    bubbleUp(index){
        while (index !== 0){
            let parentIndex;
            if (index % 2 === 0){
                parentIndex = Math.floor((index - 2) / 2);
            }
            else{
                parentIndex = Math.floor((index - 1) / 2);
            }
            if (this.heap[index] <= this.heap[parentIndex]){
                const temp = this.heap[index];
                this.heap[index] = this.heap[parentIndex];
                this.heap[parentIndex] = temp;
                index = parentIndex;
            }
            else{
                break;
            }
        }
    }
    
    bubbleDown(index){
        while (index < this.heap.length){
            let childTwo;
            let minChild;

            if (index * 2 + 1 < this.heap.length){
                 minChild = index * 2 + 1;
            } else {
                break; 
            }
            if (index * 2 + 2 < this.heap.length){
                childTwo = index * 2 + 2;
                if (this.heap[childTwo] < this.heap[minChild]){
                    minChild = childTwo;
                }
            }

            if (this.heap[index] > this.heap[minChild]){
                const temp = this.heap[index];
                this.heap[index] = this.heap[minChild];
                this.heap[minChild] = temp;
                index = minChild;
            }
            else{
                break;
            }
        }
    }

    push(element){
        this.heap.push(element);
        const index = this.heap.length - 1;
        this.bubbleUp(index);
    }

    pop(){
        const minimum = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.bubbleDown(0);

        return minimum;
    }

    heapify(){
        for (let index = Math.floor(this.heap.length / 2); index >= 0; index--){
            this.bubbleDown(index);
        }
    }

    *[Symbol.iterator]() {
        for (const element of this.heap) {
            yield element;
        }
    }
}

class TileBoard {
    constructor( board, pos ){
        this.board = board; 
        this.pos = pos;
        this.fn = 0;
        this.path = [];
    }

    locateZero() {
        for(let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (this.board[row][col] === 0){
                    return [row, col]
                }
            }
        }
    }

    valueOf(){
        return this.fn;
    }

    heuristic( goalState ){
        const goal = {};

        for( let row = 0; row < 3; row++ ){
            for( let col = 0; col < 3; col++ ){
                if( goalState.board[ row ][ col ] !== 0 ){
                    const number = goalState.board[ row ][ col ];
                    goal[ number ] = [row, col];
                }
            }
        }

        let total = 0;
        
        for( let rowOther = 0; rowOther < 3; rowOther++ ){
            for( let colOther = 0; colOther < 3; colOther++ ){
                if( this.board[ rowOther ][ colOther ] !== 0 ){
                    const num = this.board[ rowOther ][ colOther ];
                    const [x, y] = [...goal[ num ]];
                    total += Math.abs( rowOther - x ) + Math.abs( colOther - y );
                }
            }
        }

        return total;
    }

    isGoal( goalState ){
        return this.isEqual(goalState);
    }

    isEqual(other){
        for (let row = 0; row < 3; row++ ){
            for (let col = 0; col < 3; col++){
                if (this.board[row][col] !== other.board[row][col]){
                    return false;
                }
            }
        }
        return true;
    }

    isExplored( explored ){
        for( const node of explored ){
            if( this.isEqual(node) ){
                return true;
            }
        }
        return false;
    }
}

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

async function animateTiles(zeroId, otherId, direction){
    const zeroBox = document.getElementById(`animatebox${zeroId}`);
    console.log(zeroBox)
    const otherBox = document.getElementById(`animatebox${otherId}`)
    let pos = 0;
    const id = setInterval(frame, 10);
    zeroBox.setAttribute('id',`animatebox${otherId}`)
    otherBox.setAttribute('id', `animatebox${zeroId}`)
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

function beDead(millisecondsToWait = 2000){
    const now = new Date().getTime();
    while (new Date().getTime() < now + millisecondsToWait){

    }
}

async function animation(zeroId, path) {
    for (const element of path){
        await animateTiles(zeroId, ...element)
        zeroId = element[0]
    }
}

function main() {
    const startBoard = document.querySelector('.startBoard');
    createBoard('start', startBoard)

    const goalBoard = document.querySelector('.goalBoard');
    createBoard('goal', goalBoard);

    const solveButton = document.querySelector('.play-btn');
    solveButton.addEventListener('click', function() {
        const error_div = document.querySelector('.error-message');
        let startInfo = fetchBoardValues('start')
        let goalInfo = fetchBoardValues('goal');
        if (startInfo[0] === 'Empty cell detected.' || goalInfo[0] === 'Empty cell detected.'){
            error_div.setAttribute('style', 'display:block');
            console.log('blegh')
        }
        else{
            error_div.setAttribute('style', 'display:none');

            const initial = new TileBoard(...startInfo);
            const goal = new TileBoard(...goalInfo);
            initial.fn = initial.heuristic(goal);

            const result = search(initial, goal);
            const startBoard = startInfo[0]
            let [r, c] = [...startInfo [1]]
            const path = []
            for (const elem of result[0].path){
                if (elem === 'U'){
                    r--;
                }
                else if(elem === 'D'){
                    r++;
                }
                else if (elem === 'L'){
                    c--
                }
                else{
                    c++;
                }
                const idNum = r * 3 + c;
                path.push( [idNum, elem]);
            }
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
                // container.setAttribute('style', `left:${(colVal * 100)}px`)
                container.appendChild(containerVal)
            }
            
            const animBtn = document.querySelector('.animate-btn');
            const [startR, startC] = [...startInfo[1]]
            let zeroId = startR * 3 + startC;
            animBtn.addEventListener('click', () => animation(zeroId, path))

        }
    })

}

document.addEventListener('DOMContentLoaded', main);