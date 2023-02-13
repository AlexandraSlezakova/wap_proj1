/**
 * @file Contains a function to generate the property names of the object and its prototype chain
 * @author Alexandra Slezakova <xsleza20@stud.fit.vutbr.cz>
 */

'use strict'

/***
 * Filters object properties by descriptor name.
 * @param obj Object that contains properties.
 * @param descriptors Object that contains one or more property descriptors.
 * @returns {*[]}
 */
function filterObjectProperties(obj, descriptors)
{
    let properties = [];

    for (let property of Object.keys(obj)) {
        let isDescriptor = true;

        for (let descriptor in descriptors) {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, property)[descriptor];
            if (propertyDescriptor !== descriptors[descriptor]) {
                isDescriptor = false;
                break;
            }
        }

        if (isDescriptor) {
            properties.push(property);
        }
    }

    return properties;
}

/***
 * Returns the names of properties for a given object and its prototype chain.
 * @param obj Object contains the properties that should be generated.
 * @param descriptors Object that contains one or more property descriptors.
 * @returns {string[]|*[]}
 */
function getObjectProperties(obj, descriptors)
{
    let obj_ = obj;
    let properties = [];

    while (obj_ !== null) {
        let objectProperties;

        if (descriptors && Object.keys(descriptors).length) {
            objectProperties = filterObjectProperties(obj_, descriptors);
        }
        else {
            objectProperties = Object.keys(obj_);
        }

        properties.unshift(...objectProperties);
        obj_ = Object.getPrototypeOf(obj_);
    }

    // prototype and input object keys
    return properties;
}

/***
 * Property generator.
 * @param obj Object contains the properties that should be generated.
 * @param descriptors Object that contains one or more property descriptors.
 * @returns {Generator<*|any, void, *>}
 */
export function* iterateProperties(obj, descriptors = undefined)
{
    let properties = getObjectProperties(obj, descriptors);

    for (let property of properties) {
        yield property;
    }
}