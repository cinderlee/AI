export const sideVal = 100;
export const borderVal = 1;

export function hide(element){
    element.style.display = 'none';
}

export function show(element){
    element.style.display = 'inline';
}

export function deepCopy(board){
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