/**
 * @file Test script for iterate.mjs
 * @author Alexandra Slezakova <xsleza20@stud.fit.vutbr.cz>
 */

'use strict'

import { iterateProperties } from "./iterate.mjs";

function logGeneratedValues(gen) {
    for (let prop of gen) {
        console.log(prop);
    }
}

console.log("------ EXAMPLE 1");
let obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
}
logGeneratedValues(iterateProperties(obj)) // a b c d

console.log("------ EXAMPLE 2");
let p1 = Object.create(obj);
Object.defineProperty(p1, "d", {
    value: 5,
    writable: true,
    enumerable: true
});
logGeneratedValues(iterateProperties(p1)) // a b c d d

console.log("------ EXAMPLE 3");
let p2 = Object.create(p1);
Object.defineProperty(p2, "e", {
    value: 6,
    writable: false,
    enumerable: true,
    configurable: true
});

logGeneratedValues(iterateProperties(p2)) // a b c d d e

console.log("------ EXAMPLE 4");
Object.defineProperty(p2, "f", {
    value: 6,
    writable: false,
    enumerable: true,
    configurable: false
});

// PROPERTY DESCRIPTOR FILTER
logGeneratedValues(iterateProperties(p2, { writable: false, configurable: true })) // e

console.log("------ EXAMPLE 5");
logGeneratedValues(iterateProperties(p2, { writable: false, configurable: false })) // f

console.log("------ EXAMPLE 6");
logGeneratedValues(iterateProperties(p2, { writable: true })) // a b c d d

// ITERATOR
console.log("------ EXAMPLE 7");
let it1 = iterateProperties(p2, { writable: false, configurable: false });
console.log(it1.next().value); // f
console.log(it1.next().value); // undefined
let it2 = iterateProperties(p2, { writable: true });
console.log(it2.next().value); // a
console.log(it2.next().value); // b
console.log(it2.next().value); // c

console.log("------ EXAMPLE 8");
function Square(width, length) {
    this.width = width;
    this.length = length;
}

logGeneratedValues(iterateProperties(new Square(2, 3))) // width length

