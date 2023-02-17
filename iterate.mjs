/**
 * @file Contains a function to generate the property names of the object and its prototype chain
 * @author Alexandra Slezakova <xsleza20@stud.fit.vutbr.cz>
 * @module iterate
 */

'use strict'

/***
 * Filters object properties by descriptor name.
 * @function filterObjectProperties
 *
 * @param {Object} obj Object that contains properties.
 * @param {Object} descriptors Object that contains property descriptors.
 * @returns {string[]} Filtered property names
 */
function filterObjectProperties(obj, descriptors)
{
    return Object.getOwnPropertyNames(obj).filter(property => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, property);

        for (let descriptor in descriptors) {
            if (propertyDescriptor[descriptor] !== descriptors[descriptor]) {
                return false;
            }
        }

        return true;
    });
}

/***
 * Returns the names of the properties for a given object and its prototype chain.
 * @function getObjectProperties
 *
 * @param {Object} obj Object contains the properties that should be generated.
 * @param {Object} descriptors Object that contains one or more property descriptors.
 * @returns {string[]} Array of property names
 */
function getObjectProperties(obj, descriptors)
{
    let obj_ = obj;
    let properties = [];

    while (obj_ !== null) {
        // filter object properties
        let objectProperties = filterObjectProperties(obj_, descriptors);

        properties.unshift(...objectProperties);
        obj_ = Object.getPrototypeOf(obj_);
    }

    return properties;
}

/**
 * Property generator.
 * @function iterateProperties
 *
 * @param {Object|undefined} obj Object contains the properties that should be generated.
 * @param {Object} descriptors Object that contains one or more property descriptors.
 * @yields {string|undefined} Property name
 */
export function* iterateProperties(obj, descriptors = {})
{
    if (obj === undefined) {
        yield undefined;
    }
    else {
        let properties = getObjectProperties(obj, descriptors);

        for (let property of properties) {
            yield property;
        }
    }
}