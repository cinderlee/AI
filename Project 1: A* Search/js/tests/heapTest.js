/* eslint no-unused-expressions: "off" */
const path = require('path');
const chai = require('chai');
const expect = chai.expect; 
const modulePath = path.join(__dirname, '../src/heap.js');
const Heap = require(modulePath);
console.log(modulePath);

describe('Heap', function() {
    it('generates a heap given a non-heapified list', function() {
        const heap = new Heap([4, 6, 1, 2, 8, 3, 9]);
        const expectHeap = [1, 2, 3, 6, 8, 4, 9];
        expect(heap.heap).to.deep.equal(expectHeap);
    });
    it('generates an empty heap', function() {
        const heap = new Heap();
        expect(heap.heap.length).to.deep.equal(0);
    });
    it('pops the minimum element from heap', function() {
        const heap = new Heap([4, 6, 1, 2, 8, 3, 9]);
        const min = heap.pop(); 
        const expectMin = 1;
        const expectHeap = [2, 6, 3, 9, 8, 4];
        expect(min).to.deep.equal(expectMin);
        expect(heap.heap).to.deep.equal(expectHeap);
    });
    it('pushes an element into heap', function() {
        const heap = new Heap([2, 6, 3, 9, 8, 4]);
        heap.push(5);
        let expectHeap = [2, 6, 3, 9, 8, 4, 5];
        expect(heap.heap).to.deep.equal(expectHeap);
        heap.push(7);
        expectHeap = [2, 6, 3, 7, 8, 4, 5, 9];
        expect(heap.heap).to.deep.equal(expectHeap);
    });
    it('iterates through a heap', function() {
        const heap = new Heap([2, 6, 3, 7, 8, 4, 5, 9]);
        const expectedIter = [2, 6, 3, 7, 8, 4, 5, 9];
        const iterLst = [];
        for (const elem of heap){
            iterLst.push(elem);
        }
        expect(expectedIter).to.deep.equal(iterLst);
    });
});