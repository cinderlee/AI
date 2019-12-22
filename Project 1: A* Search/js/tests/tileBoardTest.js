/* eslint no-unused-expressions: "off" */
const path = require('path');
const chai = require('chai');
const expect = chai.expect; 
const modulePath = path.join(__dirname, '../src/tileBoard.js');
const TileBoard = require(modulePath);
console.log(modulePath);

describe('TileBoard', function() {
    it('generates a tile board', function() {
        const board = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        const pos = [2, 2];
        const tb = new TileBoard(board, pos);
        expect(tb.board).to.deep.equal(board);
    });
    it('checks that boards are not equal', function() {
        const board = [[1,2,3], [4,5,6], [7,8,0]];
        const pos = [2, 2];
        const tb = new TileBoard(board, pos);
        const boardOther = [[1, 2, 3], [4, 0, 6], [7, 5, 8]];
        const posOther = [1, 1];
        const tbOther = new TileBoard(boardOther, posOther);
        expect(tb.isEqual(tbOther)).to.deep.equal(false);
    });
    it('checks that boards are equal', function() {
        const board = [[1,2,3], [4,5,6], [7,8,0]];
        const pos = [2, 2];
        const tb = new TileBoard(board, pos);
        const tbOther = new TileBoard(board, pos);
        expect(tb.isEqual(tbOther)).to.deep.equal(true);
    });
    it('checks board is not explored', function() {
        const board = [[1,2,3], [4,5,6], [7,8,0]];
        const pos = [2, 2];
        const tb = new TileBoard(board, pos);
        const boardOther = [[1, 2, 3], [4, 0, 6], [7, 5, 8]];
        const posOther = [1, 1];
        const tbOther = new TileBoard(boardOther, posOther);
        const explored = [tbOther];
        expect(tb.isExplored(explored)).to.deep.equal(false);
    });
    it('checks that board is explored', function() {
        const board = [[1,2,3], [4,5,6], [7,8,0]];
        const pos = [2, 2];
        const tb = new TileBoard(board, pos);
        const tbOther = new TileBoard(board, pos);
        const explored = [tbOther];
        expect(tb.isExplored(explored)).to.deep.equal(true);
    });
});