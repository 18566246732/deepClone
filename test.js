const deepClone = require('./index.js');

O.prototype.sayID = function() {
    console.log('id is: ', this.id);
}

function O(id) {
    this.m = null;
    this.fn = () => {
        console.log('\nhi, i am still alive!');
        return true;
    };
    this.arr = [1],
    this.id = id;
    this.set = new Set();
}

const o = new O(123);

o.m = o;
const oCopy = deepClone(o);
o.arr.push(2);
o.set.add('set');
console.log('\noCopy structrue:', oCopy);
console.log('\nis oCopy.arr affected ?', oCopy.arr.includes(2));
console.log('\nis copy cycle reference successful ?', oCopy.m != o && oCopy.m === oCopy);
console.log('\nis fn functional ?', typeof oCopy.fn === 'function');
console.log('\nis proto left ?', typeof oCopy.sayID === 'function');

const oCopyWithProto = deepClone(o, true);
console.log('\nis proto left ?', typeof oCopyWithProto.sayID === 'function');
