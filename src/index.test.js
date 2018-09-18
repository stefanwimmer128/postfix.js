/* @flow */

import {
    assert,
} from "chai";
import {
    describe,
    it,
} from "mocha";

import postfix from ".";

describe("index.js", () => {
    it("60 5 7 5 - * /", () => {
        assert.deepEqual(postfix("60 5 7 5 - * /"), [ 6 ]);
    });
    
    it("60 5 / 7 5 - *", () => {
        assert.deepEqual(postfix("60 5 / 7 5 - *"), [ 24 ]);
    });
});
