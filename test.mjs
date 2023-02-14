/**
 * @file Test script for iterate.mjs
 * @author Alexandra Slezakova <xsleza20@stud.fit.vutbr.cz>
 */

'use strict'

import { iterateProperties } from "./iterate.mjs";
import assert from 'assert';

const objectPrototypeProperties = Object.getOwnPropertyNames(Object.prototype);

describe('Undefined Object', function () {
    it('should not throw an error', function () {
        assert.deepEqual([...iterateProperties(undefined)], [ undefined ]);
    })
});

describe('Empty Object', function () {
    it('should return (Object.prototype properties)', function () {
        let obj = {}

        assert.deepEqual([...iterateProperties(obj)], objectPrototypeProperties);
    });
});

describe('Simple Object', function () {
    it('should return (Object.prototype properties)', function () {
        assert.deepEqual([...iterateProperties(Object.prototype)], objectPrototypeProperties);
    });

    it('should return (Object.prototype properties) a b c d', function () {
        let obj = {
            a: 1,
            b: 2,
            c: 3,
            d: 4
        }

        assert.deepEqual([...iterateProperties(obj)], [...objectPrototypeProperties, 'a', 'b', 'c', 'd']);
    });
});

let obj = {
    a: 1,
    b: 2,
    c: 3
}

let p1 = Object.create(obj);
Object.defineProperty(p1, 'c', {
    value: 5,
    writable: true,
    enumerable: true
});

let p2 = Object.create(p1);
Object.defineProperty(p2, 'd', {
    value: 6,
    writable: false,
    enumerable: true,
    configurable: true
});

describe('Prototype Chain', function () {
    it('should return (Object.prototype properties) (prototype: a b c) c', function () {
        assert.deepEqual([...iterateProperties(p1)], [...objectPrototypeProperties, 'a', 'b', 'c', 'c']);
    });

    it('should return (Object.prototype properties) (prototype: a b c) (prototype: c) d', function () {
        assert.deepEqual([...iterateProperties(p2)], [...objectPrototypeProperties, 'a', 'b', 'c', 'c', 'd']);
    });

    it('should return (Object.prototype properties) (prototype: a b c) (prototype: c) d e', function () {
        Object.defineProperty(p2, 'e', {
            value: 6,
            writable: false,
            enumerable: true,
            configurable: false
        });

        assert.deepEqual([...iterateProperties(p2)], [...objectPrototypeProperties, 'a', 'b', 'c', 'c', 'd', 'e']);
    });
});

describe('Prototype Chain With Property Descriptor', function () {
    it('should return d', function () {
        assert.deepEqual([...iterateProperties(p2, { writable: false, configurable: true })], ['d']);
    });

    it('should return e', function () {
        assert.deepEqual([...iterateProperties(p2, { writable: false, configurable: false })], ['e']);
    });

    it('should return d e', function () {
        assert.deepEqual([...iterateProperties(p2, { writable: false })], ['d', 'e']);
    });

    it('should return (some of Object.prototype properties) a b c c', function () {
        const writableProperties = Object.getOwnPropertyNames(Object.prototype)
            .filter(p => Object.getOwnPropertyDescriptor(Object.prototype, p)['writable']);

        assert.deepEqual([...iterateProperties(p2, { writable: true })], [...writableProperties, 'a', 'b', 'c', 'c']);
    });
});

describe('Iterator', function () {
    let it1 = iterateProperties(p2, { writable: false, configurable: false });
    let it2 = iterateProperties(p2, { enumerable: true });

    it('should return e undefined', function () {
        assert.equal(it1.next().value, 'e');
        assert.equal(it1.next().value, undefined);
    });

    it('should return a b c', function () {
        assert.equal(it2.next().value, 'a');
        assert.equal(it2.next().value, 'b');
        assert.equal(it2.next().value, 'c');
    });
});

describe('Constructor', function () {
    function Square(width, length) {
        this.width = width;
        this.length = length;
    }

    it('should return width length', function () {
        assert.deepEqual([...iterateProperties(new Square(2, 3), { enumerable: true })], ['width', 'length']);
    });
});

describe('Class', function () {
    class Square {
        width = undefined;
        length = undefined;
        area = undefined;

        constructor(width, length) {
            this.width = width;
            this.length = length;
        }
    }

    it('should return width length', function () {
        assert.deepEqual([...iterateProperties(new Square(2, 3), { enumerable: true })], ['width', 'length', 'area']);
    });
});

describe('Class Inheritance', function () {
    class Animal {
        constructor(name) {
            this.name = name;
        }
    }

    class Dog extends Animal {
        breed = undefined;

        constructor(name, breed) {
            super(name);
            this.breed = breed;
        }
    }

    class Lion extends Animal {
        weight = undefined;
        country = undefined;

        constructor(name, weight, country) {
            super(name);
            this.weight = weight;
            this.country = country;
        }
    }

    it('should return name weight country', function () {
        assert.deepEqual([...iterateProperties(new Lion('Tom', 500, 'Angola'), { enumerable: true })], ['name', 'weight', 'country']);
    });
});




