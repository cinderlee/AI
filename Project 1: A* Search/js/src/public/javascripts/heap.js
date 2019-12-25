'use strict';

export default class Heap{
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