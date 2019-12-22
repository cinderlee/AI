class TileBoard {
    constructor( board, pos ){
        this.board = board 
        this.pos = pos
        this.fn = 0
        this.path = []
    }

    valueOf(){
        return this.fn
    }

    heuristic( goalState ){
        const goal = {}

        for( let row = 0; row < 3; row++ ){
            for( let col = 0; col < 3; col++ ){
                if( goalState.board[ row ][ col ] !== 0 ){
                    const number = goalState.board[ row ][ col ]
                    goal[ number ] = [ row, col ]
                }
            }
        }

        let total = 0;
        
        for( let rowOther = 0; rowOther < 3; rowOther++ ){
            for( let colOther = 0; colOther < 3; colOther++ ){
                if( this.board[ rowOther ][ colOther ] !== 0 ){
                    const num = this.board[ rowOther ][ colOther ]
                    const [ x, y ] = [...goal[ num ]]
                    total += Math.abs( rowOther - x ) + Math.abs( colOther - y )
                }
            }
        }

        return total
    }

    isGoal( goalState ){
        return this.isEqual(goalState)
    }

    isEqual(other){
        for (let row = 0; row < 3; row++ ){
            for (let col = 0; col < 3; col++){
                if (this.board[row][col] !== other.board[row][col]){
                    return false;
                }
            }
        }
        return true
    }

    isExplored( explored ){
        for( const node of explored ){
            if( this.isEqual(node) ){
                return true
            }
        }
        return false;
    }
}

module.exports = TileBoard;