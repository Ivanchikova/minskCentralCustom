import 'reflect-metadata';
import { expect } from 'chai';

describe('sample test', () => {

    it('should return sum 7', () => {
        // arrange
        const expectedSum = 7;
        const a = 2;
        const b = 5;

        // act
        const sum = a + b;

        // assert
        expect(sum).to.eql(expectedSum);
    })
})