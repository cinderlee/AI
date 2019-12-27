import { sideVal, borderVal } from './utils.js';

function changeColors(zeroId, otherId, goalBoard){
    const otherRow = Math.floor(zeroId/3)
    const otherCol = zeroId % 3
    const zeroRow = Math.floor(otherId / 3)
    const zeroCol = otherId % 3;

    const zeroBox = document.getElementById(`animatebox${zeroId}`);
    const otherBox = document.getElementById(`animatebox${otherId}`)

    const otherVal = parseInt(otherBox.firstChild.nodeValue)

    if (goalBoard [otherRow][otherCol] === otherVal){
        otherBox.style.backgroundColor = '#b3e6b3'
    } else{
        otherBox.style.backgroundColor = '#ffb3b3'
    }

    if (goalBoard [zeroRow][zeroCol] === 0){
        zeroBox.style.backgroundColor = '#b3e6b3'
    } else{
        zeroBox.style.backgroundColor = '#ffb3b3'
    }
    zeroBox.setAttribute('id',`animatebox${otherId}`)
    otherBox.setAttribute('id', `animatebox${zeroId}`)
}

export async function animateTiles(zeroId, otherId, direction, goalBoard){
    const zeroBox = document.getElementById(`animatebox${zeroId}`);
    const otherBox = document.getElementById(`animatebox${otherId}`)
    let pos = 0;
    const id = setInterval(frame, 10);

    return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });

    function frame() {
        if (pos == sideVal + 2 * borderVal) {
            clearInterval(id);
            changeColors(zeroId, otherId, goalBoard)
        } else {
            pos++;
            const zeroLeftPos = parseInt(zeroBox.style.left.replace('px', ''));
            const zeroTopPos = parseInt(zeroBox.style.top.replace('px', ''))
            const otherLeftPos = parseInt(otherBox.style.left.replace('px', ''))
            const otherTopPos = parseInt(otherBox.style.top.replace('px', ''))
            if (direction === 'U'){
                zeroBox.style.top = `${zeroTopPos - 1}px`
                otherBox.style.top = `${otherTopPos + 1}px`
            } else if (direction === 'D'){
                zeroBox.style.top = `${zeroTopPos + 1}px`
                otherBox.style.top = `${otherTopPos - 1}px`
            } else if (direction === 'L'){
                zeroBox.style.left = `${zeroLeftPos - 1}px`
                otherBox.style.left = `${otherLeftPos + 1}px`
            } else{
                zeroBox.style.left = `${zeroLeftPos + 1}px`
                otherBox.style.left = `${otherLeftPos - 1}px`
            }
        } 
    }
}