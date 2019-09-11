the idea is inspired by `Douglas Crockford`'s work of handle cycle reference

## basic usage
```js
const deepClone = require('clonedeeply');
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
}

const o = new O(123);

o.m = o;
// default is not keep proto, set the 2nd parameter to true to keep proto
const oCopy = deepClone(o);
```

## supported environment

- browser
- nodejs

## example

```js
const oCopy = deepClone(o);
o.arr.push(2);
// oCopy won't contain number 2
console.log('\nis oCopy.arr affected ?', oCopy.arr.includes(2));
// oCopy's cycle referred object is oCopy itself
console.log('\nis copy cycle reference successful ?', oCopy.m != o && oCopy.m === oCopy);
// function is still here
console.log('\nis fn functional ?', typeof oCopy.fn === 'function');
// proto is lost
console.log('\nis proto left ?', typeof oCopy.sayID === 'function');
// keep proto if 2nd param is true
const oCopyWithProto = deepClone(o, true);
console.log('\nis proto left ?', typeof oCopyWithProto.sayID === 'function');

```
