/* eslint no-unused-expressions: "off" */
const path = require('path');
const chai = require('chai');
const expect = chai.expect; 
const modulePath = path.join(__dirname, '../src/heap.js');
const Heap = require(modulePath);
console.log(modulePath);

describe('heap', function() {
    describe('Heap', function() {
        it('generates a heap given a list', function() {
            const heap = Heap([4, 6, 1, 2, 8, 3, 9])
            const expectMin = 1
            expect(heap.pop()).to.deep.equal(expectMin);
        });
    })
});