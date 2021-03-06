
var object = require('./object');
var mixin = object.mixin;

/**
 * @param {Function} [[parent=Object]]
 * @param {Object} declaration
 * @param {string} [declaration.__name]
 * @param {Function} [declaration.constructor]
 * @param {Function} [declaration._init]
 * @returns {Function}
 */
function createClass(parent, declaration) {
    if (arguments.length == 1) {
        declaration = parent;
        parent = Object;
    } else if (parent === undefined) {
        parent = Object;
    }

    var constructor;

    if (declaration.hasOwnProperty('constructor')) {
        constructor = declaration.constructor;
    } else {
        constructor = declaration.constructor = function constructor() {
            var instance = this instanceof constructor ? this : Object.create(constructor.prototype);

            if (instance._init) {
                instance._init.apply(instance, arguments);
            }
            return instance;
        };
    }

    var proto = constructor.prototype = Object.create(typeof parent == 'function' ? parent.prototype : parent);

    if (declaration.static) {
        mixin(constructor, declaration.static);
        delete declaration.static;
    }

    mixin(proto, declaration);

    if (!proto.hasOwnProperty('toString') && proto.hasOwnProperty('__name')) {
        proto.toString = function() {
            return '[object ' + this.__name + ']';
        };
    }

    return constructor;
}

module.exports = createClass;
