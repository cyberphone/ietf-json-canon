// Sample showing how a naive use of JCS will fail
'use strict';
var canonicalize = function(object) {

    var buffer = '';
    serialize(object);
    return buffer;

    function serialize(object) {
        if (object === null || typeof object !== 'object' ||
            object.toJSON) {
            /////////////////////////////////////////////////
            // Primitive type or toJSON - Use ES6/JSON     //
            /////////////////////////////////////////////////
            buffer += JSON.stringify(object);

        } else if (Array.isArray(object)) {
            /////////////////////////////////////////////////
            // Array - Maintain element order              //
            /////////////////////////////////////////////////
            buffer += '[';
            let next = false;
            object.forEach((element) => {
                if (next) {
                    buffer += ',';
                }
                next = true;
                /////////////////////////////////////////
                // Array element - Recursive expansion //
                /////////////////////////////////////////
                serialize(element);
            });
            buffer += ']';

        } else {
            /////////////////////////////////////////////////
            // Object - Sort properties before serializing //
            /////////////////////////////////////////////////
            buffer += '{';
            let next = false;
            Object.keys(object).sort().forEach((property) => {
                if (next) {
                    buffer += ',';
                }
                next = true;
                ///////////////////////////////////////////////
                // Property names are strings - Use ES6/JSON //
                ///////////////////////////////////////////////
                buffer += JSON.stringify(property);
                buffer += ':';
                //////////////////////////////////////////
                // Property value - Recursive expansion //
                //////////////////////////////////////////
                serialize(object[property]);
            });
            buffer += '}';
        }
    }
};

const jstring =
  '{"time": "2019-01-28T07:45:10Z", "big": "055", "val": 3.5}';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

var object = JSON.parse(jstring,
  (k,v) => k == 'time' ? new Date(v) : k == 'big' ? BigInt(v) : v
);

console.log(canonicalize(object));