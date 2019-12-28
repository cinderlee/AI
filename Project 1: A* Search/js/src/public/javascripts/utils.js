export const sideVal = 100;
export const borderVal = 1;
export const matchColor = '#b3e6b3';
export const mismatchColor = '#ffb3b3';

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

export function createNodeElement(type, attributes, styles=null){
    const node = document.createElement(type)
    for (const name in attributes){
        if (attributes.hasOwnProperty(name)){
            node.setAttribute(name, attributes[name])
        }
    }
    if (styles){
        for (const name in styles){
            if (styles.hasOwnProperty(name)){
                node.style.setProperty(name, styles[name])
            }
        }
    }
    return node; 
}