/**
 * main structrue
 * (主要结构)
 * @param {any} params source to be deep cloned
 * (被深复制的源)
 * @param {string} path optional, default is '$'
 * (非必需，默认是'$')
 */
module.exports = function deepClone(params, keepProto, path = '$') {
    const copyWith$ = deCycle(params, keepProto, path);
    const copy = retroCycle(copyWith$);
    return copy;
}
/**
 * replace a cycle reference into a path, and deepClone non-cycle value recursively 
 * (将循环引用替换为路径，将对象，普通类型值做遍历复制)
 * const o = { m: null }
 * o.m = o;
 * 
 * const oAfterDeCycle = deCycle(o);
 * `output of oAfterDeCycle:`
 * `{m: {'$ref': '$'}}`
 * 
 * @param {any} o source to be cloned(被克隆的source)
 * @param {String} path this is a executable js string, will be calc in eval function
 * (路径，将用于处理循环引用)
 * @returns a new o which cycle reference have been replaced with path
 * (深复制之后的对象，此时循环引用被替换为路径)
 */
function deCycle(o, keepProto, path) {
    // mark all o's properties and o itself with path, and store them into map
    // (将对象本身和它的所有属性标记上路径，存入字典)
    const map = new WeakMap();
    return (function dez(value, path) {
        if (value && typeof value === 'object') {
            const rt = Array.isArray(value) ? [] : {};
            // cycle reference detected, return with a path which been mapped by the reference;
            // (发现循环引用，此时用路径替换后返回)
            if (map.has(value)) {
                return {$ref: map.get(value)};
            }
            // mark path and store them
            // (标记路径)
            map.set(value, path)
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    const element = value[key];
                    if (element && typeof element === 'object') {
                        // copy recursively, and pass in new path
                        // (递归复制，并传入当前对象的路径)
                        rt[key] = dez(element, `${path}['${key}']`);
                    } else {
                        rt[key] = element;
                    }
                }
            }
            if (keepProto) {
                Object.setPrototypeOf(rt, Object.getPrototypeOf(value));
            }
            return rt;
        }
        return value;
    })(o, path);
}
/**
 * // replace path with cycle reference
 * (将路径替换为循环引用)
 * @param {any} params deepCloned value with path
 * (带有路径的对象) 
 */
function retroCycle(params) {
    // here the $ needs to be the same with function deepClone's second parameter
    // (这里的参数名要与deepClone的参数path一致)
    return (function dez($) {
        if ($ && typeof $ === 'object') {
            for (const key in $) {
                const element = $[key];
                if (typeof element === 'object') {
                    if ('$ref' in element) {
                        // path is a executable js string ,so we can eval to execute it
                        // (路径其实是可执行的js字符串，所以使用eval来执行)
                        $[key] = eval(element['$ref'])
                        continue;
                    }
                    // parse path recursively
                    // 递归解析路径
                    dez(element);
                }
            }
        }
        return $;
    })(params);
}
// get target type
function getType(v) {
    return Object.prototype.toString.call(v).match(/\[object (.*)\]/)[1].toLowerCase();
}